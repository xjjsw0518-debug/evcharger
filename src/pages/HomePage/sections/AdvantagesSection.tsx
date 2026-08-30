import { motion } from 'framer-motion';
import { Factory, BadgeDollarSign, ShieldCheck, Truck, Headphones, Package } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';

const ICONS = {
  factory: Factory,
  price: BadgeDollarSign,
  quality: ShieldCheck,
  shipping: Truck,
  moq: Package,
  service: Headphones,
};

export default function AdvantagesSection() {
  const { lang } = useLang();

  const advantages = [
    {
      icon: 'factory' as const,
      title: lang === 'zh' ? '工厂直供批发价' : 'Factory Direct Wholesale Price',
      desc: lang === 'zh'
        ? '自有工厂 + 深度合作供应链，省去中间环节，价格更具竞争力'
        : 'Own factory + deep supply chain partners, skip middlemen for better pricing',
    },
    {
      icon: 'quality' as const,
      title: lang === 'zh' ? 'CE 认证品质' : 'CE Certified Quality',
      desc: lang === 'zh'
        ? '全系列产品通过 CE 认证，严格品控，品质可靠有保障'
        : 'Full product range CE certified with strict QC for reliable quality',
    },
    {
      icon: 'moq' as const,
      title: lang === 'zh' ? 'MOQ 2-5 件起批' : 'MOQ 2-5 pcs Only',
      desc: lang === 'zh'
        ? '低起订量，支持小批量试单，降低您的采购风险和资金压力'
        : 'Low minimum order quantity for trial orders, reduce your purchasing risk',
    },
    {
      icon: 'shipping' as const,
      title: lang === 'zh' ? '全球物流配送' : 'Global Shipping',
      desc: lang === 'zh'
        ? '海运 / 空运 / 快递多渠道，覆盖全球 80+ 国家和地区'
        : 'Sea / air / express shipping to 80+ countries and regions worldwide',
    },
    {
      icon: 'service' as const,
      title: lang === 'zh' ? '24h WhatsApp 响应' : '24h WhatsApp Reply',
      desc: lang === 'zh'
        ? '专业业务员一对一服务，WhatsApp 24 小时内快速回复'
        : 'Professional 1-on-1 sales support with 24-hour WhatsApp response',
    },
    {
      icon: 'price' as const,
      title: lang === 'zh' ? 'OEM/ODM 定制' : 'OEM / ODM Available',
      desc: lang === 'zh'
        ? '支持品牌定制、包装定制、规格定制，满足您的个性化需求'
        : 'Brand customization, packaging customization, spec customization available',
    },
  ];

  return (
    <section className="w-full py-12 md:py-16 bg-gradient-to-b from-transparent via-emerald-50/30 to-transparent">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium mb-3">
            <ShieldCheck className="size-3.5" />
            {lang === 'zh' ? '为什么选择我们' : 'Why Choose Us'}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {lang === 'zh' ? '专业 EV 充电配件批发供应商' : 'Your Trusted EV Charging Accessories Wholesaler'}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            {lang === 'zh'
              ? '专注 EV 充电配件领域，为全球经销商、修理厂、电商卖家提供一站式批发采购服务'
              : 'Focused on EV charging accessories, one-stop wholesale for global distributors, repair shops and e-commerce sellers'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {advantages.map((item, i) => {
            const Icon = ICONS[item.icon];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-emerald-500/30 hover:shadow-lg overflow-hidden transition-all"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-opacity bg-emerald-500" />
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 bg-emerald-500/10 text-emerald-600">
                  <Icon className="size-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
