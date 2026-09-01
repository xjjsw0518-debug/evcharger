import { useState, useEffect, useCallback } from 'react';
import { SITE_CONFIG } from '@/data/site';
import { MOCK_COMPANY } from '@/data/company';

const STORAGE_KEY = '__youpei_contact_settings';
const API_ENDPOINT = '/api/contact-settings';

export interface ContactSettings {
  /** WhatsApp 号码，支持带 + 和空格，如 +86 138 0000 0000 */
  whatsapp: string;
  /** 微信二维码图片 URL */
  wechatQrUrl: string;
  /** 微信号 */
  wechatId: string;
  /** 邮箱 */
  email: string;
  /** 公司地址（中文） */
  addressZh: string;
  /** 公司地址（英文） */
  addressEn: string;
}

const DEFAULT_SETTINGS: ContactSettings = {
  whatsapp: SITE_CONFIG.whatsapp,
  wechatQrUrl: SITE_CONFIG.wechatQrUrl,
  wechatId: MOCK_COMPANY.contact.wechat,
  email: SITE_CONFIG.email,
  addressZh: MOCK_COMPANY.contact.address.zh,
  addressEn: MOCK_COMPANY.contact.address.en,
};

/**
 * 从 localStorage 读取缓存设置
 */
function loadLocalSettings(): ContactSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {
    // 忽略解析错误
  }
  return { ...DEFAULT_SETTINGS };
}

/**
 * 保存设置到 localStorage 缓存
 */
function saveLocalSettings(settings: ContactSettings): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error('Failed to save contact settings to localStorage:', e);
    return false;
  }
}

/**
 * 从服务器 API 读取最新设置
 */
async function fetchSettingsFromServer(): Promise<ContactSettings | null> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      console.error('Failed to fetch contact settings from server:', response.status);
      return null;
    }
    const result = await response.json();
    if (result.success && result.data) {
      return { ...DEFAULT_SETTINGS, ...result.data };
    }
    return null;
  } catch (e) {
    console.error('Error fetching contact settings from server:', e);
    return null;
  }
}

/**
 * 保存设置到服务器 API
 * 需要管理员密码（从 site settings 中读取）
 */
async function saveSettingsToServer(settings: ContactSettings): Promise<boolean> {
  try {
    // 从 localStorage 读取管理员密码
    let adminPassword = 'XueJian0812511';
    try {
      const siteSettingsRaw = localStorage.getItem('__youpei_site_settings');
      if (siteSettingsRaw) {
        const siteSettings = JSON.parse(siteSettingsRaw);
        if (siteSettings.adminPassword) {
          adminPassword = siteSettings.adminPassword;
        }
      }
    } catch {
      // 忽略读取错误，使用默认密码
    }

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminPassword}`,
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('Failed to save contact settings to server:', response.status, error);
      return false;
    }
    const result = await response.json();
    return result.success === true;
  } catch (e) {
    console.error('Error saving contact settings to server:', e);
    return false;
  }
}

/**
 * 清洗 WhatsApp 号码：去掉 + 号、空格、横杠
 * 用于构造 wa.me 链接
 */
function cleanWhatsapp(num: string): string {
  return num.replace(/[+\s\-]/g, '');
}

export function useContactSettings() {
  const [settings, setSettings] = useState<ContactSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // 组件挂载时：先从 localStorage 读取缓存，然后从服务器拉取最新设置
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      // 1. 先从 localStorage 读取缓存，立即显示
      const localSettings = loadLocalSettings();
      if (!cancelled) {
        setSettings(localSettings);
        setLoaded(true);
      }

      // 2. 从服务器拉取最新设置
      const serverSettings = await fetchSettingsFromServer();
      if (!cancelled && serverSettings) {
        setSettings(serverSettings);
        saveLocalSettings(serverSettings);
      }
    };

    init();
    return () => { cancelled = true; };
  }, []);

  /**
   * 更新设置：同时保存到服务器和本地缓存
   */
  const updateSettings = useCallback(async (updates: Partial<ContactSettings>): Promise<boolean> => {
    setSyncing(true);
    setSyncError(null);

    try {
      let newSettings: ContactSettings = DEFAULT_SETTINGS;
      setSettings(prev => {
        newSettings = { ...prev, ...updates };
        return newSettings;
      });

      // 保存到本地缓存
      saveLocalSettings(newSettings);

      // 保存到服务器
      const serverSuccess = await saveSettingsToServer(newSettings);
      if (!serverSuccess) {
        setSyncError('保存到服务器失败，修改仅在本地生效。请检查网络或管理员密码。');
        return false;
      }

      return true;
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setSyncError(errorMsg);
      return false;
    } finally {
      setSyncing(false);
    }
  }, []);

  /**
   * 重置设置为默认值
   */
  const resetSettings = useCallback(async () => {
    setSyncing(true);
    try {
      setSettings(DEFAULT_SETTINGS);
      saveLocalSettings(DEFAULT_SETTINGS);
      await saveSettingsToServer(DEFAULT_SETTINGS);
    } finally {
      setSyncing(false);
    }
  }, []);

  /**
   * 手动从服务器刷新设置
   */
  const refreshFromServer = useCallback(async () => {
    setSyncing(true);
    try {
      const serverSettings = await fetchSettingsFromServer();
      if (serverSettings) {
        setSettings(serverSettings);
        saveLocalSettings(serverSettings);
        setSyncError(null);
        return true;
      }
      return false;
    } catch (e) {
      setSyncError(e instanceof Error ? e.message : String(e));
      return false;
    } finally {
      setSyncing(false);
    }
  }, []);

  /** 获取清洗后的 WhatsApp 号码（用于 wa.me 链接） */
  const getWaNumber = useCallback(() => cleanWhatsapp(settings.whatsapp), [settings.whatsapp]);

  /**
   * 构造 WhatsApp 聊天链接
   * @param text 预设消息，默认为批发询盘消息
   */
  const getWaUrl = useCallback((text?: string) => {
    const defaultText = "Hi, I'm interested in wholesale EV charging accessories. Please send me the catalog and price list.";
    const msg = text ?? defaultText;
    return `https://wa.me/${cleanWhatsapp(settings.whatsapp)}?text=${encodeURIComponent(msg)}`;
  }, [settings.whatsapp]);

  /** 获取对应语言的地址 */
  const getAddress = useCallback((lang: 'zh' | 'en') => {
    return lang === 'zh' ? settings.addressZh : settings.addressEn;
  }, [settings.addressZh, settings.addressEn]);

  return {
    settings,
    loaded,
    syncing,
    syncError,
    updateSettings,
    resetSettings,
    refreshFromServer,
    getWaNumber,
    getWaUrl,
    getAddress,
  };
}
