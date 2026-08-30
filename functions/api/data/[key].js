// Cloudflare Pages Functions - 数据持久化 API (KV 存储)
// GET  /api/data/[key]  读取指定 key 的数据
// PUT  /api/data/[key]  保存指定 key 的数据（需管理员登录）

const ALLOWED_KEYS = ['products', 'categories', 'brands', 'company'];

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

function checkAuth(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.slice(7);
  // 简单 token 校验：token 应该等于 "admin:" + username + ":" + password 的 base64
  // 实际登录后返回的 token
  const expectedUser = env.ADMIN_USERNAME || 'XUEJIAN';
  const expectedPass = env.ADMIN_PASSWORD || 'XueJian0812511';
  const expectedToken = btoa(`admin:${expectedUser}:${expectedPass}`);
  return token === expectedToken;
}

export async function onRequest(context) {
  const { request, env, params } = context;
  const key = params.key;

  // 预检请求
  if (request.method === 'OPTIONS') {
    return jsonResponse({ ok: true }, 200);
  }

  // 校验 key 白名单
  if (!ALLOWED_KEYS.includes(key)) {
    return jsonResponse({ error: 'Invalid data key', allowedKeys: ALLOWED_KEYS }, 400);
  }

  const kvKey = `data:${key}`;

  // GET - 读取数据
  if (request.method === 'GET') {
    try {
      const value = await env.KV.get(kvKey);
      if (value === null) {
        return jsonResponse({ key, data: null, fromMock: true });
      }
      let parsed;
      try {
        parsed = JSON.parse(value);
      } catch {
        parsed = value;
      }
      return jsonResponse({ key, data: parsed, fromMock: false });
    } catch (error) {
      return jsonResponse({ error: 'Failed to read data', message: error.message }, 500);
    }
  }

  // PUT - 保存数据（需管理员权限）
  if (request.method === 'PUT') {
    if (!checkAuth(request, env)) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    try {
      const body = await request.json();
      const dataValue = typeof body.data !== 'undefined' ? body.data : body;
      const serialized = JSON.stringify(dataValue);
      await env.KV.put(kvKey, serialized, {
        metadata: {
          updatedAt: new Date().toISOString(),
          updatedBy: 'admin',
        },
      });
      return jsonResponse({ success: true, key, updatedAt: new Date().toISOString() });
    } catch (error) {
      return jsonResponse({ error: 'Failed to save data', message: error.message }, 500);
    }
  }

  return jsonResponse({ error: 'Method not allowed' }, 405);
}
