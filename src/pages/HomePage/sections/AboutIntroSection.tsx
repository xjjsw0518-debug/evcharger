import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, Globe } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { SITE_CONFIG } from '@/data/site';

export default function AboutIntroSection() {
  const { lang } = useLang();

  const highlights = [
    {
      icon: Zap,
      title: lang === 'zh' ? '专注 EV 充电领域' : 'Focused on EV Charging',
      desc: lang === 'zh'
        ? '深耕电动汽车充电配件行业，拥有完整的产品线和专业的技术团队，持续跟踪 GB/T、Type 2、CCS 等全球充电标准更新。'
        : 'Deeply rooted in the EV charging accessories industry with a complete product line and professional technical team, continuously tracking global charging standards including GB/T, Type 2, and CCS.',
    },
    {
      icon: Target,
      title: lang === 'zh' ? '服务全球 B 端客户' : 'Serving Global B2B Clients',
      desc: lang === 'zh'
        ? '核心客户覆盖东南亚、欧洲、中东、南美等地区的经销商、修理厂、电商卖家和充电运营商，提供从选品到售后的全流程服务。'
        : 'Core clients include distributors, repair shops, e-commerce sellers, and charging operators across Southeast Asia, Europe, Middle East, and South America, providing full-process service from product selection to after-sales support.',
    },
    {
      icon: Globe,
      title: lang === 'zh' ? '一站式批发采购' : 'One-Stop Wholesale Sourcing',
      desc: lang === 'zh'
        ? '产品涵盖充电枪、转接器、便携充电桩、V2L 放电器、充电线缆、插座连接器等全品类，支持 OEM/ODM 定制，MOQ 2-5 件起批。'
        : 'Products cover charging guns, adapters, portable chargers, V2L discharge adapters, charging cables, sockets and connectors. OEM/ODM customization available, MOQ starting from 2-5 pieces.',
    },
  ];

  return (
    <section className="w-full py-12 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* 左侧：文字介绍 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium">
              <Zap className="size-3.5" />
              {lang === 'zh' ? '关于我们' : 'About Us'}
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              {lang === 'zh'
                ? '专业的电动汽车充电配件批发供应商'
                : 'Professional Wholesale Supplier of EV Charging Accessories'}
            </h2>

            <div className="space-y-4 text-muted-foreground text-sm md:text-base leading-relaxed">
              <p>
                {lang === 'zh'
                  ? `${SITE_CONFIG.name}（优配电动汽车充电配件）是一家专注于电动汽车充电领域的批发供应商，致力于为全球客户提供高品质、高性价比的 EV 充电配件产品。我们的产品线涵盖 GB/T 国标充电枪、Type 2 欧标充电枪、GB/T 转 Type 2 转接器、7kW 便携式交流充电桩、V2L 车辆外放电适配器、充电线缆以及各类插座连接器等全品类配件。`
                  : `${SITE_CONFIG.name} is a wholesale supplier focused on the electric vehicle charging industry, dedicated to providing global customers with high-quality, cost-effective EV charging accessories. Our product line covers GB/T national standard charging guns, Type 2 European standard charging guns, GB/T to Type 2 adapters, 7kW portable AC chargers, V2L vehicle-to-load discharge adapters, charging cables, and various socket connectors.`}
              </p>
              <p>
                {lang === 'zh'
                  ? '我们与国内多家具备 CE 认证资质的工厂建立了深度合作关系，严格把控产品质量，确保每一件产品都符合国际安全标准。针对东南亚、欧洲、中东等不同市场的需求，我们提供灵活的 MOQ 政策（2-5 件起批）、多样化的物流方案（海运、空运、快递）以及专业的售前售后服务，帮助客户降低采购成本、提升市场竞争力。'
                  : 'We have established deep partnerships with multiple CE-certified factories in China, strictly controlling product quality to ensure every product meets international safety standards. Addressing the needs of different markets including Southeast Asia, Europe, and the Middle East, we offer flexible MOQ policies (starting from 2-5 pieces), diverse logistics solutions (sea, air, express), and professional pre-sales and after-sales service to help customers reduce procurement costs and enhance market competitiveness.'}
              </p>
              <p>
                {lang === 'zh'
                  ? '无论您是刚入行的小型经销商，还是拥有成熟渠道的大型进口商，我们都能为您提供量身定制的采购方案。欢迎通过 WhatsApp 与我们的销售团队联系，获取最新产品目录和批发报价。'
                  : 'Whether you are a small distributor just entering the industry or a large importer with established channels, we can provide tailored procurement solutions for you. Welcome to contact our sales team via WhatsApp for the latest product catalog and wholesale quotes.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                {lang === 'zh' ? '了解更多' : 'Learn More'}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
              >
                {lang === 'zh' ? '浏览产品' : 'Browse Products'}
              </Link>
            </div>
          </motion.div>

          {/* 右侧：核心亮点卡片 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            {highlights.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="group p-5 md:p-6 rounded-2xl bg-card border border-border/50 hover:border-emerald-500/30 hover:shadow-md transition-all"
              >
                <div className="flex gap-4">
                  <div className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform">
                    <item.icon className="size-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base md:text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
