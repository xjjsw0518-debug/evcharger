import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { useLang } from '@/context/LanguageContext';
import { useProducts } from '@/hooks/useProducts';

export default function FeaturedSection() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const { products } = useProducts();

  const featured = products.slice(0, 8);

  return (
    <section className="w-full py-12 md:py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-8 gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6d00]/10 text-[#ff6d00] text-xs font-medium mb-3">
              <Sparkles className="size-3.5" />
              {lang === 'zh' ? '热销爆款' : 'Hot Selling'}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {t.home.featuredTitle}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base mt-1">
              {t.home.featuredSubtitle}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/products')}
            className="hidden sm:inline-flex"
          >
            {t.home.viewAll}
            <ArrowRight className="size-4 ml-1" />
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" onClick={() => navigate('/products')}>
            {t.home.viewAll}
            <ArrowRight className="size-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
