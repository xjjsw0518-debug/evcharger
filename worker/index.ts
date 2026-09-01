/**
 * Cloudflare Workers 后端入口
 * 处理 API 路由（读取/保存网站设置）和静态资源
 * 
 * 架构：
 * - GET  /api/settings         - 读取网站设置（无需认证）
 * - POST /api/settings         - 保存网站设置（需要管理员密码）
 * - GET  /api/contact-settings - 读取联系信息设置（无需认证）
 * - POST /api/contact-settings - 保存联系信息设置（需要管理员密码）
 * - 其他路径                    - 由 Cloudflare Assets 处理静态资源
 */

export interface Env {
  SITE_SETTINGS?: KVNamespace;
  ASSETS?: Fetcher;
}

// 默认网站设置（与前端 useSiteSettings.ts 中的默认设置保持一致）
const DEFAULT_SITE_SETTINGS = {
  logoUrl: '',
  brandName: 'YiLianPu auto',
  brandSubtitle: 'EV Charging Specialist',
  heroBgUrl: 'https://aka.doubaocdn.com/s/1miAfPPz6y',
  heroTitleZh: 'EV 充电配件批发\n中国工厂直供',
  heroTitleEn: 'Wholesale EV Charging Accessories\nDirect from China Factory',
  heroSubtitleZh: 'GBT/Type 2 充电枪、转接器、便携式充电桩、V2L 放电器，MOQ 2-5 件起批，全球发货',
  heroSubtitleEn: 'GBT/Type 2 charging guns, adapters, portable chargers, V2L adapters. MOQ 2-5 pcs, global shipping.',
  heroAlign: 'left' as const,
  heroVerticalOffset: 50,
  heroButtonGap: 12,
  videoUrl: '',
  videoCoverUrl: '',
  videoEnabled: true,
  aboutPageEnabled: true,
  footerCompanyName: 'YiLianPu auto',
  footerCompanyDescZh: '电动汽车充电配件批发供应商 - 工厂直供，全球发货',
  footerCompanyDescEn: 'Wholesale EV Charging Accessories Supplier - Factory Direct, Global Shipping',
  footerEmail: 'sales@youpei-auto.com',
  footerPhone: '+86-138-0000-0000',
  footerWhatsapp: '+86-138-0000-0000',
  footerAddressZh: '中国广东省广州市白云区汽配城',
  footerAddressEn: 'Auto Parts City, Baiyun District, Guangzhou, Guangdong, China',
  footerQuickLinks: [
    { id: 'q1', labelZh: '首页', labelEn: 'Home', url: '/' },
    { id: 'q2', labelZh: '全部产品', labelEn: 'All Products', url: '/products' },
    { id: 'q3', labelZh: '关于我们', labelEn: 'About Us', url: '/about' },
    { id: 'q4', labelZh: '博客', labelEn: 'Blog', url: '/blog' },
    { id: 'q5', labelZh: '常见问题', labelEn: 'FAQ', url: '/faq' },
    { id: 'q6', labelZh: '联系我们', labelEn: 'Contact Us', url: '/contact' },
  ],
  footerSocials: [
    { id: 's1', platform: 'facebook', url: 'https://facebook.com/youpeiauto' },
    { id: 's2', platform: 'instagram', url: 'https://instagram.com/youpei_auto' },
    { id: 's3', platform: 'tiktok', url: 'https://tiktok.com/@youpeiauto' },
    { id: 's4', platform: 'linkedin', url: 'https://linkedin.com/company/youpei-auto' },
    { id: 's5', platform: 'youtube', url: 'https://youtube.com/@youpeiauto' },
  ],
  footerCopyrightZh: '© {year} YiLianPu auto. 保留所有权利。',
  footerCopyrightEn: '© {year} YiLianPu auto. All rights reserved.',
  footerCtaTitleZh: '获取最新报价',
  footerCtaTitleEn: 'Get Latest Quotes',
  footerCtaDescZh: '发送您的需求，我们将在24小时内为您提供详细报价。',
  footerCtaDescEn: 'Send us your requirements and get a detailed quote within 24 hours.',
  adminPath: 'XUEJIAN-manage',
  adminUsername: 'XUEJIAN',
  adminPassword: 'XueJian0812511',
};

// 默认联系信息设置（与前端 useContactSettings.ts 中的默认设置保持一致）
const DEFAULT_CONTACT_SETTINGS = {
  whatsapp: '+86-138-0000-0000',
  wechatQrUrl: 'https://picsum.photos/seed/wechat-qr-code/300/300',
  wechatId: 'youpei_auto',
  email: 'sales@youpei-auto.com',
  addressZh: '中国广东省广州市白云区汽配城',
  addressEn: 'Auto Parts City, Baiyun District, Guangzhou, Guangdong, China',
};

