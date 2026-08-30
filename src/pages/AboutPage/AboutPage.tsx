import { Factory, Package, Settings, ShieldCheck, Truck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '@/context/LanguageContext';
import { useAboutContent } from '@/hooks/useAboutContent';
import { useContactSettings } from '@/hooks/useContactSettings';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import Seo from '@/components/Seo';

const ICON_MAP: Record<string, typeof Factory> = {
  Factory, Package, Settings, ShieldCheck, Truck, CheckCircle: CheckCircle2,
};

function getIcon(iconName: string) {
  const Icon = ICON_MAP[iconName] || CheckCircle2;
  return Icon;
}

export default function AboutPage() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const { content, isAboutEnabled, loaded } = useAboutContent();
  const { getWaUrl, loaded: contactLoaded } = useContactSettings();
  const year = new Date().getFullYear();
  const years = year - content.foundedYear;

  // 未发布时显示占位页
  if (loaded && !isAboutEnabled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {lang === 'zh' ? '页面建设中' : 'Page Coming Soon'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {lang === 'zh'
              ? '该页面暂时不可访问，请稍后再来。'
              : 'This page is temporarily unavailable. Please check back later.'}
          </p>
          <Button onClick={() => navigate('/')}>
            {lang === 'zh' ? '返回首页' : 'Back to Home'}
          </Button>
        </div>
      </div>
    );
  }

  const seoTitle = lang === 'zh'
    ? '关于我们 - youpei auto 电动汽车充电配件批发工厂'
    : 'About youpei auto - Wholesale EV Charging Accessories Factory';
  const seoDesc = lang === 'zh'
    ? 'youpei auto（优配汽配）是专业的电动汽车充电配件批发供应商，专注GBT/Type 2充电枪、转接器、便携式充电桩、V2L放电器等产品，工厂直供价格，MOQ 2-5件起批，CE认证，全球发货。'
    : 'youpei auto is a China-based wholesale supplier of EV charging accessories including GBT charging guns, Type 2 adapters, portable EV chargers, V2L discharge adapters and cables. Factory direct prices, MOQ 2-5 pcs, CE certified, global shipping.';
  const seoKeywords = lang === 'zh'
    ? '关于youpei auto,EV充电配件工厂,中国充电枪厂家,GBT充电枪制造商,Type 2转接器工厂'
    : 'about youpei auto, EV charging accessories factory China, wholesale EV charging supplier, GBT charging gun manufacturer, Type 2 adapter factory';

  return (
    <div className="min-h-screen bg-background">
      <Seo title={seoTitle} description={seoDesc} keywords={seoKeywords} type="website" />
      {/* Page Header */}
      <section className="w-full bg-gradient-to-b from-primary/10 via-background to-background py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t.about.title}</h1>
          <p className="text-muted-foreground text-lg">{content.slogan[lang as 'zh' | 'en']}</p>
        </div>
      </section>

      {/* Company Intro */}
      <section className="w-full py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t.about.companyIntro}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {content.description[lang as 'zh' | 'en']}
              </p>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{years}</div>
                  <div className="text-xs text-muted-foreground">{lang === 'zh' ? '年行业经验' : 'Years Exp.'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{content.skuCount}</div>
                  <div className="text-xs text-muted-foreground">{lang === 'zh' ? 'SKU数量' : 'SKUs'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{content.exportCountries}</div>
                  <div className="text-xs text-muted-foreground">{lang === 'zh' ? '出口国家' : 'Countries'}</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://picsum.photos/seed/ev-factory/600/500"
                alt={lang === 'zh' ? '工厂实拍' : 'Factory'}
                className="rounded-2xl shadow-lg w-full aspect-[6/5] object-cover"
                loading="lazy"
              />
              <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-xl shadow-lg border border-border/50">
                <div className="text-2xl font-bold text-primary">{content.foundedYear}</div>
                <div className="text-xs text-muted-foreground">{lang === 'zh' ? '成立年份' : 'Founded'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="w-full py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{lang === 'zh' ? '为什么选择我们' : 'Why Choose Us'}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{lang === 'zh' ? '专业品质、工厂直供、快速响应' : 'Professional quality, factory direct, fast response'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {content.advantages.map((adv, i) => {
              const Icon = getIcon(adv.icon);
              return (
                <div key={i} className="bg-card rounded-xl p-6 border border-border/50 hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {adv.title[lang as 'zh' | 'en']}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {adv.description[lang as 'zh' | 'en']}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="w-full py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{lang === 'zh' ? '合作流程' : 'Our Process'}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{lang === 'zh' ? '简单4步，开启您的EV充电配件采购之旅' : '4 simple steps to start your EV charging accessories sourcing'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {content.process.map((step, i) => (
              <div key={i} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="size-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mb-4 shadow-lg shadow-primary/20">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {step.title[lang as 'zh' | 'en']}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description[lang as 'zh' | 'en']}
                  </p>
                </div>
                {i < content.process.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/30 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-16 bg-gradient-to-r from-primary to-emerald-600">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            {lang === 'zh' ? '准备好开始合作了吗？' : 'Ready to Partner with Us?'}
          </h2>
          <p className="text-primary-foreground/80 mb-6">
            {lang === 'zh' ? '立即联系我们，获取专属报价和样品支持' : 'Contact us now for a custom quote and sample support'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href={getWaUrl()}>
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                {lang === 'zh' ? 'WhatsApp联系' : 'Contact via WhatsApp'}
              </Button>
            </a>
            <a href={`mailto:${content.contact.email}`}>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                {lang === 'zh' ? '发送邮件' : 'Send Email'}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
