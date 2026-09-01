import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import ErrorBoundary from "@/components/ErrorBoundary";
import HomePage from "@/pages/HomePage/HomePage";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/context/LanguageContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";

// 懒加载非首屏页面，优化首屏加载速度
const ProductListPage = lazy(() => import("@/pages/ProductListPage/ProductListPage"));
const ProductDetailPage = lazy(() => import("@/pages/ProductDetailPage/ProductDetailPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage/AboutPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage/ContactPage"));
const AdminPage = lazy(() => import("@/pages/AdminPage/AdminPage"));
const AdminLoginPage = lazy(() => import("@/pages/AdminPage/AdminLoginPage"));
const BlogListPage = lazy(() => import("@/pages/BlogListPage/BlogListPage"));
const BlogDetailPage = lazy(() => import("@/pages/BlogDetailPage/BlogDetailPage"));
const FaqPage = lazy(() => import("@/pages/FaqPage/FaqPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage/NotFoundPage"));

// 页面加载时的占位组件
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <div className="text-sm text-muted-foreground">Loading...</div>
    </div>
  </div>
);



// 固定的后台管理路径（避免动态路由导致重定向问题）
const ADMIN_PATH = '/XUEJIAN-manage';

export default function App() {
  const { loaded } = useSiteSettings();

  if (!loaded) {
    return (
      <LanguageProvider>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
        <Toaster position="top-right" />
      </LanguageProvider>
    );
  }

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="products/:category?" element={<ProductListPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="blog" element={<BlogListPage />} />
              <Route path="blog/:id" element={<BlogDetailPage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route path="contact" element={<ContactPage />} />
            </Route>

            {/* Admin routes - outside Layout, have their own chrome */}
            <Route path={`${ADMIN_PATH}/login`} element={<AdminLoginPage />} />
            <Route path={ADMIN_PATH} element={<AdminPage />} />

            {/* Old /admin path redirects to home */}
            <Route path="admin/*" element={<Navigate to="/" replace />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </LanguageProvider>
    </ErrorBoundary>
  );
}
