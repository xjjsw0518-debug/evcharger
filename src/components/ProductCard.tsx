import { Link } from 'react-router-dom';
import { Package, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLang, useText, getText } from '@/context/LanguageContext';
import { MOCK_CATEGORIES } from '@/data/categories';
import type { IProduct } from '@/data/products';
import { Image } from '@/components/ui/image';

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t, lang } = useLang();
  const name = useText(product.name);
  const cat = MOCK_CATEGORIES.find(c => c.id === product.category);
  const catName = cat ? getText(lang, cat.name) : '';
  const displayImage = product.images?.[0] || product.mainImage;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-square bg-muted/30 overflow-hidden">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Package className="size-12" />
          </div>
        )}
         <div className="absolute top-3 left-3 flex flex-col gap-1.5">
           <Badge variant="default" className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 h-auto">
             {lang === 'zh' ? '仅批发' : 'Wholesale Only'}
           </Badge>
           {product.featured && (
             <Badge variant="secondary" className="bg-amber-500 text-white text-[10px] px-2 py-0.5 h-auto">
               HOT
             </Badge>
           )}
         </div>
         {product.ceCertified && (
           <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/90 backdrop-blur-sm text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded">
             <ShieldCheck className="size-3" />
             CE
           </div>
         )}
       </div>
       <div className="p-4 flex flex-col gap-2 flex-1">
         <div className="flex items-center gap-2 flex-wrap">
           <span className="text-xs text-muted-foreground">{catName}</span>
           <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-border text-muted-foreground">
             MOQ {product.moq}
           </Badge>
         </div>
        <h3 className="text-sm font-medium text-foreground line-clamp-2 min-h-[2.5rem] leading-snug group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="text-sm font-medium text-emerald-600">
              {lang === 'zh' ? '联系询价' : 'Contact for Price'}
            </div>
            <div className="text-xs text-muted-foreground">
              {lang === 'zh' ? `MOQ ${product.moq} 件起批` : `MOQ ${product.moq} pcs`}
            </div>
          </div>
          <Button size="sm" variant="secondary" className="text-xs h-8 px-3">
            {t.product.viewDetail}
          </Button>
        </div>
      </div>
    </Link>
  );
}
