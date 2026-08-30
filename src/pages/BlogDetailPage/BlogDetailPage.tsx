import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Tag, ChevronRight, ChevronLeft, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from '@/components/ui/image';
import Seo from '@/components/Seo';
import { useLang, getText } from '@/context/LanguageContext';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { MOCK_BLOG_CATEGORIES, type IBlogPost } from '@/data/blog';
import { SITE_CONFIG } from '@/data/site';
import ShareButtons from '@/components/ShareButtons';

export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLang();
  const { posts, loaded, incrementView } = useBlogPosts();

  const post = useMemo(() => posts.find(p => p.id === id), [posts, id]);

  const { prevPost, nextPost, relatedPosts } = useMemo(() => {
    if (!post) return { prevPost: null as IBlogPost | null, nextPost: null as IBlogPost | null, relatedPosts: [] as IBlogPost[] };
    const sorted = [...posts].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    const idx = sorted.findIndex(p => p.id === post.id);
    const prev = idx > 0 ? sorted[idx - 1] : null;
    const next = idx < sorted.length - 1 ? sorted[idx + 1] : null;
    const related = sorted
      .filter(p => p.id !== post.id && p.category === post.category)
      .slice(0, 3);
    return { prevPost: prev, nextPost: next, relatedPosts: related };
  }, [posts, post]);

  useEffect(() => {
    if (post) incrementView(post.id);
    window.scrollTo(0, 0);
  }, [post?.id]);

  const catName = (catId: string) => MOCK_BLOG_CATEGORIES.find(c => c.id === catId)?.name[lang as 'zh' | 'en'] || catId;

  if (!loaded) return <div className="min-h-screen bg-background" />;

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {lang === 'zh' ? '文章不存在' : 'Article not found'}
          </h1>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="size-4 mr-2" />
            {lang === 'zh' ? '返回博客列表' : 'Back to blog list'}
          </Button>
        </div>
      </div>
    );
  }

  const title = post.title?.[lang as 'zh' | 'en'] || 'Untitled';
  const summary = post.summary?.[lang as 'zh' | 'en'] || '';
  const content = post.content?.[lang as 'zh' | 'en'] || '';

  // JSON-LD Article
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: summary,
    image: [post.coverImage],
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}/blog/${post.id}`,
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={title}
        description={summary}
        keywords={`${title}, ${catName(post.category)}, ${lang === 'zh' ? 'EV充电配件,电动汽车充电' : 'EV charging accessories, electric vehicle charging, wholesale EV charger'}`}
        image={post.coverImage}
        type="article"
        jsonLd={articleJsonLd}
      />

      <article className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* 返回按钮 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/blog')}
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4 mr-1.5" />
          {lang === 'zh' ? '返回博客' : 'Back to blog'}
        </Button>

        {/* 标题区 */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Badge variant="secondary" className="text-xs font-normal">{catName(post.category)}</Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {post.publishDate}
            </span>
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <User className="size-3.5" />
              {post.author}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground leading-tight tracking-tight">
            {title}
          </h1>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            {summary}
          </p>
        </header>

        {/* 封面图 */}
        <div className="aspect-[21/9] rounded-xl overflow-hidden mb-10 bg-muted">
          <Image src={post.coverImage} alt={title} className="w-full h-full object-cover" />
        </div>

        {/* 视频播放器 */}
        {post.videoUrl && (
          <div className="mb-10">
            <VideoPlayer url={post.videoUrl} type={post.videoType} title={title} />
          </div>
        )}

        {/* 正文 */}
        <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert">
          <BlogContent content={content} />
        </div>

        {/* 分享 */}
        <div className="flex items-center gap-3 mt-10 pt-6 border-t border-border/40 flex-wrap">
          <span className="text-sm text-muted-foreground shrink-0">{lang === 'zh' ? '分享文章' : 'Share article'}:</span>
          <ShareButtons
            url={`/blog/${id}`}
            title={title}
            description={summary}
            size="sm"
          />
        </div>

        {/* 上一篇/下一篇 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          {prevPost ? (
            <Button
              variant="outline"
              className="h-auto p-4 justify-start text-left flex-col items-start gap-1"
              onClick={() => navigate(`/blog/${prevPost.id}`)}
            >
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <ChevronLeft className="size-3" />
                {lang === 'zh' ? '上一篇' : 'Previous'}
              </span>
              <span className="text-sm font-medium line-clamp-1 w-full">
                {prevPost.title[lang as 'zh' | 'en']}
              </span>
            </Button>
          ) : <div />}
          {nextPost && (
            <Button
              variant="outline"
              className="h-auto p-4 justify-end text-right flex-col items-end gap-1"
              onClick={() => navigate(`/blog/${nextPost.id}`)}
            >
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                {lang === 'zh' ? '下一篇' : 'Next'}
                <ChevronRight className="size-3" />
              </span>
              <span className="text-sm font-medium line-clamp-1 w-full">
                {nextPost.title[lang as 'zh' | 'en']}
              </span>
            </Button>
          )}
        </div>
      </article>

      {/* 相关文章 */}
      {relatedPosts.length > 0 && (
        <section className="w-full bg-muted/30 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
              {lang === 'zh' ? '相关文章' : 'Related Articles'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(related => (
                <Card
                  key={related.id}
                  className="overflow-hidden cursor-pointer group hover:shadow-md transition-all border-border/40"
                  onClick={() => navigate(`/blog/${related.id}`)}
                >
                  <div className="aspect-[16/9] overflow-hidden bg-muted">
                    <Image
                      src={related.coverImage}
                      alt={related.title[lang as 'zh' | 'en']}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <Badge variant="secondary" className="text-xs font-normal">
                      {catName(related.category)}
                    </Badge>
                    <h3 className="text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {related.title[lang as 'zh' | 'en']}
                    </h3>
                    <p className="text-xs text-muted-foreground">{related.publishDate}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// 简单的 Markdown 解析：## 小标题 / - 列表 / \n\n 段落
function BlogContent({ content }: { content: string }) {
  const blocks = content.split('\n\n').filter(Boolean);

  return (
    <div className="space-y-5 text-foreground/90 leading-relaxed">
      {blocks.map((block, i) => {
        if (block.startsWith('## ')) {
          return (
            <h2 key={i} className="text-xl md:text-2xl font-bold text-foreground mt-8 mb-4">
              {block.replace(/^##\s+/, '')}
            </h2>
          );
        }
        if (block.startsWith('### ')) {
          return (
            <h3 key={i} className="text-lg md:text-xl font-semibold text-foreground mt-6 mb-3">
              {block.replace(/^###\s+/, '')}
            </h3>
          );
        }
        if (block.startsWith('- ') || block.split('\n').every(line => line.startsWith('- ') || line.startsWith('  '))) {
          const items = block.split('\n').filter(line => line.startsWith('- '));
          return (
            <ul key={i} className="list-disc pl-6 space-y-2">
              {items.map((item, j) => (
                <li key={j}>{item.replace(/^-\s+/, '')}</li>
              ))}
            </ul>
          );
        }
        if (/^\d+\.\s/.test(block.split('\n')[0] || '')) {
          const items = block.split('\n').filter(line => /^\d+\.\s/.test(line));
          return (
            <ol key={i} className="list-decimal pl-6 space-y-2">
              {items.map((item, j) => (
                <li key={j}>{item.replace(/^\d+\.\s+/, '')}</li>
              ))}
            </ol>
          );
        }
        return <p key={i}>{block}</p>;
      })}
    </div>
  );
}

// 视频播放器组件：支持 YouTube、Vimeo 和直接视频文件
function VideoPlayer({ url, type, title }: { url: string; type?: 'youtube' | 'vimeo' | 'file'; title: string }) {
  // 自动检测视频类型
  const detectedType = type || detectVideoType(url);

  if (detectedType === 'youtube') {
    const videoId = extractYouTubeId(url);
    if (!videoId) return <VideoFallback url={url} />;
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (detectedType === 'vimeo') {
    const videoId = extractVimeoId(url);
    if (!videoId) return <VideoFallback url={url} />;
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // 直接视频文件
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
      <video
        src={url}
        title={title}
        controls
        preload="metadata"
        className="absolute inset-0 w-full h-full object-contain"
      >
        {`您的浏览器不支持视频播放。`}
      </video>
    </div>
  );
}

// 检测视频类型
function detectVideoType(url: string): 'youtube' | 'vimeo' | 'file' {
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/vimeo\.com/.test(url)) return 'vimeo';
  return 'file';
}

// 从 YouTube URL 提取视频 ID
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// 从 Vimeo URL 提取视频 ID
function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

// 视频加载失败时的降级显示
function VideoFallback({ url }: { url: string }) {
  return (
    <div className="w-full aspect-video rounded-xl bg-muted flex flex-col items-center justify-center gap-3 p-6">
      <p className="text-sm text-muted-foreground text-center">
        视频无法自动解析，请点击下方链接观看：
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-primary hover:underline break-all text-center"
      >
        {url}
      </a>
    </div>
  );
}
