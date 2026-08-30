import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingContactButtons from '@/components/FloatingContactButtons';
import { LanguageProvider } from '@/context/LanguageContext';
import { useAnalytics } from '@/hooks/useAnalytics';

function AnalyticsTracker() {
  const location = useLocation();
  const { trackPageView, trackCountry } = useAnalytics();

  // 页面访问埋点
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

  // 国家检测（首次进入时）
  useEffect(() => {
    trackCountry();
  }, [trackCountry]);

  return null;
}

export function Layout() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <FloatingContactButtons />
        <AnalyticsTracker />
      </div>
    </LanguageProvider>
  );
}
