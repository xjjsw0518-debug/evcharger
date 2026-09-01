import { useState, useEffect, useCallback } from 'react'
import { MOCK_FAQS, type IFaqItem } from '@/data/faq'
import { useContent } from './useContent'

const STORAGE_KEY = '__auto_parts_faqs'

function loadLocalFaqs(): IFaqItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // 解析失败回退到 mock
  }
  return MOCK_FAQS
}

function saveLocalFaqs(faqs: IFaqItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(faqs))
  } catch {
    // 忽略存储错误
  }
}

export function useFaqs() {
  // 使用 useContent 从服务器读取和保存 FAQ 数据
  const { data: serverFaqs, loaded: serverLoaded, replaceData, syncing, syncError } = useContent<IFaqItem[]>('faq', MOCK_FAQS)
  
  const [faqs, setFaqs] = useState<IFaqItem[]>(loadLocalFaqs())
  const [loaded, setLoaded] = useState(false)

  // 当服务器数据加载完成后，使用服务器数据
  useEffect(() => {
    if (serverLoaded) {
      if (serverFaqs && Array.isArray(serverFaqs) && serverFaqs.length > 0) {
        setFaqs(serverFaqs)
        saveLocalFaqs(serverFaqs)
      } else {
        // 服务器没有数据，使用本地数据并保存到服务器
        const localFaqs = loadLocalFaqs()
        setFaqs(localFaqs)
        replaceData(localFaqs).catch(() => {})
      }
      setLoaded(true)
    }
  }, [serverLoaded, serverFaqs, replaceData])

  const addFaq = useCallback((faq: Omit<IFaqItem, 'id' | 'createdAt' | 'source'> & { id?: string }) => {
    setFaqs(prev => {
      const newFaq: IFaqItem = {
        ...faq,
        id: faq.id || `faq-${Date.now()}`,
        source: 'user',
        createdAt: Date.now(),
      }
      const next = [...prev, newFaq]
      saveLocalFaqs(next)
      // 异步保存到服务器（fire-and-forget）
      replaceData(next).catch(() => {})
      return next
    })
  }, [replaceData])

  const updateFaq = useCallback((id: string, updates: Partial<IFaqItem>) => {
    setFaqs(prev => {
      const next = prev.map(f => f.id === id ? { ...f, ...updates } : f)
      saveLocalFaqs(next)
      // 异步保存到服务器（fire-and-forget）
      replaceData(next).catch(() => {})
      return next
    })
  }, [replaceData])

  const deleteFaq = useCallback((id: string) => {
    setFaqs(prev => {
      const next = prev.filter(f => f.id !== id)
      saveLocalFaqs(next)
      // 异步保存到服务器（fire-and-forget）
      replaceData(next).catch(() => {})
      return next
    })
  }, [replaceData])

  const resetFaqs = useCallback(() => {
    saveLocalFaqs(MOCK_FAQS)
    setFaqs(MOCK_FAQS)
    // 异步保存到服务器（fire-and-forget）
    replaceData(MOCK_FAQS).catch(() => {})
  }, [replaceData])

  return { 
    faqs, 
    loaded, 
    addFaq, 
    updateFaq, 
    deleteFaq, 
    resetFaqs,
    syncing,
    syncError,
  }
}
