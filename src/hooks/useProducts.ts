import { useState, useEffect, useCallback } from 'react'
import { scopedStorage } from '@lark-apaas/client-toolkit-lite'
import { MOCK_PRODUCTS, type IProduct } from '@/data/products'

const STORAGE_KEY = '__auto_parts_products'

// 从 localStorage 加载产品，首次访问用 mock 初始化
function loadProducts(): IProduct[] {
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
  scopedStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PRODUCTS))
  return MOCK_PRODUCTS
}

function saveProducts(products: IProduct[]) {
  scopedStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

export function useProducts() {
  const [products, setProducts] = useState<IProduct[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setProducts(loadProducts())
    setLoaded(true)
  }, [])

  const addProduct = useCallback((product: Omit<IProduct, 'id' | 'source' | 'createdAt'>) => {
    const newProduct: IProduct = {
      ...product,
      id: `p_${Date.now()}`,
      source: 'user',
      createdAt: Date.now(),
    }
    setProducts(prev => {
      const next = [newProduct, ...prev]
      saveProducts(next)
      return next
    })
    return newProduct
  }, [])

  const updateProduct = useCallback((id: string, updates: Partial<IProduct>) => {
    setProducts(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...updates } : p)
      saveProducts(next)
      return next
    })
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => {
      const next = prev.filter(p => p.id !== id)
      saveProducts(next)
      return next
    })
  }, [])

  const resetToMock = useCallback(() => {
    saveProducts(MOCK_PRODUCTS)
    setProducts(MOCK_PRODUCTS)
  }, [])

  const replaceAllProducts = useCallback((newProducts: IProduct[]) => {
    saveProducts(newProducts)
    setProducts(newProducts)
  }, [])

  const getProductById = useCallback((id: string) => {
    return products.find(p => p.id === id)
  }, [products])

  return {
    products,
    loaded,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToMock,
    replaceAllProducts,
    getProductById,
  }
}
