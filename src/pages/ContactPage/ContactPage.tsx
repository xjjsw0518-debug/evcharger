import { useState } from 'react';
import { Mail, MessageCircle, MapPin, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLang } from '@/context/LanguageContext';
import { useContactSettings } from '@/hooks/useContactSettings';
import { Image } from '@/components/ui/image';
import Seo from '@/components/Seo';
import { UniversalLink } from '@lark-apaas/client-toolkit-lite';

export default function ContactPage() {
  const { t, lang } = useLang();
  const { settings, getWaUrl, getAddress, loaded } = useContactSettings();

  const waUrl = getWaUrl();
  const address = getAddress(lang as 'zh' | 'en');

  const contactItems = [
    { icon: Mail, label: t.contact.info.email, value: settings.email, href: `mailto:${settings.email}` },
    { icon: MessageCircle, label: 'WhatsApp', value: settings.whatsapp, href: waUrl },
    { icon: MapPin, label: t.contact.info.address, value: address },
  ];

  if (!loaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={lang === 'zh' ? '联系我们 - youpei auto' : 'Contact Us - youpei auto Wholesale EV Charging Accessories'}
        description={lang === 'zh'
          ? '联系 youpei auto 采购 EV 充电配件，WhatsApp 24小时内快速响应，MOQ 2-5件起批。'
          : 'Contact youpei auto for wholesale EV charging accessories. 24h WhatsApp response, MOQ 2-5 pcs.'}
        keywords="contact EV charger supplier, wholesale EV charging accessories contact, China EV charging adapter factory"
        type="website"
      />

      {/* Page Header */}
      <section className="w-full bg-gradient-to-b from-emerald-500/10 via-background to-background py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium mb-4">
            {lang === 'zh' ? 'B2B 批发专用' : 'Wholesale Only'}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t.contact.title}</h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            {lang === 'zh'
              ? '批发业务咨询请直接通过 WhatsApp 联系我们，专业销售团队 24 小时内快速回复'
              : 'For wholesale inquiries, contact us on WhatsApp for quick response from our professional sales team'}
          </p>
        </div>
      </section>

      <section className="w-full py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          {/* 大号 WhatsApp CTA */}
          <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 mb-10">
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <div className="size-20 md:size-24 rounded-3xl bg-[#25D366] flex items-center justify-center shrink-0 shadow-lg shadow-[#25D366]/30">
                  <MessageCircle className="size-10 md:size-12 text-white" strokeWidth={2.2} />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {lang === 'zh' ? 'WhatsApp 快速咨询' : 'Quick WhatsApp Inquiry'}
                  </h2>
                  <p className="text-muted-foreground mb-4 max-w-xl">
                    {lang === 'zh'
                      ? '添加我们的 WhatsApp，获取产品目录、最新报价、样品政策等批发信息。专业业务员 1 对 1 服务。'
                      : 'Add our WhatsApp for catalog, latest quotes, sample policy and more wholesale info. Professional 1-on-1 sales support.'}
                  </p>
                  <div className="font-mono text-lg font-semibold text-emerald-600 mb-4">
                    {settings.whatsapp}
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={() => window.open(waUrl, '_blank')}
                  className="bg-[#25D366] hover:bg-[#22c55e] text-white h-12 px-8 rounded-xl shadow-lg shadow-[#25D366]/20 text-base"
                >
                  <MessageCircle className="size-5 mr-2" />
                  {lang === 'zh' ? '立即咨询' : 'Chat Now'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* 微信二维码卡片 */}
            <Card className="border-border/50">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#07C160]/10 text-[#07C160] flex items-center justify-center">
                    <QrCode className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {lang === 'zh' ? '微信扫码添加' : 'Scan WeChat QR'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {lang === 'zh' ? '添加我们的销售微信' : 'Add our sales WeChat'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-white rounded-2xl border border-border shadow-sm">
                    <Image
                      src={settings.wechatQrUrl}
                      alt="WeChat QR Code"
                      className="w-48 h-48 object-cover rounded-lg"
                    />
                  </div>
                  <p className="mt-4 text-sm font-medium text-foreground">
                    WeChat: {settings.wechatId}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {lang === 'zh' ? '长按识别或扫码添加' : 'Scan to add us on WeChat'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 联系信息卡片 */}
            <Card className="border-border/50">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-lg font-bold text-foreground mb-5">
                  {t.contact.info.title}
                </h3>
                <div className="space-y-5">
                  {contactItems.map((item, idx) => {
                    const Icon = item.icon;
                    const content = (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                          <Icon className="size-5" strokeWidth={1.8} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs text-muted-foreground">{item.label}</div>
                          <div className="text-sm font-medium text-foreground break-all">{item.value}</div>
                        </div>
                      </div>
                    );
                    return (
                      <div key={idx}>
                        {item.href ? (
                          <UniversalLink to={item.href} target="_blank" rel="noreferrer" className="block hover:opacity-80 transition-opacity">
                            {content}
                          </UniversalLink>
                        ) : content}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-border/50">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {lang === 'zh'
                      ? '⚠️ 我们只服务 B2B 批发客户（经销商、修理厂、电商卖家等），不面向个人零售。MOQ 2-5 件起批。'
                      : '⚠️ We only serve B2B wholesale customers (distributors, repair shops, e-commerce sellers etc.), not individual retail. MOQ 2-5 pcs.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
