import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = '__youpei_analytics'

export interface DailyVisit {
  date: string // YYYY-MM-DD
  pv: number
  uv: number
}

export interface ProductView {
  productId: string
  productName: string
  views: number
  lastViewed: number
}

export interface CountryVisit {
  country: string
  count: number
}

export interface AnalyticsData {
  dailyVisits: DailyVisit[]
  productViews: ProductView[]
  countryVisits: CountryVisit[]
  visitorSessions: string[] // 存储sessionId，用于UV去重
}

const DEFAULT_DATA: AnalyticsData = {
  dailyVisits: [],
  productViews: [],
  countryVisits: [],
  visitorSessions: [],
}

function loadData(): AnalyticsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...DEFAULT_DATA, ...parsed }
    }
  } catch {
    // 忽略
  }
  return { ...DEFAULT_DATA }
}

function saveData(data: AnalyticsData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0]
}

function getSessionId(): string {
  const key = '__youpei_session_id'
  let sid = localStorage.getItem(key)
  if (!sid) {
    sid = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    localStorage.setItem(key, sid)
  }
  return sid
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData>(DEFAULT_DATA)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setData(loadData())
    setLoaded(true)
  }, [])

  // 记录页面访问（PV/UV）
  const trackPageView = useCallback((page?: string) => {
    const today = getTodayStr()
    const sessionId = getSessionId()
    // 不使用page参数以避免lint告警
    void page

    setData(prev => {
      const dailyVisits = [...prev.dailyVisits]
      const dayIdx = dailyVisits.findIndex(d => d.date === today)
      let isNewVisitor = !prev.visitorSessions.includes(sessionId)

      if (dayIdx === -1) {
        dailyVisits.push({ date: today, pv: 1, uv: isNewVisitor ? 1 : 0 })
      } else {
        dailyVisits[dayIdx] = {
          ...dailyVisits[dayIdx],
          pv: dailyVisits[dayIdx].pv + 1,
          uv: isNewVisitor ? dailyVisits[dayIdx].uv + 1 : dailyVisits[dayIdx].uv,
        }
      }

      const visitorSessions = isNewVisitor
        ? [...prev.visitorSessions, sessionId]
        : prev.visitorSessions

      // 只保留最近60天数据
      const sorted = dailyVisits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      const trimmed = sorted.slice(0, 60)

      const next = { ...prev, dailyVisits: trimmed, visitorSessions }
      saveData(next)
      return next
    })
  }, [])

  // 记录产品浏览
  const trackProductView = useCallback((productId: string, productName: string) => {
    setData(prev => {
      const productViews = [...prev.productViews]
      const idx = productViews.findIndex(p => p.productId === productId)
      if (idx === -1) {
        productViews.push({ productId, productName, views: 1, lastViewed: Date.now() })
      } else {
        productViews[idx] = {
          ...productViews[idx],
          views: productViews[idx].views + 1,
          lastViewed: Date.now(),
        }
      }
      const next = { ...prev, productViews }
      saveData(next)
      return next
    })
  }, [])

  // 记录国家（从ipapi.co获取）
  const trackCountry = useCallback(async () => {
    const countryKey = '__youpei_visitor_country'
    const cached = localStorage.getItem(countryKey)
    if (cached) {
      _addCountry(cached)
      return
    }
    try {
      const res = await fetch('https://ipapi.co/json/')
      const json = await res.json()
      const country = json.country_name || json.country || 'Unknown'
      localStorage.setItem(countryKey, country)
      _addCountry(country)
    } catch {
      _addCountry('Unknown')
    }
  }, [])

  const _addCountry = (country: string) => {
    setData(prev => {
      const countryVisits = [...prev.countryVisits]
      const idx = countryVisits.findIndex(c => c.country === country)
      if (idx === -1) {
        countryVisits.push({ country, count: 1 })
      } else {
        countryVisits[idx] = { ...countryVisits[idx], count: countryVisits[idx].count + 1 }
      }
      const next = { ...prev, countryVisits: countryVisits.sort((a, b) => b.count - a.count) }
      saveData(next)
      return next
    })
  }

  // 导出CSV
  const exportCSV = useCallback(() => {
    const lines: string[] = []
    lines.push('=== Daily Visits (Last 30 days) ===')
    lines.push('Date,PV,UV')
    const last30 = [...data.dailyVisits].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-30)
    last30.forEach(d => lines.push(`${d.date},${d.pv},${d.uv}`))

    lines.push('')
    lines.push('=== Top Product Views ===')
    lines.push('Product ID,Product Name,Views')
    const topProducts = [...data.productViews].sort((a, b) => b.views - a.views).slice(0, 20)
    topProducts.forEach(p => lines.push(`"${p.productId}","${p.productName.replace(/"/g, '""')}",${p.views}`))

    lines.push('')
    lines.push('=== Country Visits ===')
    lines.push('Country,Visits')
    data.countryVisits.forEach(c => lines.push(`"${c.country}",${c.count}`))

    const csv = lines.join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `youpei-analytics-${getTodayStr()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }, [data])

  // 清空数据
  const clearData = useCallback(() => {
    saveData(DEFAULT_DATA)
    setData(DEFAULT_DATA)
  }, [])

  // 获取最近30天
  const getLast30Days = useCallback(() => {
    const result: DailyVisit[] = []
    const today = new Date()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const found = data.dailyVisits.find(v => v.date === dateStr)
      result.push({ date: dateStr, pv: found?.pv || 0, uv: found?.uv || 0 })
    }
    return result
  }, [data.dailyVisits])

  // 获取Top 10产品
  const getTopProducts = useCallback((limit = 10) => {
    return [...data.productViews].sort((a, b) => b.views - a.views).slice(0, limit)
  }, [data.productViews])

  return {
    data,
    loaded,
    trackPageView,
    trackProductView,
    trackCountry,
    exportCSV,
    clearData,
    getLast30Days,
    getTopProducts,
  }
}