// CORS 响应头
const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// 默认 HTML 页面（当 ASSETS 不可用时返回）
const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YiLianPu auto - EV Charging Accessories</title>
</head>
<body style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5;">
  <div style="text-align: center; padding: 40px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h1 style="color: #333;">YiLianPu auto</h1>
    <p style="color: #666;">EV Charging Accessories Wholesale</p>
    <p style="color: #999; font-size: 14px; margin-top: 20px;">Website is loading... Please refresh.</p>
  </div>
</body>
</html>`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      const path = url.pathname;

      // 调试端点：查看环境变量
      if (path === '/debug') {
        return jsonResponse({
          hasAssets: !!env.ASSETS,
          assetsType: typeof env.ASSETS,
          hasAssetsFetch: !!(env.ASSETS && typeof env.ASSETS.fetch === 'function'),
          hasKV: !!env.SITE_SETTINGS,
          kvType: typeof env.SITE_SETTINGS,
          path: path,
          url: url.toString(),
        });
      }

      // API 路由
      if (path.startsWith('/api/')) {
        return await handleApiRequest(request, env, path);
      }

      // 静态资源（由 Cloudflare Assets 处理）
      if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
        try {
          const response = await env.ASSETS.fetch(request);
          // 如果静态资源返回 404 且不是文件请求，返回 index.html（SPA 支持）
          if (response.status === 404 && !path.includes('.')) {
            const indexRequest = new Request(url.origin + '/index.html', request);
            return await env.ASSETS.fetch(indexRequest);
          }
          return response;
        } catch (assetError) {
          console.error('ASSETS fetch error:', assetError);
          // 如果 ASSETS 出错，返回默认 HTML
          return new Response(DEFAULT_HTML, {
            status: 200,
            headers: { 'Content-Type': 'text/html' },
          });
        }
      }

      console.error('ASSETS not available. env keys:', Object.keys(env));
      
      // 如果没有 ASSETS，返回默认 HTML
      return new Response(DEFAULT_HTML, {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      });
    } catch (error) {
      console.error('Worker fetch error:', error);
      // 全局错误处理，避免抛出异常导致 Error 1101
      return new Response(DEFAULT_HTML, {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      });
    }
  },
};

/**
 * 处理 API 请求
 */
async function handleApiRequest(request: Request, env: Env, path: string): Promise<Response> {
  // OPTIONS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    // GET /api/settings - 读取网站设置（无需认证）
    if (path === '/api/settings' && request.method === 'GET') {
      let settings = DEFAULT_SITE_SETTINGS;
      if (env.SITE_SETTINGS && typeof env.SITE_SETTINGS.get === 'function') {
        try {
          const stored = await env.SITE_SETTINGS.get('site_settings', 'json');
          if (stored) {
            settings = { ...DEFAULT_SITE_SETTINGS, ...stored };
          }
        } catch (kvError) {
          console.error('KV get error:', kvError);
        }
      }
      return jsonResponse({ success: true, data: settings });
    }

    // POST /api/settings - 保存网站设置（需要管理员认证）
    if (path === '/api/settings' && request.method === 'POST') {
      const authResult = await verifyAdmin(request, env);
      if (!authResult.success) {
        return jsonResponse(authResult, 401);
      }

      const body = await request.json();
      // 合并默认设置，确保新增字段有默认值
      const mergedSettings = { ...DEFAULT_SITE_SETTINGS, ...body };
      
      if (env.SITE_SETTINGS && typeof env.SITE_SETTINGS.put === 'function') {
        try {
          await env.SITE_SETTINGS.put('site_settings', JSON.stringify(mergedSettings));
        } catch (kvError) {
          console.error('KV put error:', kvError);
          return jsonResponse({ success: false, error: 'Failed to save to KV storage' }, 500);
        }
      } else {
        return jsonResponse({ success: false, error: 'KV storage not configured' }, 500);
      }
      
      return jsonResponse({ success: true, message: 'Site settings saved successfully' });
    }

    // GET /api/contact-settings - 读取联系信息设置（无需认证）
    if (path === '/api/contact-settings' && request.method === 'GET') {
      let settings = DEFAULT_CONTACT_SETTINGS;
      if (env.SITE_SETTINGS && typeof env.SITE_SETTINGS.get === 'function') {
        try {
          const stored = await env.SITE_SETTINGS.get('contact_settings', 'json');
          if (stored) {
            settings = { ...DEFAULT_CONTACT_SETTINGS, ...stored };
          }
        } catch (kvError) {
          console.error('KV get error:', kvError);
        }
      }
      return jsonResponse({ success: true, data: settings });
    }

    // POST /api/contact-settings - 保存联系信息设置（需要管理员认证）
    if (path === '/api/contact-settings' && request.method === 'POST') {
      const authResult = await verifyAdmin(request, env);
      if (!authResult.success) {
        return jsonResponse(authResult, 401);
      }

      const body = await request.json();
      // 合并默认设置，确保新增字段有默认值
      const mergedSettings = { ...DEFAULT_CONTACT_SETTINGS, ...body };
      
      if (env.SITE_SETTINGS && typeof env.SITE_SETTINGS.put === 'function') {
        try {
          await env.SITE_SETTINGS.put('contact_settings', JSON.stringify(mergedSettings));
        } catch (kvError) {
          console.error('KV put error:', kvError);
          return jsonResponse({ success: false, error: 'Failed to save to KV storage' }, 500);
        }
      } else {
        return jsonResponse({ success: false, error: 'KV storage not configured' }, 500);
      }
      
      return jsonResponse({ success: true, message: 'Contact settings saved successfully' });
    }

    // 通用内容管理 API
    // GET /api/content/:type - 读取指定类型的内容（无需认证）
    // POST /api/content/:type - 保存指定类型的内容（需要管理员认证）
    const contentMatch = path.match(/^\/api\/content\/([a-z-]+)$/);
    if (contentMatch) {
      const contentType = contentMatch[1];
      const validTypes = ['products', 'categories', 'blog', 'faq', 'about', 'videos'];
      
      if (!validTypes.includes(contentType)) {
        return jsonResponse({ success: false, error: `Invalid content type: ${contentType}. Valid types: ${validTypes.join(', ')}` }, 400);
      }

      if (request.method === 'GET') {
        let data: unknown = null;
        if (env.SITE_SETTINGS && typeof env.SITE_SETTINGS.get === 'function') {
          try {
            const stored = await env.SITE_SETTINGS.get(`content_${contentType}`, 'json');
            if (stored) {
              data = stored;
            }
          } catch (kvError) {
            console.error(`KV get error for content_${contentType}:`, kvError);
          }
        }
        return jsonResponse({ success: true, data: data, type: contentType });
      }

      if (request.method === 'POST') {
        const authResult = await verifyAdmin(request, env);
        if (!authResult.success) {
          return jsonResponse(authResult, 401);
        }

        const body = await request.json();
        
        if (env.SITE_SETTINGS && typeof env.SITE_SETTINGS.put === 'function') {
          try {
            await env.SITE_SETTINGS.put(`content_${contentType}`, JSON.stringify(body));
          } catch (kvError) {
            console.error(`KV put error for content_${contentType}:`, kvError);
            return jsonResponse({ success: false, error: 'Failed to save to KV storage' }, 500);
          }
        } else {
          return jsonResponse({ success: false, error: 'KV storage not configured' }, 500);
        }
        
        return jsonResponse({ success: true, message: `${contentType} saved successfully`, type: contentType });
      }
    }

    // 404 - API 端点不存在
    return jsonResponse({ success: false, error: 'API endpoint not found' }, 404);
  } catch (error) {
    console.error('API Error:', error);
    return jsonResponse({ success: false, error: String(error) }, 500);
  }
}

/**
 * 验证管理员身份
 * 从 KV 中读取当前的管理员密码，与请求中的 Bearer Token 比较
 */
async function verifyAdmin(request: Request, env: Env): Promise<{ success: boolean; error?: string }> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, error: 'Missing authorization token. Please provide admin password as Bearer token.' };
  }

  const token = authHeader.substring(7);

  // 从 KV 中读取当前的管理员密码（即使用户修改了密码也能正确验证）
  try {
    let adminPassword = DEFAULT_SITE_SETTINGS.adminPassword;
    
    if (env.SITE_SETTINGS && typeof env.SITE_SETTINGS.get === 'function') {
      const settings = await env.SITE_SETTINGS.get('site_settings', 'json') as Record<string, unknown> | null;
      if (settings?.adminPassword) {
        adminPassword = settings.adminPassword as string;
      }
    }

    if (token !== adminPassword) {
      return { success: false, error: 'Invalid admin password' };
    }

    return { success: true };
  } catch {
    // 如果读取 KV 失败，使用默认密码验证
    if (token !== DEFAULT_SITE_SETTINGS.adminPassword) {
      return { success: false, error: 'Invalid admin password' };
    }
    return { success: true };
  }
}

/**
 * 发送 JSON 响应
 */
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: CORS_HEADERS,
  });
}
