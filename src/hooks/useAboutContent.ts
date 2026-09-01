import { useState, useEffect, useCallback } from 'react'
import { MOCK_COMPANY, type ICompany } from '@/data/company'
import { useContent } from './useContent'

const STORAGE_KEY = '__youpei_about_content'

interface AboutData {
  content: ICompany;
  enabled: boolean;
}

const DEFAULT_ABOUT_DATA: AboutData = {
  content: MOCK_COMPANY,
  enabled: true,
};

function loadLocalAbout(): AboutData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        content: { ...MOCK_COMPANY, ...parsed.content },
        enabled: parsed.enabled !== false,
      }
    }
  } catch {
    // 忽略
  }
  return DEFAULT_ABOUT_DATA
}

function saveLocalAbout(data: AboutData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // 忽略存储错误
  }
}

export function useAboutContent() {
  // 使用 useContent 从服务器读取和保存关于页面数据
  const { data: serverData, loaded: serverLoaded, replaceData, syncing, syncError } = useContent<AboutData>('about', DEFAULT_ABOUT_DATA)
  
  const [content, setContent] = useState<ICompany>(MOCK_COMPANY)
  const [isAboutEnabled, setIsAboutEnabled] = useState(true)
  const [loaded, setLoaded] = useState(false)

  // 当服务器数据加载完成后，使用服务器数据
  useEffect(() => {
    if (serverLoaded) {
      let aboutData: AboutData
      if (serverData && serverData.content) {
        aboutData = {
          content: { ...MOCK_COMPANY, ...serverData.content },
          enabled: serverData.enabled !== false,
        }
      } else {
        // 服务器没有数据，使用本地数据并保存到服务器
        aboutData = loadLocalAbout()
        replaceData(aboutData).catch(() => {})
      }
      
      setContent(aboutData.content)
      setIsAboutEnabled(aboutData.enabled)
      saveLocalAbout(aboutData)
      setLoaded(true)
    }
  }, [serverLoaded, serverData, replaceData])

  const updateContent = useCallback((updates: Partial<ICompany>) => {
    setContent(prev => {
      const nextContent = { ...prev, ...updates }
      const nextData: AboutData = { content: nextContent, enabled: isAboutEnabled }
      saveLocalAbout(nextData)
      // 异步保存到服务器（fire-and-forget）
      replaceData(nextData).catch(() => {})
      return nextContent
    })
  }, [isAboutEnabled, replaceData])

  const updateAboutEnabled = useCallback((enabled: boolean) => {
    setIsAboutEnabled(enabled)
    const nextData: AboutData = { content, enabled }
    saveLocalAbout(nextData)
    // 异步保存到服务器（fire-and-forget）
    replaceData(nextData).catch(() => {})
  }, [content, replaceData])

  const resetContent = useCallback(() => {
    setContent(MOCK_COMPANY)
    setIsAboutEnabled(true)
    saveLocalAbout(DEFAULT_ABOUT_DATA)
    // 异步保存到服务器（fire-and-forget）
    replaceData(DEFAULT_ABOUT_DATA).catch(() => {})
  }, [replaceData])

  return { 
    content, 
    loaded, 
    updateContent, 
    resetContent, 
    isAboutEnabled, 
    updateAboutEnabled,
    syncing,
    syncError,
  }
}
