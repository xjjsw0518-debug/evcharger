import { useState, useEffect, useCallback } from 'react'
import { MOCK_COMPANY, type ICompany } from '@/data/company'

const STORAGE_KEY = '__youpei_about_content'
const ENABLED_KEY = '__youpei_about_enabled'

function loadContent(): ICompany {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...MOCK_COMPANY, ...parsed }
    }
  } catch {
    // 忽略
  }
  return MOCK_COMPANY
}

function saveContent(content: ICompany) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
}

function loadEnabled(): boolean {
  const val = localStorage.getItem(ENABLED_KEY)
  return val === null ? true : val === 'true'
}

export function useAboutContent() {
  const [content, setContent] = useState<ICompany>(MOCK_COMPANY)
  const [isAboutEnabled, setIsAboutEnabled] = useState(true)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setContent(loadContent())
    setIsAboutEnabled(loadEnabled())
    setLoaded(true)
  }, [])

  const updateContent = useCallback((updates: Partial<ICompany>) => {
    setContent(prev => {
      const next = { ...prev, ...updates }
      saveContent(next)
      return next
    })
  }, [])

  const updateAboutEnabled = useCallback((enabled: boolean) => {
    setIsAboutEnabled(enabled)
    localStorage.setItem(ENABLED_KEY, String(enabled))
  }, [])

  const resetContent = useCallback(() => {
    saveContent(MOCK_COMPANY)
    setContent(MOCK_COMPANY)
    setIsAboutEnabled(true)
    localStorage.setItem(ENABLED_KEY, 'true')
  }, [])

  return { content, loaded, updateContent, resetContent, isAboutEnabled, updateAboutEnabled }
}
