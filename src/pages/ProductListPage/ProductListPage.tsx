import { useState, useMemo, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLang, useText, getText } from '@/context/LanguageContext';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import ProductCard from '@/components/ProductCard';
import Seo from '@/components/Seo';
import { cn } from '@/lib/utils';

type SortKey = 'default' | 'newest';

export default function ProductListPage() {
  const { t, lang } = useLang();
  const { category: paramCategory } = useParams<{ category?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { products, loaded } = useProducts();
  const { categories } = useCategories();

  const urlKeyword = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('keyword') || '';
  }, [location.search]);

  const [keyword, setKeyword] = useState(urlKeyword);
  const [selectedCategory, setSelectedCategory] = useState<string>(paramCategory || 'all');
  const [sort, setSort] = useState<SortKey>('default');
  const [moqMax, setMoqMax] = useState('');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  // 路由变化时同步分类
  useEffect(() => {
    setSelectedCategory(paramCategory || 'all');
  }, [paramCategory]);

  useEffect(() => {
    setKeyword(urlKeyword);
  }, [urlKeyword]);

  const filtered = useMemo(() => {
    let list = [...products];

    // 分类
    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }

    // 关键词
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      list = list.filter(p =>
        p.name.zh.toLowerCase().includes(kw) ||
        p.name.en.toLowerCase().includes(kw) ||
        p.description.zh.toLowerCase().includes(kw) ||
        p.description.en.toLowerCase().includes(kw)
      );
    }

    // 价格
    if (moqMax) list = list.filter(p => p.moq <= Number(moqMax));

    // 排序
    switch (sort) {
      case 'newest':
        list.sort((a, b) => b.createdAt - a.createdAt);
        break;
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [products, selectedCategory, keyword, sort, moqMax]);

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      navigate('/products');
    } else {
      navigate(`/products/${catId}`);
    }
    setFilterSheetOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const kw = keyword.trim();
    if (kw) {
      navigate(`/products?keyword=${encodeURIComponent(kw)}`);
    } else {
      navigate('/products');
    }
  };

  const resetFilters = () => {
    setMoqMax('');
    setSelectedCategory('all');
    navigate('/products');
  };

  const activeCat = categories.find(c => c.id === selectedCategory);
  const activeCategoryName = selectedCategory === 'all'
    ? t.product.allCategories
    : (activeCat ? getText(lang, activeCat.name) : '');

  // SEO: 根据分类动态生成 title 和 description
  const seoTitle = useMemo(() => {
    if (lang === 'zh') {
      if (selectedCategory === 'all') {
        return 'EV充电配件批发 | GBT充电枪 | 转接器 | 便携充电桩 | youpei auto';
      }
      return `批发${activeCategoryName} - ${activeCategoryName}厂家直供 | youpei auto`;
    }
    if (selectedCategory === 'all') {
      return 'Wholesale EV Charging Accessories - GBT Guns, Adapters, Portable Chargers | youpei auto';
    }
    return `Wholesale ${activeCategoryName} - Factory Direct Price & Bulk MOQ | youpei auto`;
  }, [lang, selectedCategory, activeCategoryName]);

  const seoDesc = useMemo(() => {
    if (lang === 'zh') {
      if (selectedCategory === 'all') {
        return '批发EV充电配件全品类：GBT充电枪、GBT转Type 2转接器、7kW便携式充电桩、V2L放电器、充电线缆、插座连接器等。工厂直供价格，MOQ 2-5件起批，CE认证，全球发货。';
      }
      return `批发${activeCategoryName}，工厂直供价格，MOQ 2-5件起批，CE认证，全球发货。youpei auto 专业EV充电配件供应商。`;
    }
    if (selectedCategory === 'all') {
      return 'Browse our wholesale EV charging accessories catalog: GBT charging guns, GB/T to Type 2 adapters, 7kW portable EV chargers, V2L discharge adapters, charging cables and more. Factory direct prices, MOQ 2-5 pcs, CE certified.';
    }
    return `Wholesale ${activeCategoryName} from China factory. Factory direct prices, MOQ 2-5 pcs, CE certified, global shipping. youpei auto - your reliable EV charging accessories supplier.`;
  }, [lang, selectedCategory, activeCategoryName]);

  const seoKeywords = useMemo(() => {
    if (lang === 'zh') {
      if (selectedCategory === 'all') {
        return 'EV充电配件批发,GBT充电枪,Type 2转接器,便携式充电桩,V2L放电器,充电线缆,中国充电配件工厂';
      }
      return `批发${activeCategoryName},${activeCategoryName}厂家,EV充电配件批发,youpei auto`;
    }
    if (selectedCategory === 'all') {
      return 'wholesale EV charging accessories, GBT charging gun bulk, Type 2 adapter wholesale, portable EV charger China, V2L discharge adapter, EV charging cable factory';
    }
    return `wholesale ${activeCategoryName}, bulk ${activeCategoryName}, ${activeCategoryName} factory China, EV charging accessories supplier`;
  }, [lang, selectedCategory, activeCategoryName]);

  const FilterAside = (
    <aside className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-3 text-sm">{t.product.allCategories}</h3>
        <div className="space-y-1">
          <button
            onClick={() => handleCategoryClick('all')}
            className={cn(
              'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
              selectedCategory === 'all'
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-foreground/80 hover:bg-accent/50'
            )}
          >
            {t.product.allCategories}
          </button>
          {categories
            .sort((a, b) => a.order - b.order)
            .map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                  selectedCategory === cat.id
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground/80 hover:bg-accent/50'
                )}
              >
                {cat.name[lang]}
              </button>
            ))}
        </div>
      </div>

      <div className="border-t border-border/40 pt-5">
        <h3 className="font-semibold text-foreground mb-3 text-sm">{t.product.moqRange}</h3>
        <Input
          type="number"
          placeholder={`${t.product.max} MOQ`}
          value={moqMax}
          onChange={e => setMoqMax(e.target.value)}
          className="h-9 text-sm"
        />
      </div>

      <div className="border-t border-border/40 pt-5 flex gap-2">
        <Button size="sm" variant="outline" className="flex-1" onClick={resetFilters}>
          {t.product.resetFilter}
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-background">
      <Seo title={seoTitle} description={seoDesc} keywords={seoKeywords} type="website" />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Breadcrumb / Title */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
            {keyword ? `"${keyword}"` : activeCategoryName || t.nav.products}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t.product.results.replace('{count}', String(filtered.length))}
          </p>
        </div>

        {/* Top bar: search + sort + filter (mobile) */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px] max-w-md">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder={t.nav.search}
                className="pl-9 h-10"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => { setKeyword(''); navigate('/products'); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </form>

          <div className="flex items-center gap-2 ml-auto">
            {isMobile && (
              <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <SlidersHorizontal className="size-4" />
                    {t.product.allCategories}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[80vw] max-w-sm overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>{t.product.allCategories}</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    {FilterAside}
                  </div>
                  <SheetClose />
                </SheetContent>
              </Sheet>
            )}

            <Select value={sort} onValueChange={v => setSort(v as SortKey)}>
              <SelectTrigger className="w-[160px] h-10">
                <SelectValue placeholder={t.product.sortBy} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">{t.product.sortDefault}</SelectItem>
                <SelectItem value="newest">{t.product.sortNewest}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main layout */}
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          {!isMobile && (
            <div className="w-56 shrink-0">
              <div className="sticky top-20 bg-card rounded-xl border border-border/50 p-4">
                {FilterAside}
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-muted-foreground">{t.product.noProducts}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={resetFilters}>
                  {t.product.resetFilter}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
