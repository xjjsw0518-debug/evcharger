import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { scopedStorage, logger } from '@lark-apaas/client-toolkit-lite';
import { toast } from 'sonner';
import {
  translations,
  LANG_META,
  detectLangFromCountry,
  detectLangFromBrowser,
  type Lang,
  type Translations,
  formatMessage,
} from '@/i18n/translations';

interface LanguageContextValue {
  lang: Lang;
  /** 用户手动设置的语言（存储在 localStorage），null 表示未手动设置（自动检测） */
  userSelectedLang: Lang | null;
  /** 是否为自动检测到的语言（用户尚未手动切换） */
  isAutoDetected: boolean;
  /** IP 检测到的国家代码（大写，可能为空） */
  detectedCountry: string | null;
  setLang: (lang: Lang) => void;
  /** 重置为自动检测模式（清除用户选择，重新走 IP + 浏览器检测） */
  resetToAuto: () => void;
  t: Translations;
  format: (msg: string, params: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const LANG_KEY = '__auto_parts_lang';
const AUTO_KEY = '__auto_parts_lang_auto'; // '1' 表示用户选择了自动模式
const COUNTRY_KEY = '__auto_parts_country';
const IP_API_TIMEOUT = 3000; // 3 秒超时

function isValidLang(v: unknown): v is Lang {
  return typeof v === 'string' && v in LANG_META;
}

function detectInitialLang(): { lang: Lang; userSelected: Lang | null; country: string | null } {
  try {
    // 1. 用户手动选择的语言（优先级最高）
    const userLang = scopedStorage.getItem(LANG_KEY);
    const isAuto = scopedStorage.getItem(AUTO_KEY) === '1' || !userLang;
    const savedCountry = scopedStorage.getItem(COUNTRY_KEY);

    if (userLang && isValidLang(userLang) && !isAuto) {
      return { lang: userLang, userSelected: userLang, country: savedCountry || null };
    }

    // 2. 上次 IP 检测到的国家（仅提示用，不作为权威来源）
    // 3. 浏览器语言（兜底初始值，等待 IP 检测异步覆盖）
    const browserLang = detectLangFromBrowser();
    return { lang: browserLang, userSelected: null, country: savedCountry || null };
  } catch (e) {
    logger.warn('Language init error:', String(e));
    return { lang: 'en', userSelected: null, country: null };
  }
}

// IP 地理定位：ip-api.com 免费接口（JSONP 走 img/script 会被 CORS 限制，这里用原生 fetch + no-cors 拿不到数据）
// 改用 freeipapi.com 或 ipapi.co/json，两者都支持 CORS
async function fetchCountry(timeoutMs: number): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // 先用 ipapi.co（免费，支持 CORS，返回 JSON，字段 country_code）
    const resp = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
      method: 'GET',
    });
    const data = (await resp.json()) as { country_code?: string; error?: boolean };
    if (data?.country_code && !data.error) {
      return data.country_code.toUpperCase();
    }
    return null;
  } catch (e) {
    logger.info('IP geo lookup failed, falling back to browser language:', String(e));
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const initial = detectInitialLang();
  const [lang, setLangState] = useState<Lang>(initial.lang);
  const [userSelectedLang, setUserSelected] = useState<Lang | null>(initial.userSelected);
  const [detectedCountry, setDetectedCountry] = useState<string | null>(initial.country);

  // 设置文档 lang 属性 + 方向
  useEffect(() => {
    document.documentElement.lang = lang;
    const meta = LANG_META[lang];
    if (meta?.rtl) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [lang]);

  // IP 检测（仅首次进入且用户未手动选择时执行）
  useEffect(() => {
    if (userSelectedLang !== null) return; // 用户已手动选择，不自动切换

    let cancelled = false;

    async function detect() {
      const country = await fetchCountry(IP_API_TIMEOUT);
      if (cancelled) return;

      if (country) {
        setDetectedCountry(country);
        try {
          scopedStorage.setItem(COUNTRY_KEY, country);
        } catch {
          // ignore
        }
        const detected = detectLangFromCountry(country);
        if (detected !== lang) {
          setLangState(detected);
          // 轻量 Toast 提示
          const langName = LANG_META[detected]?.name || detected;
          const msg = formatMessage(translations[detected].langSwitcher.autoDetected, { lang: langName });
          toast.info(msg, {
            duration: 4000,
            action: {
              label: translations[detected].langSwitcher.manualHint,
              onClick: () => {
                // 用户点击后不做任何跳转，只关闭 toast（切换器在导航栏）
              },
            },
          });
        }
      }
      // 没拿到国家 → 保持浏览器语言，不提示
    }

    detect();
    return () => {
      cancelled = true;
    };
    // 只在初始化时执行一次
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    if (!isValidLang(newLang)) return;
    setLangState(newLang);
    setUserSelected(newLang);
    try {
      scopedStorage.setItem(LANG_KEY, newLang);
      scopedStorage.removeItem(AUTO_KEY);
    } catch {
      // ignore
    }
  }, []);

  const resetToAuto = useCallback(() => {
    setUserSelected(null);
    try {
      scopedStorage.setItem(AUTO_KEY, '1');
      scopedStorage.removeItem(LANG_KEY);
    } catch {
      // ignore
    }
    // 立刻按浏览器语言兜底
    const browserLang = detectLangFromBrowser();
    setLangState(browserLang);
    // 然后重新走 IP 检测（刷新页面或下一次加载时生效；这里不重新发请求避免闪跳）
    toast.success('已恢复自动检测模式，下次访问时生效');
  }, []);

  const value: LanguageContextValue = {
    lang,
    userSelectedLang,
    isAutoDetected: userSelectedLang === null,
    detectedCountry,
    setLang,
    resetToAuto,
    t: translations[lang],
    format: formatMessage,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}

// 从 { zh, en, ... } 多语言对象中取当前语言文本（hook 版本）
export function useText<T extends Record<string, string>>(obj: T): string {
  const { lang } = useLang();
  return obj[lang] ?? obj.en ?? obj.zh ?? '';
}

// 普通函数版本：在非组件顶层（map 回调 / 条件分支）中使用，规避 React hooks 规则
export function getText<T extends Record<string, string>>(lang: Lang, obj: T): string {
  return obj[lang] ?? obj.en ?? obj.zh ?? '';
}
