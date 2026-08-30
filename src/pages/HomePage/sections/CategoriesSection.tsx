import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Grid3X3 } from 'lucide-react';
import { useLang, getText } from '@/context/LanguageContext';
import { useCategories } from '@/hooks/useCategories';
import {
  Zap,
  ArrowLeftRight,
  BatteryCharging,
  Cable,
  Plug,
  Sun,
  Wrench,
  LayoutGrid,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// EV 充电配件分类图标映射
const iconMap: Record<string, LucideIcon> = {
  'charging-guns': Zap,
  'adapters': ArrowLeftRight,
  'portable-chargers': BatteryCharging,
  'cables': Cable,
  'sockets-connectors': Plug,
  'v2l-discharge': Sun,
  'accessories': Wrench,
};

export default function CategoriesSection() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const { categories } = useCategories();

  const topCats = [...categories].sort((a, b) => a.order - b.order);

  return (
    <section className="w-full py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
            <LayoutGrid className="size-3.5" />
            {lang === 'zh' ? '7 大品类' : '7 Categories'}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {lang === 'zh' ? 'EV 充电配件全品类' : 'EV Charging Accessories Categories'}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            {lang === 'zh'
              ? 'GBT / Type 2 充电枪、转接器、便携式充电桩、V2L 放电器等全系列产品'
              : 'GBT / Type 2 charging guns, adapters, portable chargers, V2L adapters and more'}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
          {topCats.map((cat, i) => {
            const Icon = iconMap[cat.id] || Zap;
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => navigate(`/products/${cat.id}`)}
                className="group flex flex-col items-center gap-3 p-4 md:p-5 rounded-2xl hover:bg-card hover:border-border hover:shadow-md transition-all border border-border/40 bg-card/50"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 group-hover:from-emerald-500 group-hover:to-teal-500 group-hover:text-white transition-all">
                  <Icon className="size-6 md:size-7" strokeWidth={2} />
                </div>
                <span className="text-xs md:text-sm text-foreground/80 font-medium text-center leading-tight line-clamp-2">
                  {getText(lang, cat.name)}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
