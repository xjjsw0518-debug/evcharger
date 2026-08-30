import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageCircle, Factory, Shield, Globe, Package, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLang } from '@/context/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useContactSettings } from '@/hooks/useContactSettings';
import { Image } from '@/components/ui/image';

export default function HeroSection() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const { settings, getHeroBgUrl, getHeroTitle, getHeroSubtitle } = useSiteSettings();
  const { getWaUrl, loaded: contactLoaded } = useContactSettings();

  const heroBg = getHeroBgUrl();
  const waUrl = getWaUrl();

  if (!contactLoaded) return null;
  const title = getHeroTitle(lang as 'zh' | 'en');
  const subtitle = getHeroSubtitle(lang as 'zh' | 'en');
  const titleLines = title.split('\n').filter(Boolean);

  const alignClass =
    settings.heroAlign === 'left' ? 'text-left items-start' :
    settings.heroAlign === 'right' ? 'text-right items-end' :
    'text-center items-center';

  const justifyClass =
    settings.heroAlign === 'left' ? 'justify-start' :
    settings.heroAlign === 'right' ? 'justify-end' :
    'justify-center';

  const mxAutoClass = settings.heroAlign === 'center' ? 'mx-auto' : '';

  return (
    <section className="relative w-full overflow-hidden">
      {/* 背景图 + 蒙层 */}
      <div className="absolute inset-0">
        <Image
          src={heroBg}
          alt="EV charging"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/70 to-teal-900/50" />
      </div>

      {/* 动态光晕 */}
      <motion.div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-emerald-500/20 blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 20, 0],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full bg-amber-500/15 blur-3xl"
        animate={{
          x: [0, 40, 0],
          y: [0, -20, 0],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* 网格线装饰 */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* 内容容器 - 左边垂直居中，行间距增大 */}
      <div
        className="relative flex items-center w-full"
        style={{
          minHeight: '68vh',
          paddingTop: settings.heroVerticalOffset ? `${settings.heroVerticalOffset}%` : 0,
        }}
      >
        <div className="w-full max-w-4xl ml-0 px-6 md:px-12 lg:px-16">
          <div className={`space-y-8 flex flex-col ${alignClass}`}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-snug tracking-tight"
          >
            {titleLines.map((line, i) => {
              const isLast = i === titleLines.length - 1 && titleLines.length > 1;
              return (
                <span key={i}>
                  {isLast ? (
                    <span
                      style={{
                        background: 'linear-gradient(90deg, #34d399 0%, #fbbf24 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {line}
                    </span>
                  ) : (
                    line
                  )}
                  {i < titleLines.length - 1 && <br />}
                </span>
              );
            })}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-base md:text-lg text-white/70 max-w-2xl leading-relaxed whitespace-pre-line ${mxAutoClass}`}
          >
            {subtitle}
          </motion.p>

          {/* CTA 按钮组 - 按钮间距可配置 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`flex flex-wrap pt-4 ${justifyClass}`}
            style={{ gap: `${settings.heroButtonGap}px` }}
          >
            <Button
              size="lg"
              onClick={() => navigate('/products')}
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold px-6 h-11 md:h-12"
            >
              {lang === 'zh' ? '查看产品' : 'View Products'}
              <ArrowRight className="size-4 ml-1.5" />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => window.open(waUrl, '_blank')}
              className="bg-[#25D366] hover:bg-[#22c55e] text-white font-semibold px-6 h-11 md:h-12 border-0"
            >
              <MessageCircle className="size-4 mr-1.5" />
              WhatsApp Inquiry
            </Button>
          </motion.div>

          {/* 社交媒体图标 - 关注我们 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`flex items-center gap-4 pt-2 ${justifyClass}`}
          >
            <span className="text-white/50 text-xs font-medium tracking-wider uppercase">
              {lang === 'zh' ? '关注我们' : 'Follow Us'}
            </span>
            <div className="flex items-center gap-3">
              {/* Facebook */}
              {settings.footerSocials?.find(s => s.platform === 'facebook')?.url && (
                <a
                  href={settings.footerSocials.find(s => s.platform === 'facebook')!.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-9 rounded-full bg-white/10 hover:bg-[#1877F2] text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook className="size-4" />
                </a>
              )}
              {/* Instagram */}
              {settings.footerSocials?.find(s => s.platform === 'instagram')?.url && (
                <a
                  href={settings.footerSocials.find(s => s.platform === 'instagram')!.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-9 rounded-full bg-white/10 hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#FCB045] text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram className="size-4" />
                </a>
              )}
              {/* TikTok - 使用内联 SVG */}
              {settings.footerSocials?.find(s => s.platform === 'tiktok')?.url && (
                <a
                  href={settings.footerSocials.find(s => s.platform === 'tiktok')!.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-9 rounded-full bg-white/10 hover:bg-[#000000] text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="TikTok"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z"/>
                  </svg>
                </a>
              )}
            </div>
          </motion.div>
          </div>
        </div>
      </div>

      {/* 信任指标 - 位置保持不变（底部） */}
      <div className="relative z-10 pb-16 md:pb-20 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto px-4 md:px-6"
        >
          {[
            { icon: Factory,   label: lang === 'zh' ? '工厂直供' : 'Factory Direct', val: '100%' },
            { icon: Shield,    label: lang === 'zh' ? 'CE 认证' : 'CE Certified', val: 'CE' },
            { icon: Globe,     label: lang === 'zh' ? '全球发货' : 'Global Shipping', val: '80+' },
            { icon: Package,   label: lang === 'zh' ? 'MOQ 起批' : 'MOQ Starting', val: '2-5' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="size-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                <item.icon className="size-5 text-emerald-400" />
              </div>
              <div className="text-white font-semibold text-sm">{item.val}</div>
              <div className="text-white/60 text-[11px]">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 底部波浪分隔 */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-10 md:h-16">
          <path
            d="M0,60 C360,0 720,60 1440,0 L1440,60 Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
}
