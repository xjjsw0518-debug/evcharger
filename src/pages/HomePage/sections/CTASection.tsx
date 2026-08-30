import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLang } from '@/context/LanguageContext';
import { useContactSettings } from '@/hooks/useContactSettings';

export default function CTASection() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const { getWaUrl, loaded } = useContactSettings();

  if (!loaded) return null;
  const waUrl = getWaUrl();

  return (
    <section className="w-full py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-8 md:p-16"
        >
          {/* 光晕装饰 */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-emerald-500/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl" />

          {/* 网格装饰 */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">
                {lang === 'zh'
                  ? '获取批发报价，开启您的采购之旅'
                  : 'Get Wholesale Pricing & Start Sourcing Today'}
              </h2>
              <p className="text-white/70 text-base md:text-lg max-w-lg">
                {lang === 'zh'
                  ? '联系我们的专业销售团队，获取产品目录和最新报价。WhatsApp 24 小时内快速回复。'
                  : 'Contact our professional sales team for catalog and latest quotes. 24-hour WhatsApp response guaranteed.'}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  size="lg"
                  onClick={() => window.open(waUrl, '_blank')}
                  className="bg-[#25D366] hover:bg-[#22c55e] text-white h-12 px-7 rounded-xl shadow-lg shadow-[#25D366]/20"
                >
                  <MessageCircle className="size-4 mr-1.5" />
                  WhatsApp Inquiry
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/products')}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white h-12 px-7 rounded-xl backdrop-blur-sm"
                >
                  {lang === 'zh' ? '浏览产品' : 'Browse Products'}
                  <ArrowRight className="size-4 ml-1.5" />
                </Button>
              </div>
            </div>

            <div className="hidden lg:flex justify-end">
              <div className="grid grid-cols-2 gap-4 w-80">
                {[
                  { val: '12+', label: lang === 'zh' ? '产品型号' : 'Product Models' },
                  { val: '7',   label: lang === 'zh' ? '产品类别' : 'Categories' },
                  { val: '80+', label: lang === 'zh' ? '服务国家' : 'Countries Served' },
                  { val: '24h', label: lang === 'zh' ? '快速响应' : 'Quick Response' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center"
                  >
                    <div
                      className="text-3xl md:text-4xl font-bold mb-1"
                      style={{
                        background: i % 2 === 0
                          ? 'linear-gradient(135deg, #34d399, #10b981)'
                          : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {item.val}
                    </div>
                    <div className="text-xs text-white/60">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
