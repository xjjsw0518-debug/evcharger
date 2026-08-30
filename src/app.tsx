import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import HomePage from "@/pages/HomePage/HomePage";
import ProductListPage from "@/pages/ProductListPage/ProductListPage";
import ProductDetailPage from "@/pages/ProductDetailPage/ProductDetailPage";
import AboutPage from "@/pages/AboutPage/AboutPage";
import ContactPage from "@/pages/ContactPage/ContactPage";
import AdminPage from "@/pages/AdminPage/AdminPage";
import AdminLoginPage from "@/pages/AdminPage/AdminLoginPage";
import BlogListPage from "@/pages/BlogListPage/BlogListPage";
import BlogDetailPage from "@/pages/BlogDetailPage/BlogDetailPage";
import FaqPage from "@/pages/FaqPage/FaqPage";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/context/LanguageContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";



export default function App() {
  const { settings, loaded } = useSiteSettings();
  const adminPath = settings.adminPath || 'XUEJIAN-manage';

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
    <LanguageProvider>
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
        <Route path={`${adminPath}/login`} element={<AdminLoginPage />} />
        <Route path={adminPath} element={<AdminPage />} />

        {/* Old /admin path redirects to home */}
        <Route path="admin/*" element={<Navigate to="/" replace />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster position="top-right" />
    </LanguageProvider>
  );
}
