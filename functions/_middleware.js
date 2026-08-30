// Cloudflare Pages Functions - SPA 路由兜底中间件
// 所有非静态资源请求都返回 index.html，交由 React Router 处理

const STATIC_ASSETS = [
  '/assets/',
  '/favicon.',
  '/icons.',
  '/robots.txt',
  '/sitemap.xml',
  '/_routes.json',
  '/_headers',
];

const API_PREFIX = '/api/';

function isStaticAsset(path) {
  // 有扩展名的文件（.js .css .svg .png .jpg 等）直接视为静态资源
  if (path.includes('.') && !path.endsWith('/')) {
    // 排除 API 路径中碰巧有点的情况
    if (path.startsWith(API_PREFIX)) return false;
    return true;
  }
  for (const prefix of STATIC_ASSETS) {
    if (path.startsWith(prefix)) return true;
  }
  return false;
}

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // API 请求直接放行到对应 function
  if (path.startsWith(API_PREFIX)) {
    return next();
  }

  // 静态资源直接放行
  if (isStaticAsset(path)) {
    return next();
  }

  // 其余路径返回 index.html (SPA 路由回退)
  const assetUrl = new URL('/index.html', url.origin);
  const res = await context.env.ASSETS.fetch(assetUrl.toString());

  return new Response(res.body, {
    status: res.status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
