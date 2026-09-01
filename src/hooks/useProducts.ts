import { useState, useEffect, useCallback } from 'react'
import { MOCK_PRODUCTS, type IProduct } from '@/data/products'
import { useContent } from './useContent'

const STORAGE_KEY = '__auto_parts_products'

// 从 localStorage 加载产品
function loadLocalProducts(): IProduct[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // 解析失败回退到 mock
  }
  return MOCK_PRODUCTS
}

function saveLocalProducts(products: IProduct[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  } catch {
    // 忽略存储错误
  }
}

export function useProducts() {
  // 使用 useContent 从服务器读取和保存产品数据
  const { data: serverProducts, loaded: serverLoaded, replaceData, syncing, syncError } = useContent<IProduct[]>('products', MOCK_PRODUCTS)
  
  const [products, setProducts] = useState<IProduct[]>(loadLocalProducts())
  const [loaded, setLoaded] = useState(false)

  // 当服务器数据加载完成后，使用服务器数据
  useEffect(() => {
    if (serverLoaded) {
      if (serverProducts && Array.isArray(serverProducts) && serverProducts.length > 0) {
        setProducts(serverProducts)
        saveLocalProducts(serverProducts)
      } else {
        // 服务器没有数据，使用本地数据并保存到服务器
        const localProducts = loadLocalProducts()
        setProducts(localProducts)
        replaceData(localProducts).catch(() => {})
      }
      setLoaded(true)
    }
  }, [serverLoaded, serverProducts, replaceData])

  const addProduct = useCallback((product: Omit<IProduct, 'id' | 'source' | 'createdAt'>) => {
    const newProduct: IProduct = {
      ...product,
      id: `p_${Date.now()}`,
      source: 'user',
      createdAt: Date.now(),
    }
    setProducts(prev => {
      const next = [newProduct, ...prev]
      saveLocalProducts(next)
      // 异步保存到服务器（fire-and-forget）
      replaceData(next).catch(() => {})
      return next
    })
    return newProduct
  }, [replaceData])

  const updateProduct = useCallback((id: string, updates: Partial<IProduct>) => {
    setProducts(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...updates } : p)
      saveLocalProducts(next)
      // 异步保存到服务器（fire-and-forget）
      replaceData(next).catch(() => {})
      return next
    })
  }, [replaceData])

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => {
      const next = prev.filter(p => p.id !== id)
      saveLocalProducts(next)
      // 异步保存到服务器（fire-and-forget）
      replaceData(next).catch(() => {})
      return next
    })
  }, [replaceData])

  const resetToMock = useCallback(() => {
    saveLocalProducts(MOCK_PRODUCTS)
    setProducts(MOCK_PRODUCTS)
    // 异步保存到服务器（fire-and-forget）
    replaceData(MOCK_PRODUCTS).catch(() => {})
  }, [replaceData])

  const replaceAllProducts = useCallback((newProducts: IProduct[]) => {
    saveLocalProducts(newProducts)
    setProducts(newProducts)
    // 异步保存到服务器（fire-and-forget）
    replaceData(newProducts).catch(() => {})
  }, [replaceData])

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
    syncing,
    syncError,
  }
}
