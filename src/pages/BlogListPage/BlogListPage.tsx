import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, User, Tag, ChevronRight, ChevronLeft, Play } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Image from '@/components/ui/image';
import Seo from '@/components/Seo';
import { useLang, getText } from '@/context/LanguageContext';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { MOCK_BLOG_CATEGORIES } from '@/data/blog';
import type { IBlogPost } from '@/data/blog';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 6;

export default function BlogListPage() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const { publishedPosts, loaded } = useBlogPosts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = [...publishedPosts];
    if (category !== 'all') list = list.filter(p => p.category === category);
    if (search.trim()) {
      const kw = search.trim().toLowerCase();
      list = list.filter(p =>
        p.title.zh.toLowerCase().includes(kw) ||
        p.title.en.toLowerCase().includes(kw) ||
        p.summary.zh.toLowerCase().includes(kw) ||
        p.summary.en.toLowerCase().includes(kw)
      );
    }
    return list.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }, [publishedPosts, search, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagePosts = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const catName = (id: string) => MOCK_BLOG_CATEGORIES.find(c => c.id === id)?.name[lang as 'zh' | 'en'] || id;

  const seoTitle = lang === 'zh' ? '博客 - 汽配行业资讯与产品指南' : 'Blog - Auto Parts Industry News & Product Guides';
  const seoDesc = lang === 'zh'
    ? 'youpei auto 博客，分享汽配行业资讯、产品选购指南、安装保养知识、外贸干货等内容。'
    : 'youpei auto blog — sharing auto parts industry news, product buying guides, installation & maintenance tips, and foreign trade insights.';
  const seoKeywords = lang === 'zh'
    ? '汽配博客,汽车配件资讯,产品指南,安装教程,保养知识,外贸干货'
    : 'auto parts blog, auto parts news, product guide, installation tutorial, maintenance tips, trade tips';

  if (!loaded) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background">
      <Seo title={seoTitle} description={seoDesc} keywords={seoKeywords} />

      {/* Hero */}
      <section className="w-full bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
            {lang === 'zh' ? '博客中心' : 'Blog Center'}
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {lang === 'zh'
              ? '行业资讯 · 产品指南 · 安装教程 · 保养知识 · 外贸干货'
              : 'Industry News · Product Guides · Installation Tutorials · Maintenance Tips · Trade Insights'}
          </p>
        </div>
      </section>

      <section className="w-full py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={category === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setCategory('all'); setPage(1); }}
              className="rounded-full"
            >
              {lang === 'zh' ? '全部' : 'All'}
            </Button>
            {MOCK_BLOG_CATEGORIES.sort((a, b) => a.order - b.order).map(cat => (
              <Button
                key={cat.id}
                variant={category === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setCategory(cat.id); setPage(1); }}
                className="rounded-full"
              >
                {getText(lang, cat.name)}
              </Button>
            ))}
          </div>

          {/* 搜索框 */}
          <div className="relative max-w-md mb-8">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder={lang === 'zh' ? '搜索文章...' : 'Search articles...'}
              className="pl-9"
            />
          </div>

          {/* 文章卡片网格 */}
          {pagePosts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              {lang === 'zh' ? '暂无相关文章' : 'No articles found'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pagePosts.map(post => (
                <BlogCard key={post.id} post={post} catName={catName(post.category)} lang={lang} onClick={() => navigate(`/blog/${post.id}`)} />
              ))}
            </div>
          )}

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                aria-label="Previous"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Button
                    key={p}
                    variant={currentPage === p ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(p)}
                    className="w-9 h-9 p-0"
                  >
                    {p}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                aria-label="Next"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function BlogCard({ post, catName, lang, onClick }: { post: IBlogPost; catName: string; lang: string; onClick: () => void }) {
  const title = post.title[lang as 'zh' | 'en'];
  const summary = post.summary[lang as 'zh' | 'en'];
  const summaryTruncated = summary.length > 100 ? summary.slice(0, 100) + '...' : summary;

  return (
    <Card
      className="overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 border-border/40"
      onClick={onClick}
    >
      <div className="aspect-[16/9] overflow-hidden bg-muted relative">
        <Image
          src={post.coverImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* 视频标识 */}
        {post.videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="size-6 text-primary fill-primary ml-0.5" />
            </div>
            <span className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/60 text-white text-xs font-medium flex items-center gap-1">
              <Play className="size-3 fill-white" />
              {lang === 'zh' ? '视频' : 'Video'}
            </span>
          </div>
        )}
      </div>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs font-normal">{catName}</Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="size-3" />
            {post.publishDate}
          </span>
        </div>
        <h3 className="text-base md:text-lg font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {summaryTruncated}
        </p>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="size-3" />
            <span>{post.author}</span>
          </div>
          <span className="text-xs text-primary font-medium flex items-center gap-0.5 group-hover:gap-1 transition-all">
            {lang === 'zh' ? '阅读更多' : 'Read more'}
            <ChevronRight className="size-3" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
