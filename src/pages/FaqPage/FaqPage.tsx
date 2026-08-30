import { useState, useMemo } from 'react';
import { Search, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Seo from '@/components/Seo';
import { useLang, getText } from '@/context/LanguageContext';
import { useFaqs } from '@/hooks/useFaqs';
import { useContactSettings } from '@/hooks/useContactSettings';
import { MOCK_FAQ_CATEGORIES } from '@/data/faq';

export default function FaqPage() {
  const { lang } = useLang();
  const { faqs, loaded } = useFaqs();
  const { getWaUrl, loaded: contactLoaded } = useContactSettings();
  const [search, setSearch] = useState('');

  const { grouped, defaultOpen } = useMemo(() => {
    let list = faqs;
    if (search.trim()) {
      const kw = search.trim().toLowerCase();
      list = list.filter(f =>
        f.question.zh.toLowerCase().includes(kw) ||
        f.question.en.toLowerCase().includes(kw) ||
        f.answer.zh.toLowerCase().includes(kw) ||
        f.answer.en.toLowerCase().includes(kw)
      );
    }
    const sorted = [...list].sort((a, b) => a.order - b.order);
    const groups: Record<string, typeof sorted> = {};
    for (const f of sorted) {
      if (!groups[f.category]) groups[f.category] = [];
      groups[f.category].push(f);
    }
    // 默认展开第一个
    const firstCat = Object.keys(groups)[0];
    const firstItem = firstCat && groups[firstCat]?.[0];
    return { grouped: groups, defaultOpen: firstItem ? `item-${firstItem.id}` : undefined };
  }, [faqs, search]);

  const sortedCats = [...MOCK_FAQ_CATEGORIES].sort((a, b) => a.order - b.order);

  const seoTitle = lang === 'zh' ? '常见问题 FAQ - youpei auto' : 'FAQ - youpei auto';
  const seoDesc = lang === 'zh'
    ? '关于下单付款、物流配送、产品质量、售后退换、合作代理等常见问题的解答。'
    : 'Answers to frequently asked questions about ordering, shipping, product quality, returns, and cooperation.';
  const seoKeywords = lang === 'zh'
    ? '汽配常见问题,FAQ,付款方式,物流配送,售后服务,代理合作'
    : 'auto parts FAQ, payment methods, shipping, after-sales service, distributor';

  // FAQPage JSON-LD
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question[lang as 'zh' | 'en'],
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer[lang as 'zh' | 'en'].replace(/\n/g, '<br/>'),
      },
    })),
  };

  if (!loaded) return <div className="min-h-screen bg-background" />;

  const totalFaqs = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <Seo title={seoTitle} description={seoDesc} keywords={seoKeywords} jsonLd={faqJsonLd} />

      {/* Hero */}
      <section className="w-full bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <HelpCircle className="size-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
            {lang === 'zh' ? '常见问题' : 'Frequently Asked Questions'}
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {lang === 'zh'
              ? '在这里您可以找到关于产品、订单、物流、售后等常见问题的解答'
              : 'Find answers to common questions about products, orders, shipping, and after-sales service'}
          </p>

          {/* 搜索框 */}
          <div className="relative max-w-lg mx-auto mt-8">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={lang === 'zh' ? '搜索问题...' : 'Search questions...'}
              className="pl-12 h-12 text-base rounded-xl"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          {totalFaqs === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              {lang === 'zh' ? '没有找到相关问题' : 'No matching questions found'}
            </div>
          ) : (
            <div className="space-y-10">
              {sortedCats.map(cat => {
                const catFaqs = grouped[cat.id];
                if (!catFaqs || catFaqs.length === 0) return null;
                return (
                  <div key={cat.id} id={cat.id}>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full" />
                      {getText(lang, cat.name)}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        ({catFaqs.length})
                      </span>
                    </h2>
                    <Accordion
                      type="single"
                      collapsible
                      defaultValue={cat.order === 1 && !search && defaultOpen?.endsWith(catFaqs[0].id) ? defaultOpen : undefined}
                      className="space-y-3"
                    >
                      {catFaqs.map((faq, idx) => (
                        <AccordionItem
                          key={faq.id}
                          value={`item-${faq.id}`}
                          className="border border-border/50 rounded-lg px-4 md:px-5 bg-card data-[state=open]:shadow-sm transition-shadow"
                        >
                          <AccordionTrigger className="text-left hover:no-underline py-4 md:py-5">
                            <span className="text-sm md:text-base font-medium text-foreground pr-4">
                              {faq.question[lang as 'zh' | 'en']}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5 whitespace-pre-line">
                            {faq.answer[lang as 'zh' | 'en']}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                );
              })}
            </div>
          )}

          {/* 底部 CTA */}
          <div className="mt-16 p-6 md:p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl text-center">
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
              {lang === 'zh' ? '没找到您的问题？' : "Can't find your question?"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {lang === 'zh'
                ? '欢迎联系我们的客服团队，我们将在24小时内回复您'
                : 'Contact our customer service team and we will reply within 24 hours'}
            </p>
            <a
              href={getWaUrl("Hi, I'm interested in your auto parts")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              {lang === 'zh' ? '联系客服' : 'Contact us'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
