import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useLang, getText } from '@/context/LanguageContext';
import { LANG_META, type Lang } from '@/i18n/translations';
import { MOCK_CATEGORIES } from '@/data/categories';
import { SITE_CONFIG } from '@/data/site';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { key: 'home',     path: '/' },
  { key: 'products', path: '/products' },
  { key: 'blog',     path: '/blog' },
  { key: 'about',    path: '/about' },
  { key: 'faq',      path: '/faq' },
  { key: 'contact',  path: '/contact' },
];

export default function Header() {
  const { t, lang, setLang, isAutoDetected, resetToAuto, format } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 路由变化时关闭移动菜单
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const kw = search.trim();
    if (kw) {
      navigate(`/products?keyword=${encodeURIComponent(kw)}`);
    }
  };

  const langList = Object.entries(LANG_META) as [Lang, typeof LANG_META[Lang]][];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-border/40 shadow-sm">
      {/* Wholesale Only 横幅 */}
      <div className="w-full bg-primary text-primary-foreground text-xs font-medium py-1.5 text-center tracking-wide">
        {SITE_CONFIG.wholesaleBanner[lang as 'zh' | 'en']}
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex h-24 items-center justify-between gap-3">
          {/* 左侧：Logo */}
          <NavLink to="/" className="flex items-center shrink-0">
            <Logo size="md" />
          </NavLink>

          {/* 中间：桌面导航 + 搜索 */}
          <nav className="hidden lg:flex items-center gap-6 ml-8">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors',
                    isActive
                      ? 'text-primary'
                      : 'text-foreground/80 hover:text-foreground'
                  )
                }
              >
                {t.nav[item.key as keyof typeof t.nav] as string}
              </NavLink>
            ))}
          </nav>

          {/* 右侧：搜索框 + 语言切换 + 移动端菜单 */}
          <div className="flex items-center gap-2 md:gap-3 ml-auto">
            {/* 搜索框（桌面） */}
            <form onSubmit={handleSearch} className="hidden md:block relative w-56 lg:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t.nav.search}
                className="pl-9 h-9 text-sm bg-muted/40 border-border/50 focus-visible:ring-primary"
              />
            </form>

            {/* 语言切换 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 h-9 px-2.5 text-foreground/80"
                  aria-label="Language"
                >
                  <Globe className="size-4" />
                  <span className="hidden sm:inline text-xs font-medium">
                    {LANG_META[lang]?.flag} {LANG_META[lang]?.name}
                  </span>
                  <span className="sm:hidden text-xs">{LANG_META[lang]?.flag}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 max-h-80 overflow-y-auto">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  {t.langSwitcher.title}
                  {isAutoDetected && (
                    <span className="ml-2 text-[10px] text-primary font-normal">
                      ({t.langSwitcher.autoDetected ? 'Auto' : ''})
                    </span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {langList.map(([code, meta]) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => setLang(code)}
                    className={cn(
                      'flex items-center gap-2 cursor-pointer text-sm',
                      lang === code && 'bg-accent text-accent-foreground font-medium'
                    )}
                  >
                    <span>{meta.flag}</span>
                    <span className="flex-1">{meta.name}</span>
                    {lang === code && <span className="text-primary">✓</span>}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                {!isAutoDetected && (
                  <DropdownMenuItem
                    onClick={resetToAuto}
                    className="cursor-pointer text-xs text-muted-foreground justify-center"
                  >
                    ↻ {t.langSwitcher.resetAuto}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 移动端菜单按钮 */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-sm">
                <SheetHeader className="pb-4">
                  <SheetTitle className="flex items-center">
                    <Logo size="sm" />
                  </SheetTitle>
                </SheetHeader>

                {/* 移动端搜索 */}
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder={t.nav.search}
                      className="pl-9"
                    />
                  </div>
                </form>

                {/* 导航 */}
                <nav className="flex flex-col gap-1">
                  {NAV_ITEMS.map(item => (
                    <SheetClose asChild key={item.path}>
                      <NavLink
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) =>
                          cn(
                            'px-3 py-2.5 rounded-lg text-base font-medium transition-colors',
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-foreground hover:bg-muted'
                          )
                        }
                      >
                        {t.nav[item.key as keyof typeof t.nav] as string}
                      </NavLink>
                    </SheetClose>
                  ))}
                </nav>

                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-6 justify-start text-muted-foreground text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    <X className="size-4 mr-2" />
                    {t.common.back}
                  </Button>
                </SheetClose>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
