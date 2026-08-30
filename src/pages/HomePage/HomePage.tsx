import { useLang } from '@/context/LanguageContext';
import Seo from '@/components/Seo';
import { SITE_CONFIG } from '@/data/site';
import HeroSection from './sections/HeroSection';
import WholesaleBannerSection from './sections/WholesaleBannerSection';
import CategoriesSection from './sections/CategoriesSection';
import VideoSection from './sections/VideoSection';
import FeaturedSection from './sections/FeaturedSection';
import AdvantagesSection from './sections/AdvantagesSection';
import WhyWholesaleSection from './sections/WhyWholesaleSection';
import CTASection from './sections/CTASection';

export default function HomePage() {
  const { lang } = useLang();

  const title = lang === 'zh'
    ? 'EV充电配件批发 | GBT充电枪 | 中国工厂直供'
    : 'Wholesale EV Charging Accessories & Adapters - China Factory Direct';
  const desc = lang === 'zh'
    ? 'youpei auto 是专业的电动汽车充电配件批发供应商，专注GBT/Type 2充电枪、转接器、便携式充电桩、V2L放电器等产品，工厂直供，MOQ 2-5件起批，CE认证，全球发货。'
    : 'Wholesale EV charging accessories from China factory: GBT charging guns, GB/T to Type 2 adapters, 7kW portable EV chargers, V2L discharge adapters, cables & sockets. MOQ 2-5 pcs, CE certified, global shipping to Southeast Asia and worldwide.';
  const keywords = SITE_CONFIG.keywords[lang as 'zh' | 'en'];

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={title}
        description={desc}
        keywords={keywords}
        type="website"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'youpei auto',
          alternateName: 'Wholesale EV Charging Accessories Supplier',
          url: SITE_CONFIG.url,
          description: desc,
          inLanguage: lang,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_CONFIG.url}/products?keyword={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }}
      />

      <main>
        <HeroSection />
        <WholesaleBannerSection />
        <CategoriesSection />
        <VideoSection />
        <FeaturedSection />
        <AdvantagesSection />
        <WhyWholesaleSection />
        <CTASection />
      </main>
    </div>
  );
}
