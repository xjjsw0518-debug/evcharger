import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_CONFIG } from '@/data/site';
import { useLang } from '@/context/LanguageContext';

interface SeoProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

// 语言代码 → og:locale / hreflang 映射
const LANG_LOCALE: Record<string, string> = {
  zh: 'zh_CN',
  en: 'en_US',
  id: 'id_ID',
  ms: 'ms_MY',
  th: 'th_TH',
  vi: 'vi_VN',
  ja: 'ja_JP',
  ko: 'ko_KR',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
  ru: 'ru_RU',
  ar: 'ar_SA',
  pt: 'pt_PT',
  it: 'it_IT',
  nl: 'nl_NL',
};

// 所有支持的语言代码（用于 hreflang 和 og:locale:alternate）
const ALL_LANGS = ['en', 'zh', 'id', 'ms', 'th', 'vi', 'ja', 'ko', 'es', 'fr', 'de', 'ru', 'ar', 'pt', 'it', 'nl'];

/**
 * 页面级 SEO 组件
 * - 设置 <title>
 * - 更新 meta description / keywords
 * - 更新 Open Graph / Twitter Card
 * - 注入 JSON-LD 结构化数据
 * - 设置 canonical
 * - 设置 hreflang 多语言标签
 */
export default function Seo({
  title,
  description,
  keywords,
  image = '/og-image.jpg',
  type = 'website',
  jsonLd,
}: SeoProps) {
  const location = useLocation();
  const { lang } = useLang();
  const fullTitle = `${title} | ${SITE_CONFIG.name}`;
  const fullUrl = `${SITE_CONFIG.url}${location.pathname}${location.search}`;
  const fullImage = image.startsWith('http') ? image : `${SITE_CONFIG.url}${image}`;
  const currentLocale = LANG_LOCALE[lang] || 'en_US';

  useEffect(() => {
    // title
    document.title = fullTitle;

    // meta 工具函数
    const setMeta = (selector: string, attr: 'content' | 'href', value: string) => {
      const isName = selector.startsWith('name:');
      const isProperty = selector.startsWith('property:');
      const isRel = selector.startsWith('rel:');
      let el: HTMLElement | null = null;

      if (isRel) {
        const relVal = selector.replace('rel:', '');
        el = document.querySelector(`link[rel="${relVal}"]`);
        if (!el) {
          el = document.createElement('link');
          el.setAttribute('rel', relVal);
          document.head.appendChild(el);
        }
      } else {
        const attrName = isName ? 'name' : 'property';
        const attrVal = selector.replace(/^(name|property):/, '');
        el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute(attrName, attrVal);
          document.head.appendChild(el);
        }
      }
      el.setAttribute(attr, value);
    };

    setMeta('name:description', 'content', description);
    if (keywords) setMeta('name:keywords', 'content', keywords);

    // OG
    setMeta('property:og:title', 'content', fullTitle);
    setMeta('property:og:description', 'content', description);
    setMeta('property:og:type', 'content', type);
    setMeta('property:og:url', 'content', fullUrl);
    setMeta('property:og:image', 'content', fullImage);
    setMeta('property:og:site_name', 'content', SITE_CONFIG.name);
    setMeta('property:og:locale', 'content', currentLocale);

    // og:locale:alternate - 移除旧的再重新生成所有
    const oldAlternates = document.querySelectorAll('meta[property="og:locale:alternate"]');
    oldAlternates.forEach(el => el.remove());
    ALL_LANGS.forEach(l => {
      const locale = LANG_LOCALE[l] || `${l}_${l.toUpperCase()}`;
      if (locale !== currentLocale) {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:locale:alternate');
        meta.setAttribute('content', locale);
        document.head.appendChild(meta);
      }
    });

    // Twitter
    setMeta('property:twitter:card', 'content', 'summary_large_image');
    setMeta('property:twitter:url', 'content', fullUrl);
    setMeta('property:twitter:title', 'content', fullTitle);
    setMeta('property:twitter:description', 'content', description);
    setMeta('property:twitter:image', 'content', fullImage);
    setMeta('property:twitter:site', 'content', '@youpeiauto');

    // canonical
    const link = document.querySelector('link[rel="canonical"]');
    if (link) {
      link.setAttribute('href', fullUrl);
    } else {
      const newLink = document.createElement('link');
      newLink.setAttribute('rel', 'canonical');
      newLink.setAttribute('href', fullUrl);
      document.head.appendChild(newLink);
    }

    // hreflang 标签
    // 先清除旧的 hreflang link 标签
    const oldHreflangs = document.querySelectorAll('link[rel="alternate"][hreflang]');
    oldHreflangs.forEach(el => el.remove());

    // 为每种语言添加 hreflang（当前架构是单 URL + JS 切换语言，href 指向当前 URL）
    ALL_LANGS.forEach(l => {
      const hreflangLink = document.createElement('link');
      hreflangLink.setAttribute('rel', 'alternate');
      hreflangLink.setAttribute('hreflang', l);
      hreflangLink.setAttribute('href', fullUrl);
      document.head.appendChild(hreflangLink);
    });

    // 添加 x-default
    const xDefaultLink = document.createElement('link');
    xDefaultLink.setAttribute('rel', 'alternate');
    xDefaultLink.setAttribute('hreflang', 'x-default');
    xDefaultLink.setAttribute('href', fullUrl);
    document.head.appendChild(xDefaultLink);

    // JSON-LD
    // 先清理旧的（只清理由 Seo 组件生成的，不动 index.html 中的全局 JSON-LD）
    const oldScripts = document.querySelectorAll('script[id^="seo-jsonld-"]');
    oldScripts.forEach(el => el.remove());

    if (jsonLd) {
      const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      items.forEach((data, idx) => {
        const id = `seo-jsonld-${idx}`;
        const script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
      });
    }
  }, [fullTitle, description, keywords, fullUrl, fullImage, type, jsonLd, currentLocale]);

  return null;
}
