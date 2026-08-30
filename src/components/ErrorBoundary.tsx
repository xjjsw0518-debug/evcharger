import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * 全局错误边界组件
 * 捕获 React 渲染异常，避免页面白屏或返回 500 错误
 * 对 SEO 友好：爬虫访问时即使前端报错也能返回正常 HTML 结构
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 生产环境可以上报到错误监控服务
    console.error('[ErrorBoundary] 捕获到异常:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // 降级 UI：即使报错也返回正常的 HTML 结构，有利于 SEO 爬虫抓取
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="size-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="size-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-foreground">页面加载遇到问题</h1>
            <p className="text-sm text-muted-foreground">
              抱歉，页面加载时出现了一些问题。您可以尝试刷新页面，或返回首页继续浏览。
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                重试
              </button>
              <a
                href="/"
                className="px-4 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
              >
                返回首页
              </a>
            </div>
            {/* 对 SEO 友好的隐藏内容：确保页面有正常的文本结构 */}
            <div className="sr-only">
              <h2>Wholesale EV Charging Accessories</h2>
              <p>
                youpei auto - China factory direct wholesale supplier of EV charging accessories including GBT charging guns, Type 2 adapters, portable EV chargers, V2L discharge adapters, cables and sockets. MOQ 2-5 pcs, CE certified, global shipping.
              </p>
              <nav>
                <a href="/">Home</a>
                <a href="/products">Products</a>
                <a href="/blog">Blog</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
              </nav>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
