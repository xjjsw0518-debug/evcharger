import { useState, useEffect, useCallback, useRef } from 'react'
import { SITE_CONFIG } from '@/data/site'

const STORAGE_KEY = '__youpei_site_settings'
const API_ENDPOINT = '/api/settings'

export interface FooterQuickLink {
  id: string
  labelZh: string
  labelEn: string
  url: string
}

export interface FooterSocialItem {
  id: string
  platform: string  // facebook/instagram/linkedin/youtube/whatsapp/wechat/twitter
  url: string
}

export interface SiteSettings {
  logoUrl: string
  brandName: string
  brandSubtitle: string
  heroBgUrl: string
  heroTitleZh: string
  heroTitleEn: string
  heroSubtitleZh: string
  heroSubtitleEn: string
  heroAlign: 'left' | 'center' | 'right'
  heroVerticalOffset: number  // 0-100, 百分比
  heroButtonGap: number       // px
  videoUrl: string
  videoCoverUrl: string
  videoEnabled: boolean
  aboutPageEnabled: boolean
  // Footer
  footerCompanyName: string
  footerCompanyDescZh: string
  footerCompanyDescEn: string
  footerEmail: string
  footerPhone: string
  footerWhatsapp: string
  footerAddressZh: string
  footerAddressEn: string
  footerQuickLinks: FooterQuickLink[]
  footerSocials: FooterSocialItem[]
  footerCopyrightZh: string
  footerCopyrightEn: string
  footerCtaTitleZh: string
  footerCtaTitleEn: string
  footerCtaDescZh: string
  footerCtaDescEn: string
  // Security
  adminPath: string
  adminUsername: string
  adminPassword: string
}

const DEFAULT_QUICK_LINKS: FooterQuickLink[] = [
  { id: 'q1', labelZh: '首页', labelEn: 'Home', url: '/' },
  { id: 'q2', labelZh: '全部产品', labelEn: 'All Products', url: '/products' },
  { id: 'q3', labelZh: '关于我们', labelEn: 'About Us', url: '/about' },
  { id: 'q4', labelZh: '博客', labelEn: 'Blog', url: '/blog' },
  { id: 'q5', labelZh: '常见问题', labelEn: 'FAQ', url: '/faq' },
  { id: 'q6', labelZh: '联系我们', labelEn: 'Contact Us', url: '/contact' },
]

const DEFAULT_SOCIALS: FooterSocialItem[] = [
  { id: 's1', platform: 'facebook', url: 'https://facebook.com/youpeiauto' },
  { id: 's2', platform: 'instagram', url: 'https://instagram.com/youpei_auto' },
  { id: 's3', platform: 'tiktok', url: 'https://tiktok.com/@youpeiauto' },
  { id: 's4', platform: 'linkedin', url: 'https://linkedin.com/company/youpei-auto' },
  { id: 's5', platform: 'youtube', url: 'https://youtube.com/@youpeiauto' },
]

const DEFAULT_SETTINGS: SiteSettings = {
  logoUrl: '',
  brandName: 'YiLianPu auto',
  brandSubtitle: 'EV Charging Specialist',
  heroBgUrl: 'https://aka.doubaocdn.com/s/1miAfPPz6y',
  heroTitleZh: 'EV 充电配件批发\n中国工厂直供',
  heroTitleEn: 'Wholesale EV Charging Accessories\nDirect from China Factory',
  heroSubtitleZh: 'GBT / Type 2 充电枪、转接器、便携式充电桩、V2L 放电器全品类覆盖。MOQ 2-5 件起批，CE 认证，全球发货。',
  heroSubtitleEn: 'GBT / Type 2 charging guns, adapters, portable chargers, V2L adapters - all in one place. MOQ 2-5 pcs, CE certified, global shipping.',
  heroAlign: 'left',
  heroVerticalOffset: 0,
  heroButtonGap: 12,
  videoUrl: '',
  videoCoverUrl: '',
  videoEnabled: true,
  aboutPageEnabled: true,
  footerCompanyName: 'YiLianPu auto',
  footerCompanyDescZh: '电动汽车充电配件批发供应商 - 工厂直供，全球发货',
  footerCompanyDescEn: 'Wholesale EV Charging Accessories Supplier - Factory Direct, Global Shipping',
  footerEmail: 'sales@evlinkpro.com',
  footerPhone: '+86-138-0000-0000',
  footerWhatsapp: '+8613371170795',
  footerAddressZh: '中国广东省广州市白云区汽配城',
  footerAddressEn: 'Auto Parts City, Baiyun District, Guangzhou, Guangdong, China',
  footerQuickLinks: DEFAULT_QUICK_LINKS,
  footerSocials: DEFAULT_SOCIALS,
  footerCopyrightZh: '© {year} YiLianPu auto. 保留所有权利。',
  footerCopyrightEn: '© {year} YiLianPu auto. All rights reserved.',
  footerCtaTitleZh: '获取最新报价',
  footerCtaTitleEn: 'Get Latest Quotes',
  footerCtaDescZh: '发送您的需求，我们将在24小时内为您提供详细报价。',
  footerCtaDescEn: 'Send us your requirements and get a detailed quote within 24 hours.',
  adminPath: 'XUEJIAN-manage',
  adminUsername: 'XUEJIAN',
  adminPassword: 'XueJian0812511',
}

/**
 * 从 localStorage 读取缓存设置
 */
function loadLocalSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...DEFAULT_SETTINGS, ...parsed }
    }
  } catch {
    // 忽略解析错误
  }
  return { ...DEFAULT_SETTINGS }
}

/**
 * 保存设置到 localStorage 缓存
 */
