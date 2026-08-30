import { useState, useEffect, useCallback } from 'react';
import { scopedStorage } from '@lark-apaas/client-toolkit-lite';
import { SITE_CONFIG } from '@/data/site';
import { MOCK_COMPANY } from '@/data/company';

const STORAGE_KEY = '__youpei_contact_settings';

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

function loadSettings(): ContactSettings {
  try {
    const raw = scopedStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {
    // 忽略解析错误
  }
  return { ...DEFAULT_SETTINGS };
}

function saveSettings(settings: ContactSettings) {
  scopedStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
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

  useEffect(() => {
    setSettings(loadSettings());
    setLoaded(true);
  }, []);

  const updateSettings = useCallback((updates: Partial<ContactSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...updates };
      saveSettings(next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    saveSettings(DEFAULT_SETTINGS);
    setSettings(DEFAULT_SETTINGS);
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
    updateSettings,
    resetSettings,
    getWaNumber,
    getWaUrl,
    getAddress,
  };
}
