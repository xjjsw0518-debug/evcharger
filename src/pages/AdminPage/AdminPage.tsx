import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Package,
  FileText,
  HelpCircle,
  Upload,
  Settings,
  FolderTree,
  FileSpreadsheet,
  BarChart3,
  ArrowLeft,
  Menu,
  X,
  LogOut,
  Shield,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLang } from '@/context/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import ProductAdminSection from './ProductAdminSection';
import BlogAdminSection from './BlogAdminSection';
import FaqAdminSection from './FaqAdminSection';
import CsvImportSection from './CsvImportSection';
import LogoSettingsSection from './LogoSettingsSection';
import HeroSettingsSection from './HeroSettingsSection';
import VideoSettingsSection from './VideoSettingsSection';
import CategoryAdminSection from './CategoryAdminSection';
import AboutAdminSection from './AboutAdminSection';
import AnalyticsSection from './AnalyticsSection';
import FooterSettingsSection from './FooterSettingsSection';
import SecuritySettingsSection from './SecuritySettingsSection';
import ContactSettingsSection from './ContactSettingsSection';
import { isAdminLoggedIn, clearAdminSession, getAdminSession } from './AdminLoginPage';
import { toast } from 'sonner';
import FloatingContactButtons from '@/components/FloatingContactButtons';

type TabKey =
  | 'products'
  | 'categories'
  | 'blog'
  | 'faq'
  | 'csv'
  | 'logo'
  | 'hero'
  | 'video'
  | 'contact'
  | 'footer'
  | 'about'
  | 'analytics'
  | 'security';

const MENU_ITEMS: { key: TabKey; icon: typeof Package; labelZh: string; labelEn: string; group: 'content' | 'site' | 'data' | 'security' }[] = [
  // 内容管理
  { key: 'products', icon: Package, labelZh: '产品管理', labelEn: 'Products', group: 'content' },
  { key: 'categories', icon: FolderTree, labelZh: '分类管理', labelEn: 'Categories', group: 'content' },
  { key: 'blog', icon: FileText, labelZh: '博客管理', labelEn: 'Blog', group: 'content' },
  { key: 'faq', icon: HelpCircle, labelZh: 'FAQ管理', labelEn: 'FAQ', group: 'content' },
  // 站点设置
  { key: 'logo', icon: Settings, labelZh: 'Logo设置', labelEn: 'Logo Settings', group: 'site' },
  { key: 'hero', icon: Settings, labelZh: '首页Hero', labelEn: 'Hero Settings', group: 'site' },
  { key: 'video', icon: Settings, labelZh: '视频设置', labelEn: 'Video Settings', group: 'site' },
  { key: 'contact', icon: Phone, labelZh: '联系信息', labelEn: 'Contact Info', group: 'site' },
  { key: 'footer', icon: Settings, labelZh: '页脚设置', labelEn: 'Footer Settings', group: 'site' },
  { key: 'about', icon: FileSpreadsheet, labelZh: '关于页面', labelEn: 'About Page', group: 'site' },
  // 数据
  { key: 'csv', icon: Upload, labelZh: 'CSV导入', labelEn: 'CSV Import', group: 'data' },
  { key: 'analytics', icon: BarChart3, labelZh: '数据分析', labelEn: 'Analytics', group: 'data' },
  // 安全
  { key: 'security', icon: Shield, labelZh: '安全设置', labelEn: 'Security', group: 'security' },
];

const GROUP_LABELS: Record<string, { zh: string; en: string }> = {
  content: { zh: '内容管理', en: 'Content' },
  site: { zh: '站点设置', en: 'Site Settings' },
  data: { zh: '数据工具', en: 'Data Tools' },
  security: { zh: '安全中心', en: 'Security' },
};

