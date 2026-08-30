import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronRight,
  Home,
  Package,
  Heart,
  Check,
  Warehouse,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLang, getText } from '@/context/LanguageContext';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useAnalytics } from '@/hooks/useAnalytics';
import { MOCK_CATEGORIES } from '@/data/categories';
import ProductCard from '@/components/ProductCard';
import ProductGallery from '@/components/ProductGallery';
import InquiryDialog from '@/components/InquiryDialog';
import Seo from '@/components/Seo';
import ShareButtons from '@/components/ShareButtons';
import { SITE_CONFIG } from '@/data/site';
import { useContactSettings } from '@/hooks/useContactSettings';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { IProduct, ISku } from '@/data/products';
import { UniversalLink } from '@lark-apaas/client-toolkit-lite';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const { products, loaded } = useProducts();
  const { categories } = useCategories();
  const { trackProductView } = useAnalytics();
  const { getWaUrl: getContactWaUrl, loaded: contactLoaded } = useContactSettings();
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedSkus, setSelectedSkus] = useState<Record<string, string>>({});

  const product = useMemo(() => products.find(p => p.id === id), [products, id]);
  const cat = categories.find(c => c.id === product?.category);
  const catName = cat ? getText(lang, cat.name) : '';

  // 产品浏览埋点
  useEffect(() => {
    if (product && loaded) {
      trackProductView(product.id, product.name[lang as 'zh' | 'en'] || product.name.en);
    }
  }, [product?.id, loaded, trackProductView, lang]);

  // 收集 SKU 规格组：取每个 SKU 的 name（多语言）作为规格选项值
  // 简化：单规格场景，把所有 SKU 的 name 作为一组选项
  const skuGroup = useMemo(() => {
    if (!product?.skus?.length) return null;
    return {
      name: lang === 'zh' ? '规格选择' : 'Specification',
      options: product.skus.map(sku => ({
        id: sku.id,
        label: sku.name[lang as 'zh' | 'en'] || sku.name.en,
      })),
    };
  }, [product, lang]);

  // 根据当前选择找匹配的 SKU
  const matchedSku = useMemo<ISku | null>(() => {
    if (!product?.skus?.length) return null;
    const selectedId = selectedSkus[skuGroup?.name || 'spec'];
    if (selectedId) {
      const found = product.skus.find(s => s.id === selectedId);
      if (found) return found;
    }
    return product.skus[0];
  }, [product, selectedSkus, skuGroup]);

  // 展示用的价格和图片（SKU 有则用 SKU 的，否则用产品主数据）
  const displayImages = useMemo(() => {
    if (!product) return [];
    const base = product.images?.length > 0 ? product.images : [product.mainImage];
    // 如果选了 SKU 且有独立图，把 SKU 图插到最前
    if (matchedSku?.image) {
      return [matchedSku.image, ...base.filter(i => i !== matchedSku.image)];
    }
    return base;
  }, [product, matchedSku]);

  // 相关产品：同分类产品
  const relatedProducts = useMemo(() => {
    if (!product) return [] as IProduct[];
    return products.filter(
      p => p.category === product.category && p.id !== product.id
    ).slice(0, 8);
  }, [products, product]);

  // 详情分区
  const detailSections = useMemo(() => {
    if (!product) return [];
    if (product.detailSections?.length) {
      return product.detailSections.map(sec => ({
        title: sec.title[lang as 'zh' | 'en'] || sec.title.en,
        content: sec.content[lang as 'zh' | 'en'] || sec.content.en,
        bullets: sec.bullets ? sec.bullets[lang as 'zh' | 'en'] : undefined,
        key: sec.key,
      }));
    }
    // 兜底：用 description 拼成一个 section
    return [{
      title: t.product.description,
      content: getText(lang, product.description),
      bullets: undefined as string[] | undefined,
      key: 'description' as const,
    }];
  }, [product, lang, t.product.description]);

  if (!loaded || !contactLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">
        {t.common.loading}
      </div>
    );
  }

  const productName = product ? getText(lang, product.name) : '';
  const description = product ? getText(lang, product.description) : '';

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Product not found</p>
        <Button onClick={() => navigate('/products')}>{t.nav.products}</Button>
      </div>
    );
  }

  const handleFavorite = () => {
    toast.success(lang === 'zh' ? '已收藏' : 'Added to favorites');
  };

  // JSON-LD: Product + BreadcrumbList
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    image: product.mainImage,
    description: description,
    brand: {
      '@type': 'Brand',
      name: 'youpei auto',
    },
    category: catName,
    sku: product.id,
    mpn: product.id,
    itemCondition: 'https://schema.org/NewCondition',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '120',
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      priceValidUntil: '2099-12-31',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: lang === 'zh' ? '首页' : 'Home', item: SITE_CONFIG.url },
      { '@type': 'ListItem', position: 2, name: t.nav.products, item: `${SITE_CONFIG.url}/products` },
      { '@type': 'ListItem', position: 3, name: catName, item: `${SITE_CONFIG.url}/products/${product.category}` },
      { '@type': 'ListItem', position: 4, name: productName },
    ],
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Seo
          title={productName}
          description={description}
          keywords={`${productName}, wholesale EV charging accessories, GBT charging gun bulk, China EV charger factory, ${catName}`}
          image={product.mainImage}
          type="product"
          jsonLd={[productJsonLd, breadcrumbJsonLd]}
        />

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          {/* 面包屑 + 返回 */}
          <div className="flex items-center justify-between mb-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/" className="flex items-center gap-1">
                      <Home className="size-3.5" />
                      <span className="hidden sm:inline">{t.nav.home}</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="size-3.5" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/products">{t.nav.products}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="size-3.5" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/products/${product.category}`}>{catName}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="size-3.5" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <span className="text-foreground text-sm font-medium truncate max-w-[180px]">
                    {productName}
                  </span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-muted-foreground shrink-0"
            >
              <ArrowLeft className="size-4 mr-1" />
              {t.common.back}
            </Button>
          </div>

          {/* 主产品区 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12">
            {/* 左：相册 */}
            <ProductGallery images={displayImages} productName={productName} />

            {/* 右：信息 + SKU */}
            <article className="space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge className="bg-primary text-primary-foreground gap-1 border-0">
                    {lang === 'zh' ? '仅批发' : 'Wholesale Only'}
                  </Badge>
                  <Badge variant="outline" className="gap-1 border-emerald-500/40 text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="size-3" />
                    CE Certified
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Package className="size-3" />
                    {catName}
                  </Badge>
                </div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                  {productName}
                </h1>
                <p className="text-xs text-muted-foreground mt-2">
                  {lang === 'zh'
                    ? 'SNI 认证由进口商负责办理 / SNI certification handled by importer'
                    : 'SNI certification handled by importer'}
                </p>
              </div>

              {/* 价格 + 库存 —— 前台隐藏价格，改为联系询价 */}
              <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-5 space-y-3 border border-emerald-200/50 dark:border-emerald-800/30">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-muted-foreground">{t.product.price}:</span>
                  <span className="text-xl font-bold text-emerald-600">
                    {lang === 'zh' ? '批发价请联系我们' : 'Wholesale Price: Contact Us'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                  <div className="flex items-baseline gap-2">
                    <span className="text-muted-foreground">{t.product.moq}:</span>
                    <Badge variant="secondary" className="text-sm">
                      {product.moq} {t.product.unit}
                    </Badge>
                  </div>
                  {matchedSku && (
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <Warehouse className="size-4" />
                      <span className="text-xs font-medium">
                        {lang === 'zh' ? `库存：${matchedSku.stock}件` : `Stock: ${matchedSku.stock} pcs`}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-emerald-700/70 dark:text-emerald-300/60">
                  {lang === 'zh'
                    ? '💡 不同规格和数量对应不同价格，点击下方WhatsApp或询盘按钮获取最新报价。'
                    : '💡 Prices vary by spec and quantity. Click WhatsApp or Inquiry button below for the latest quote.'}
                </p>
              </div>

              {/* SKU 选择 */}
              {skuGroup && (
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-foreground mb-2">
                      {skuGroup.name}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skuGroup.options.map(opt => {
                        const isActive = selectedSkus[skuGroup.name] === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              setSelectedSkus(prev => ({ ...prev, [skuGroup.name]: opt.id }))
                            }
                            className={cn(
                              'px-4 py-2 rounded-lg text-sm font-medium border transition-all',
                              isActive
                                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                : 'bg-card text-foreground border-border hover:border-primary/50'
                            )}
                          >
                            {opt.label}
                            {isActive && <Check className="size-3.5 ml-1.5 inline" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 操作按钮 - WhatsApp 直接咨询 */}
              <div className="flex flex-col sm:flex-row gap-3">
                <UniversalLink
                  to={getContactWaUrl(`Hi, I'm interested in wholesale ${productName}. Please send me the catalog and price list.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1"
                >
                  <Button
                    size="lg"
                    className="w-full bg-[#25D366] hover:bg-[#22c55e] text-white"
                  >
                    <MessageCircle className="size-5 mr-2" />
                    {lang === 'zh' ? '在 WhatsApp 上咨询' : 'Inquire on WhatsApp'}
                  </Button>
                </UniversalLink>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="inline-flex">
                      <ShareButtons
                        url={`/products/${id}`}
                        title={productName}
                        description={description}
                        size="sm"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{lang === 'zh' ? '分享产品' : 'Share product'}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleFavorite}
                      className="sm:w-12 sm:px-0"
                      aria-label="Favorite"
                    >
                      <Heart className="size-4" />
                      <span className="sm:hidden ml-2">
                        {lang === 'zh' ? '收藏' : 'Favorite'}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{lang === 'zh' ? '收藏产品' : 'Add to favorites'}</TooltipContent>
                </Tooltip>
              </div>

              {/* 快速规格 */}
              {product.specs.length > 0 && (
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <Table>
                      <TableBody>
                        {product.specs.slice(0, 5).map((s, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="w-2/5 text-muted-foreground text-sm py-2.5">
                              {s.label[lang as 'zh' | 'en']}
                            </TableCell>
                            <TableCell className="text-sm py-2.5 font-medium">{s.value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </article>
          </div>

          {/* 详情分区 + 完整规格 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <div className="lg:col-span-2 space-y-5">
              {detailSections.map((sec, i) => (
                <Card key={i} className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{sec.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {sec.bullets && sec.bullets.length > 0 ? (
                      <ul className="space-y-2.5 text-sm text-foreground/80 leading-relaxed">
                        {sec.bullets.map((line, li) => (
                          <li key={li} className="flex items-start gap-2.5">
                            <span className="text-primary mt-0.5 shrink-0">✓</span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-foreground/80 leading-relaxed whitespace-pre-line text-sm md:text-base">
                        {sec.content}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 右侧完整规格 */}
            <div className="space-y-5">
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{t.product.specs}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="w-full overflow-x-auto">
                    <Table>
                      <TableBody>
                        {product.specs.map((s, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="w-2/5 text-muted-foreground text-sm py-2.5 whitespace-nowrap">
                              {s.label[lang as 'zh' | 'en']}
                            </TableCell>
                            <TableCell className="text-sm py-2.5 font-medium">{s.value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* SKU 详情表（如果有） */}
              {product.skus && product.skus.length > 0 && (
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {lang === 'zh' ? '规格一览' : 'SKU Variants'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="w-full overflow-x-auto">
                      <Table>
                        <TableBody>
                          {product.skus.map((sku, idx) => {
                            const val = sku.name[lang as 'zh' | 'en'] || sku.name.en;
                            return (
                               <TableRow key={idx} className="cursor-pointer hover:bg-muted/50"
                                 onClick={() => {
                                   if (skuGroup) {
                                     setSelectedSkus(prev => ({
                                       ...prev,
                                       [skuGroup.name]: sku.id,
                                     }));
                                   }
                                 }}
                               >
                                 <TableCell className="text-sm py-2.5">
                                   {val}
                                 </TableCell>
                                 <TableCell className="text-sm py-2.5 text-right text-muted-foreground">
                                   <span className="text-emerald-600 text-xs">
                                     {lang === 'zh' ? '联系询价' : 'Contact for Price'}
                                   </span>
                                 </TableCell>
                               </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* 相关产品 */}
          {relatedProducts.length > 0 && (
            <section className="mb-8">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">
                    {t.product.related}
                  </h2>
                   <p className="text-sm text-muted-foreground mt-1">
                     {lang === 'zh'
                       ? '同分类其他产品推荐'
                       : 'Other products in the same category'}
                   </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary"
                  onClick={() => navigate(`/products/${product.category}`)}
                >
                  {t.home.viewAll}
                  <ChevronRight className="size-4 ml-1" />
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.slice(0, 4).map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>

        <InquiryDialog
          open={inquiryOpen}
          onOpenChange={setInquiryOpen}
          prefillProduct={`${productName}${matchedSku ? ` (${matchedSku.name[lang as 'zh' | 'en'] || matchedSku.name.en})` : ''}`}
        />
      </div>
    </TooltipProvider>
  );
}
