import { motion } from 'framer-motion';
import { Building2, Store, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';

export default function WhyWholesaleSection() {
  const { lang } = useLang();

  const targetCustomers = [
    {
      icon: Building2,
      title: lang === 'zh' ? '经销商 / 进口商' : 'Distributors / Importers',
      desc: lang === 'zh'
        ? '大批量采购，享受阶梯价优惠，建立长期稳定供货关系'
        : 'Bulk purchasing with tiered pricing, build long-term stable supply relationships',
    },
    {
      icon: Store,
      title: lang === 'zh' ? '维修厂 / 安装服务' : 'Repair Shops / Installers',
      desc: lang === 'zh'
        ? '常用型号常备库存，快速补货，满足日常维修需求'
        : 'Common models in stock, quick restocking to meet daily repair needs',
    },
    {
      icon: ShoppingBag,
      title: lang === 'zh' ? '电商 / 线上卖家' : 'E-commerce / Online Sellers',
      desc: lang === 'zh'
        ? '一件代发支持，高清图片库，助力您的线上销售业务'
        : 'Dropshipping support, high-res image library, boost your online sales',
    },
  ];

  return (
    <section className="w-full py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 md:p-12 overflow-hidden relative">
          {/* 装饰 */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-amber-400/10 translate-y-1/2 -translate-x-1/4" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium mb-4">
                {lang === 'zh' ? '重要说明' : 'Important Notice'}
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {lang === 'zh' ? '为什么我们只做批发？' : 'Why Wholesale Only?'}
              </h2>
              <p className="text-white/80 text-base leading-relaxed mb-6">
                {lang === 'zh'
                  ? 'youpei auto 专注于 B2B 批发业务，我们不面向个人零售客户。所有产品均为工厂直供批发价，以 MOQ 2-5 件起订，为企业客户提供最具竞争力的价格和服务。'
                  : 'youpei auto focuses exclusively on B2B wholesale business. We do not serve individual retail customers. All products are factory direct wholesale prices with MOQ starting from 2-5 pieces, offering the most competitive pricing and service for business customers.'}
              </p>
              <div className="space-y-2.5">
                {[
                  lang === 'zh' ? '✅ 工厂直供批发价' : '✅ Factory direct wholesale price',
                  lang === 'zh' ? '✅ MOQ 仅 2-5 件起批' : '✅ MOQ as low as 2-5 pieces',
                  lang === 'zh' ? '✅ CE 认证产品，品质保障' : '✅ CE certified products, quality guaranteed',
                  lang === 'zh' ? '✅ 专业团队 24h 快速响应' : '✅ Professional team with 24h fast response',
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                    className="flex items-center gap-2 text-white/90 text-sm"
                  >
                    <CheckCircle2 className="size-4 text-emerald-200 shrink-0" />
                    <span>{item.replace(/✅\s?/, '')}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3"
            >
              {targetCustomers.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5 hover:bg-white/15 transition-colors"
                  >
                    <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                      <Icon className="size-5 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-base mb-1">{item.title}</h3>
                    <p className="text-white/65 text-xs leading-relaxed">{item.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