export default function AdminPage() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const { settings, loaded, syncing, syncError } = useSiteSettings();
  const [activeTab, setActiveTab] = useState<TabKey>('products');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Auth check
  useEffect(() => {
    if (!loaded) return;
    if (!isAdminLoggedIn()) {
      // Redirect to login page
      navigate(`/XUEJIAN-manage/login`, { replace: true });
    } else {
      setCheckingAuth(false);
    }
  }, [loaded, navigate]);

  useEffect(() => {
    document.title = 'Admin Panel - youpei auto';
    return () => {
      document.title = 'youpei auto - Wholesale EV Charging Accessories';
    };
  }, []);

  const handleLogout = () => {
    clearAdminSession();
    toast.success('已退出登录');
    navigate(`/XUEJIAN-manage/login`, { replace: true });
  };

  const handleTabClick = (key: TabKey) => {
    setActiveTab(key);
    setMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'products': return <ProductAdminSection />;
      case 'categories': return <CategoryAdminSection />;
      case 'blog': return <BlogAdminSection />;
      case 'faq': return <FaqAdminSection />;
      case 'csv': return <CsvImportSection />;
      case 'logo': return <LogoSettingsSection />;
      case 'hero': return <HeroSettingsSection />;
      case 'video': return <VideoSettingsSection />;
      case 'footer': return <FooterSettingsSection />;
      case 'contact': return <ContactSettingsSection />;
      case 'about': return <AboutAdminSection />;
      case 'analytics': return <AnalyticsSection />;
      case 'security': return <SecuritySettingsSection />;
      default: return <ProductAdminSection />;
    }
  };

  const groupedMenu = MENU_ITEMS.reduce<Record<string, typeof MENU_ITEMS>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  if (checkingAuth || !loaded) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const session = getAdminSession();

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="flex items-center justify-between h-14 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-1.5 text-muted-foreground"
            >
              <ArrowLeft className="size-4" />
              {lang === 'zh' ? '返回前台' : 'Back to Site'}
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-base md:text-lg font-semibold text-foreground">
              {lang === 'zh' ? '管理后台' : 'Admin Dashboard'}
            </h1>
            {/* 全局同步状态指示器 */}
            <div className="flex items-center gap-1.5 text-xs">
              {syncing ? (
                <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                  <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                  {lang === 'zh' ? '同步中...' : 'Syncing...'}
                </span>
              ) : syncError ? (
                <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full" title={syncError}>
                  <span className="size-1.5 rounded-full bg-red-500" />
                  {lang === 'zh' ? '同步失败' : 'Sync Failed'}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  {lang === 'zh' ? '已同步到服务器' : 'Synced to Server'}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-muted-foreground">
              {session?.username || 'Admin'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5 text-muted-foreground hover:text-destructive"
              aria-label="Logout"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">
                {lang === 'zh' ? '退出' : 'Logout'}
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - desktop */}
        <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-border/40 bg-card/50 min-h-[calc(100vh-3.5rem)]">
          <nav className="flex flex-col gap-1 p-3">
            {Object.entries(groupedMenu).map(([group, items]) => (
              <div key={group} className="mt-2 first:mt-0">
                <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {GROUP_LABELS[group][lang as 'zh' | 'en']}
                </div>
                {items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleTabClick(item.key)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      }`}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span>{lang === 'zh' ? item.labelZh : item.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-30 top-14">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
            <aside className="absolute left-0 top-0 w-60 h-full bg-card border-r border-border/40 overflow-y-auto">
              <nav className="flex flex-col gap-1 p-3">
                {Object.entries(groupedMenu).map(([group, items]) => (
                  <div key={group} className="mt-2 first:mt-0">
                    <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {GROUP_LABELS[group][lang as 'zh' | 'en']}
                    </div>
                    {items.map(item => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.key;
                      return (
                        <button
                          key={item.key}
                          onClick={() => handleTabClick(item.key)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm ${
                            isActive
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                          }`}
                        >
                          <Icon className="size-4 shrink-0" />
                          <span>{lang === 'zh' ? item.labelZh : item.labelEn}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 p-4 md:p-6">
          {renderContent()}
        </main>
      </div>
      <FloatingContactButtons />
    </div>
  );
}
