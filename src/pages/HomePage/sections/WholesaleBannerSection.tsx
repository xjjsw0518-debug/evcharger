import { motion } from 'framer-motion';
import { ShieldCheck, Package, Building2 } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';

export default function WholesaleBannerSection() {
  const { lang } = useLang();

  const items = [
    {
      icon: Building2,
      text: lang === 'zh' ? 'WHOLESALE ONLY' : 'WHOLESALE ONLY',
    },
    {
      icon: ShieldCheck,
      text: lang === 'zh' ? '企业买家专属' : 'Business Buyer Only',
    },
    {
      icon: Package,
      text: lang === 'zh' ? 'MOQ: 2-5 件起批' : 'MOQ: 2-5 pcs',
    },
  ];

  return (
    <section className="w-full py-5 md:py-6 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border-y border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2"
        >
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-2">
                <Icon className="size-4 md:size-5 text-emerald-600" strokeWidth={2} />
                <span className="text-sm md:text-base font-bold text-foreground tracking-wide">
                  {item.text}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
