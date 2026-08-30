// Cloudflare Pages Functions - 管理员登录验证 API
// POST /api/login  验证管理员用户名密码，返回 token

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function onRequest(context) {
  const { request, env } = context;

  // 预检请求
  if (request.method === 'OPTIONS') {
    return jsonResponse({ ok: true }, 200);
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return jsonResponse({ error: 'Username and password are required' }, 400);
    }

    const expectedUser = env.ADMIN_USERNAME || 'XUEJIAN';
    const expectedPass = env.ADMIN_PASSWORD || 'XueJian0812511';

    if (username !== expectedUser || password !== expectedPass) {
      return jsonResponse({ error: 'Invalid username or password' }, 401);
    }

    // 生成简单 token（base64 编码的凭据标识，生产环境建议使用 JWT）
    const token = btoa(`admin:${expectedUser}:${expectedPass}`);

    return jsonResponse({
      success: true,
      token,
      user: {
        username: expectedUser,
        role: 'admin',
      },
      expiresIn: 86400, // 24 小时
    });
  } catch (error) {
    return jsonResponse({ error: 'Invalid request body', message: error.message }, 400);
  }
}
