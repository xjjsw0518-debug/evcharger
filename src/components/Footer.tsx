import { NavLink, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { useLang, getText } from '@/context/LanguageContext';
import { useCategories } from '@/hooks/useCategories';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useContactSettings } from '@/hooks/useContactSettings';
import Logo from '@/components/Logo';
import SocialIcon from '@/components/SocialIcon';

export default function Footer() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const { settings, getFooterQuickLinks, getFooterSocials } = useSiteSettings();
  const { settings: contactSettings, getAddress, loaded: contactLoaded } = useContactSettings();
  const { categories } = useCategories();

  const quickLinks = getFooterQuickLinks();
  const socials = getFooterSocials();
  const topCategories = [...categories].sort((a, b) => a.order - b.order).slice(0, 8);

  const currentYear = new Date().getFullYear();
  const copyrightText = lang === 'zh' ? settings.footerCopyrightZh : settings.footerCopyrightEn;
  const copyright = copyrightText.replace('{year}', String(currentYear));

  const companyDesc = lang === 'zh' ? settings.footerCompanyDescZh : settings.footerCompanyDescEn;
  const ctaTitle = lang === 'zh' ? settings.footerCtaTitleZh : settings.footerCtaTitleEn;
  const ctaDesc = lang === 'zh' ? settings.footerCtaDescZh : settings.footerCtaDescEn;
  const footerAddress = lang === 'zh' ? settings.footerAddressZh : settings.footerAddressEn;
  // 邮箱读取逻辑：页脚设置优先（用户更倾向于在页脚设置中修改），联系信息设置兜底
  // 这样用户无论在哪个设置中修改邮箱，都能生效
  const email = settings.footerEmail || contactSettings.email;
  const whatsapp = contactSettings.whatsapp || settings.footerWhatsapp;
  const address = contactLoaded
    ? (lang === 'zh' ? contactSettings.addressZh : contactSettings.addressEn) || footerAddress
    : footerAddress;

  return (
    <footer className="w-full bg-foreground text-background/90 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* 主体 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 py-12 md:py-16">
          {/* 品牌信息 */}
          <div className="space-y-4">
            {/* Logo 容器：透明背景，确保 logo 完整显示，与文字对齐 */}
            <div className="flex items-center w-auto max-w-full">
              <Logo size="sm" showText={true} />
            </div>
             <p className="text-sm text-background/70 leading-relaxed max-w-xs">
               {companyDesc || settings.footerCompanyName}
             </p>
             <div className="inline-block bg-primary/20 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full border border-primary/30">
               Wholesale EV Charging Accessories Supplier
             </div>
            <div className="space-y-2.5 text-sm">
              {email && (
                <div className="flex items-start gap-2.5">
                  <Mail className="size-4 shrink-0 mt-0.5 text-background/60" />
                  <a
                    href={`mailto:${email}`}
                    className="text-background/80 hover:text-background transition-colors break-all"
                  >
                    {email}
                  </a>
                </div>
              )}
              {settings.footerPhone && (
                <div className="flex items-start gap-2.5">
                  <Phone className="size-4 shrink-0 mt-0.5 text-background/60" />
                  <span className="text-background/80">{settings.footerPhone}</span>
                </div>
              )}
              {whatsapp && (
                <div className="flex items-start gap-2.5">
                  <MessageCircle className="size-4 shrink-0 mt-0.5 text-background/60" />
                  <span className="text-background/80">WhatsApp: {whatsapp}</span>
                </div>
              )}
              {address && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="size-4 shrink-0 mt-0.5 text-background/60" />
                  <span className="text-background/70 text-xs">
                    {address}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-background">
              {lang === 'zh' ? '快速链接' : 'Quick Links'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map(link => (
                <li key={link.id}>
                  <NavLink to={link.url} className="text-background/70 hover:text-background transition-colors">
                    {lang === 'zh' ? link.labelZh : link.labelEn}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* 产品分类 - 自动同步后台分类 */}
           <div>
             <h3 className="text-base font-semibold mb-4 text-background">
               {lang === 'zh' ? '产品分类' : 'Product Categories'}
             </h3>
             <ul className="space-y-2.5 text-sm">
               {topCategories.map(cat => (
                 <li key={cat.id}>
                   <NavLink
                     to={`/products/${cat.id}`}
                     className="text-background/70 hover:text-background transition-colors"
                   >
                     {getText(lang, cat.name)}
                   </NavLink>
                 </li>
               ))}
             </ul>
           </div>

          {/* CTA + 社交链接 */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-background">
              {ctaTitle}
            </h3>
            <p className="text-sm text-background/70 mb-4">
              {ctaDesc}
            </p>
             <button
               onClick={() => navigate('/contact')}
               className="inline-flex items-center px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-md transition-colors"
             >
               {lang === 'zh' ? '获取批发报价' : 'Get Wholesale Quote'} →
             </button>

            {/* 官方品牌社交图标 */}
            {socials.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {socials.map(item => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group w-9 h-9 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center text-background/80 hover:text-white transition-all hover:scale-110"
                    style={{ ['--brand-color' as string]: 'currentColor' }}
                    aria-label={item.platform}
                  >
                    <SocialIcon platform={item.platform} className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

         {/* 底栏 */}
         <div className="border-t border-background/10 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
           <p className="text-xs text-background/60 text-center md:text-left">
             {copyright}
           </p>
           <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-background/60">
             <a href="#" onClick={e => e.preventDefault()} className="hover:text-background/90 transition-colors">
               {lang === 'zh' ? '隐私政策' : 'Privacy Policy'}
             </a>
             <a href="#" onClick={e => e.preventDefault()} className="hover:text-background/90 transition-colors">
               {lang === 'zh' ? '服务条款' : 'Terms of Service'}
             </a>
           </div>
         </div>
      </div>
    </footer>
  );
}
