// Cloudflare Pages Functions - 运营分析数据记录 API
// POST /api/analytics  记录用户行为事件（页面访问、产品查看、询盘提交等）

const ALLOWED_EVENTS = [
  'page_view',
  'product_view',
  'inquiry_submit',
  'category_click',
  'search_query',
  'contact_click',
];

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function getClientIp(request) {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0].trim() ||
    request.headers.get('X-Real-IP') ||
    'unknown'
  );
}

function getCountry(request) {
  // Cloudflare 在 cf 对象中提供国家信息
  const cf = request.cf;
  return cf?.country || cf?.region || 'unknown';
}

export async function onRequest(context) {
  const { request, env } = context;

  // 预检请求
  if (request.method === 'OPTIONS') {
    return jsonResponse({ ok: true }, 200);
  }

  // GET - 获取统计摘要（可选，简单版）
  if (request.method === 'GET') {
    try {
      // 从 KV 读取按天聚合的统计
      const today = new Date().toISOString().slice(0, 10);
      const stats = await env.KV.get(`analytics:summary:${today}`, 'json');
      return jsonResponse({
        date: today,
        stats: stats || { pageViews: 0, productViews: 0, inquiries: 0 },
      });
    } catch {
      return jsonResponse({ stats: { pageViews: 0, productViews: 0, inquiries: 0 } });
    }
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const body = await request.json();
    const { event, path, productId, category, keyword, referrer, userAgent: _ua } = body;

    if (!event || !ALLOWED_EVENTS.includes(event)) {
      return jsonResponse({ error: 'Invalid event type', allowedEvents: ALLOWED_EVENTS }, 400);
    }

    const today = new Date().toISOString().slice(0, 10);
    const timestamp = new Date().toISOString();
    const ip = getClientIp(request);
    const country = getCountry(request);

    // 记录到 KV（按天 + 按事件类型聚合，避免写入过多）
    const summaryKey = `analytics:summary:${today}`;
    let summary = await env.KV.get(summaryKey, 'json');
    if (!summary) {
      summary = {
        date: today,
        totalEvents: 0,
        pageViews: 0,
        productViews: 0,
        inquiries: 0,
        categoryClicks: 0,
        searches: 0,
        countries: {},
      };
    }

    summary.totalEvents += 1;
    summary.lastEventAt = timestamp;

    switch (event) {
      case 'page_view':
        summary.pageViews += 1;
        break;
      case 'product_view':
        summary.productViews += 1;
        break;
      case 'inquiry_submit':
        summary.inquiries += 1;
        break;
      case 'category_click':
        summary.categoryClicks += 1;
        break;
      case 'search_query':
        summary.searches += 1;
        break;
    }

    if (country && country !== 'unknown') {
      summary.countries[country] = (summary.countries[country] || 0) + 1;
    }

    await env.KV.put(summaryKey, JSON.stringify(summary), {
      expirationTtl: 86400 * 90, // 保留 90 天
    });

    // 如果是产品浏览，单独记录产品热度
    if (event === 'product_view' && productId) {
      const productKey = `analytics:product:${productId}`;
      let productStats = await env.KV.get(productKey, 'json');
      if (!productStats) {
        productStats = { productId, views: 0, lastViewedAt: timestamp };
      }
      productStats.views += 1;
      productStats.lastViewedAt = timestamp;
      await env.KV.put(productKey, JSON.stringify(productStats), {
        expirationTtl: 86400 * 30, // 30 天
      });
    }

    // 询盘单独存一条详细记录
    if (event === 'inquiry_submit') {
      const inquiryId = `inquiry:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
      await env.KV.put(
        `analytics:inquiries:${today}`,
        JSON.stringify({
          id: inquiryId,
          path,
          ip,
          country,
          timestamp,
          ...body,
        }),
        { expirationTtl: 86400 * 180 }
      );
    }

    return jsonResponse({ success: true, receivedAt: timestamp });
  } catch (error) {
    return jsonResponse({ error: 'Failed to record event', message: error.message }, 500);
  }
}
