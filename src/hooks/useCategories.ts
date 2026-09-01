import { useState, useEffect, useCallback } from 'react'
import { MOCK_CATEGORIES, type ICategory } from '@/data/categories'
import { useContent } from './useContent'

const STORAGE_KEY = '__youpei_categories'

function loadLocalCategories(): ICategory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // 忽略
  }
  return MOCK_CATEGORIES
}

function saveLocalCategories(cats: ICategory[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cats))
  } catch {
    // 忽略存储错误
  }
}

export function useCategories() {
  // 使用 useContent 从服务器读取和保存分类数据
  const { data: serverCategories, loaded: serverLoaded, replaceData, syncing, syncError } = useContent<ICategory[]>('categories', MOCK_CATEGORIES)
  
  const [categories, setCategories] = useState<ICategory[]>(loadLocalCategories())
  const [loaded, setLoaded] = useState(false)

  // 当服务器数据加载完成后，使用服务器数据
  useEffect(() => {
    if (serverLoaded) {
      if (serverCategories && Array.isArray(serverCategories) && serverCategories.length > 0) {
        setCategories(serverCategories)
        saveLocalCategories(serverCategories)
      } else {
        // 服务器没有数据，使用本地数据并保存到服务器
        const localCats = loadLocalCategories()
        setCategories(localCats)
        replaceData(localCats).catch(() => {})
      }
      setLoaded(true)
    }
  }, [serverLoaded, serverCategories, replaceData])

  const addCategory = useCallback((cat: Omit<ICategory, 'id' | 'order'> & { id?: string; order?: number }) => {
    setCategories(prev => {
      const maxOrder = prev.reduce((m, c) => Math.max(m, c.order), 0)
      const newCat: ICategory = {
        ...cat,
        id: cat.id || `cat-${Date.now()}`,
        order: cat.order ?? maxOrder + 1,
      }
      const next = [...prev, newCat]
      saveLocalCategories(next)
      // 异步保存到服务器（fire-and-forget）
      replaceData(next).catch(() => {})
      return next
    })
  }, [replaceData])

  const updateCategory = useCallback((id: string, updates: Partial<ICategory>) => {
    setCategories(prev => {
      const next = prev.map(c => c.id === id ? { ...c, ...updates } : c)
      saveLocalCategories(next)
      // 异步保存到服务器（fire-and-forget）
      replaceData(next).catch(() => {})
      return next
    })
  }, [replaceData])

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => {
      const next = prev.filter(c => c.id !== id).sort((a, b) => a.order - b.order).map((c, i) => ({ ...c, order: i + 1 }))
      saveLocalCategories(next)
      // 异步保存到服务器（fire-and-forget）
      replaceData(next).catch(() => {})
      return next
    })
  }, [replaceData])

  const resetCategories = useCallback(() => {
    saveLocalCategories(MOCK_CATEGORIES)
    setCategories(MOCK_CATEGORIES)
    // 异步保存到服务器（fire-and-forget）
    replaceData(MOCK_CATEGORIES).catch(() => {})
  }, [replaceData])

  const getCategoryById = useCallback((id: string) => {
    return categories.find(c => c.id === id)
  }, [categories])

  return {
    categories,
    loaded,
    addCategory,
    updateCategory,
    deleteCategory,
    resetCategories,
    getCategoryById,
    syncing,
    syncError,
  }
}
