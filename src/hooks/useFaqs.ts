import { useState, useEffect, useCallback } from 'react'
import { scopedStorage } from '@lark-apaas/client-toolkit-lite'
import { MOCK_FAQS, type IFaqItem } from '@/data/faq'

const STORAGE_KEY = '__auto_parts_faqs'

function loadFaqs(): IFaqItem[] {
  try {
    const raw = scopedStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // 解析失败回退到 mock
  }
  // 首次：写入 mock 数据
  scopedStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_FAQS))
  return MOCK_FAQS
}

function saveFaqs(faqs: IFaqItem[]) {
  scopedStorage.setItem(STORAGE_KEY, JSON.stringify(faqs))
}

export function useFaqs() {
  const [faqs, setFaqs] = useState<IFaqItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setFaqs(loadFaqs())
    setLoaded(true)
  }, [])

  const addFaq = useCallback((faq: Omit<IFaqItem, 'id' | 'createdAt' | 'source'> & { id?: string }) => {
    setFaqs(prev => {
      const newFaq: IFaqItem = {
        ...faq,
        id: faq.id || `faq-${Date.now()}`,
        source: 'user',
        createdAt: Date.now(),
      }
      const next = [...prev, newFaq]
      saveFaqs(next)
      return next
    })
  }, [])

  const updateFaq = useCallback((id: string, updates: Partial<IFaqItem>) => {
    setFaqs(prev => {
      const next = prev.map(f => f.id === id ? { ...f, ...updates } : f)
      saveFaqs(next)
      return next
    })
  }, [])

  const deleteFaq = useCallback((id: string) => {
    setFaqs(prev => {
      const next = prev.filter(f => f.id !== id)
      saveFaqs(next)
      return next
    })
  }, [])

  const resetFaqs = useCallback(() => {
    scopedStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_FAQS))
    setFaqs(MOCK_FAQS)
  }, [])

  return { faqs, loaded, addFaq, updateFaq, deleteFaq, resetFaqs }
}