function saveLocalSettings(settings: SiteSettings): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    return true
  } catch (e) {
    console.error('Failed to save settings to localStorage:', e)
    return false
  }
}

/**
 * 从服务器 API 读取最新设置
 */
async function fetchSettingsFromServer(): Promise<SiteSettings | null> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) {
      console.error('Failed to fetch settings from server:', response.status)
      return null
    }
    const result = await response.json()
    if (result.success && result.data) {
      return { ...DEFAULT_SETTINGS, ...result.data }
    }
    return null
  } catch (e) {
    console.error('Error fetching settings from server:', e)
    return null
  }
}

/**
 * 保存设置到服务器 API
 */
async function saveSettingsToServer(settings: SiteSettings): Promise<boolean> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.adminPassword}`,
      },
      body: JSON.stringify(settings),
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      console.error('Failed to save settings to server:', response.status, error)
      return false
    }
    const result = await response.json()
    return result.success === true
  } catch (e) {
    console.error('Error saving settings to server:', e)
    return false
  }
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [loaded, setLoaded] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const isFirstLoad = useRef(true)

  // 组件挂载时：先从 localStorage 读取缓存，然后从服务器拉取最新设置
  useEffect(() => {
    let cancelled = false

    const init = async () => {
      // 1. 先从 localStorage 读取缓存，立即显示
      const localSettings = loadLocalSettings()
      if (!cancelled) {
        setSettings(localSettings)
        setLoaded(true)
      }

      // 2. 从服务器拉取最新设置
      const serverSettings = await fetchSettingsFromServer()
      if (!cancelled && serverSettings) {
        setSettings(serverSettings)
        // 更新本地缓存
        saveLocalSettings(serverSettings)
      }
    }

    init()
    return () => { cancelled = true }
  }, [])

  /**
   * 更新设置：同时保存到服务器和本地缓存
   * 返回 Promise<boolean>，表示是否保存成功
   */
  const updateSettings = useCallback(async (updates: Partial<SiteSettings>): Promise<boolean> => {
    setSyncing(true)
    setSyncError(null)

    try {
      // 先更新本地状态（乐观更新）
      let newSettings: SiteSettings = DEFAULT_SETTINGS
      setSettings(prev => {
        newSettings = { ...prev, ...updates }
        return newSettings
      })

      // 保存到本地缓存
      saveLocalSettings(newSettings)

      // 保存到服务器
      const serverSuccess = await saveSettingsToServer(newSettings)
      if (!serverSuccess) {
        setSyncError('保存到服务器失败，修改仅在本地生效。请检查网络或管理员密码。')
        return false
      }

      return true
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e)
      setSyncError(errorMsg)
      return false
    } finally {
      setSyncing(false)
    }
  }, [])

  /**
   * 重置设置为默认值
   */
  const resetSettings = useCallback(async () => {
    setSyncing(true)
    try {
      setSettings(DEFAULT_SETTINGS)
      saveLocalSettings(DEFAULT_SETTINGS)
      await saveSettingsToServer(DEFAULT_SETTINGS)
    } finally {
      setSyncing(false)
    }
  }, [])

  /**
   * 手动从服务器刷新设置
   */
  const refreshFromServer = useCallback(async () => {
    setSyncing(true)
    try {
      const serverSettings = await fetchSettingsFromServer()
      if (serverSettings) {
        setSettings(serverSettings)
        saveLocalSettings(serverSettings)
        setSyncError(null)
        return true
      }
      return false
    } catch (e) {
      setSyncError(e instanceof Error ? e.message : String(e))
      return false
    } finally {
      setSyncing(false)
    }
  }, [])

  const getLogoUrl = useCallback(() => {
    return settings.logoUrl || 'https://aka.doubaocdn.com/s/OhaBaatK4F'
  }, [settings.logoUrl])

  const getHeroBgUrl = useCallback(() => {
    return settings.heroBgUrl || 'https://aka.doubaocdn.com/s/1miAfPPz6y'
  }, [settings.heroBgUrl])

  const getHeroTitle = useCallback((lang: 'zh' | 'en') => {
    const raw = lang === 'zh' ? settings.heroTitleZh : settings.heroTitleEn
    return raw || DEFAULT_SETTINGS[lang === 'zh' ? 'heroTitleZh' : 'heroTitleEn']
  }, [settings.heroTitleZh, settings.heroTitleEn])

  const getHeroSubtitle = useCallback((lang: 'zh' | 'en') => {
    const raw = lang === 'zh' ? settings.heroSubtitleZh : settings.heroSubtitleEn
    return raw || DEFAULT_SETTINGS[lang === 'zh' ? 'heroSubtitleZh' : 'heroSubtitleEn']
  }, [settings.heroSubtitleZh, settings.heroSubtitleEn])

  const getFooterQuickLinks = useCallback(() => {
    return settings.footerQuickLinks?.length ? settings.footerQuickLinks : DEFAULT_QUICK_LINKS
  }, [settings.footerQuickLinks])

  const getFooterSocials = useCallback(() => {
    return settings.footerSocials?.length ? settings.footerSocials : DEFAULT_SOCIALS
  }, [settings.footerSocials])

  return {
    settings,
    loaded,
    syncing,        // 是否正在与服务器同步
    syncError,      // 同步错误信息
    updateSettings, // 现在是异步函数，返回 Promise<boolean>
    resetSettings,  // 现在是异步函数
    refreshFromServer, // 手动从服务器刷新
    getLogoUrl,
    getHeroBgUrl,
    getHeroTitle,
    getHeroSubtitle,
    getFooterQuickLinks,
    getFooterSocials,
    siteName: SITE_CONFIG.name,
  }
}
