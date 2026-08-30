import { useState, useEffect, useCallback } from 'react'
import { scopedStorage } from '@lark-apaas/client-toolkit-lite'
import { MOCK_CATEGORIES, type ICategory } from '@/data/categories'

const STORAGE_KEY = '__youpei_categories'

function loadCategories(): ICategory[] {
  try {
    const raw = scopedStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // 忽略
  }
  scopedStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CATEGORIES))
  return MOCK_CATEGORIES
}

function saveCategories(cats: ICategory[]) {
  scopedStorage.setItem(STORAGE_KEY, JSON.stringify(cats))
}

export function useCategories() {
  const [categories, setCategories] = useState<ICategory[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setCategories(loadCategories())
    setLoaded(true)
  }, [])

  const addCategory = useCallback((cat: Omit<ICategory, 'id' | 'order'> & { id?: string; order?: number }) => {
    setCategories(prev => {
      const maxOrder = prev.reduce((m, c) => Math.max(m, c.order), 0)
      const newCat: ICategory = {
        ...cat,
        id: cat.id || `cat-${Date.now()}`,
        order: cat.order ?? maxOrder + 1,
      }
      const next = [...prev, newCat]
      saveCategories(next)
      return next
    })
  }, [])

  const updateCategory = useCallback((id: string, updates: Partial<ICategory>) => {
    setCategories(prev => {
      const next = prev.map(c => c.id === id ? { ...c, ...updates } : c)
      saveCategories(next)
      return next
    })
  }, [])

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => {
      const next = prev.filter(c => c.id !== id).sort((a, b) => a.order - b.order).map((c, i) => ({ ...c, order: i + 1 }))
      saveCategories(next)
      return next
    })
  }, [])

  const moveCategory = useCallback((id: string, direction: 'up' | 'down') => {
    setCategories(prev => {
      const sorted = [...prev].sort((a, b) => a.order - b.order)
      const idx = sorted.findIndex(c => c.id === id)
      if (idx === -1) return prev
      if (direction === 'up' && idx === 0) return prev
      if (direction === 'down' && idx === sorted.length - 1) return prev

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1
      const tempOrder = sorted[idx].order
      sorted[idx] = { ...sorted[idx], order: sorted[targetIdx].order }
      sorted[targetIdx] = { ...sorted[targetIdx], order: tempOrder }
      const next = sorted.sort((a, b) => a.order - b.order)
      saveCategories(next)
      return next
    })
  }, [])

  const resetCategories = useCallback(() => {
    saveCategories(MOCK_CATEGORIES)
    setCategories(MOCK_CATEGORIES)
  }, [])

  const getCategoryById = useCallback((id: string) => {
    return categories.find(c => c.id === id)
  }, [categories])

  return {
    categories,
    loaded,
    addCategory,
    updateCategory,
    deleteCategory,
    moveCategory,
    resetCategories,
    getCategoryById,
  }
}
