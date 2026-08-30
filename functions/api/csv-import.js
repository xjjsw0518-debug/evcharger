// Cloudflare Pages Functions - CSV 批量导入产品 API
// POST /api/csv-import  解析 CSV 内容，批量写入产品数据到 KV（需管理员登录）

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
  const expectedUser = env.ADMIN_USERNAME || 'XUEJIAN';
  const expectedPass = env.ADMIN_PASSWORD || 'XueJian0812511';
  const expectedToken = btoa(`admin:${expectedUser}:${expectedPass}`);
  return token === expectedToken;
}

// 简易 CSV 解析（支持双引号包裹字段、逗号分隔）
function parseCSV(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return { headers: [], rows: [] };

  const headers = parseCSVLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCSVLine(line);
    const row = {};
    headers.forEach((h, idx) => {
      row[h.trim()] = values[idx] ?? '';
    });
    rows.push(row);
  }

  return { headers, rows };
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// 生成简单唯一 ID
function generateId() {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function mapRowToProduct(row, index) {
  const id = row.id || row.ID || generateId();
  const nameZh = row.name_zh || row['名称(中)'] || row.name || row.title || `Product ${index + 1}`;
  const nameEn = row.name_en || row['名称(英)'] || row.name_en || row.title_en || nameZh;
  const category = row.category || row.分类 || row.category_id || 'general';
  const priceMin = parseFloat(row.priceMin || row.最低价 || row.price_min || 0) || 0;
  const priceMax = parseFloat(row.priceMax || row.最高价 || row.price_max || priceMin) || priceMin;
  const moq = parseInt(row.moq || row.起订量 || row.min_order || 1, 10) || 1;
  const mainImage = row.mainImage || row.主图 || row.image || '';
  const imagesStr = row.images || row.图片 || row.images_list || mainImage;
  const images = imagesStr ? imagesStr.split('|').map((s) => s.trim()).filter(Boolean) : [mainImage].filter(Boolean);
  const descZh = row.description_zh || row['描述(中)'] || row.description || '';
  const descEn = row.description_en || row['描述(英)'] || row.description_en || descZh;
  const featured = (row.featured || row.精选 || '').toString().toLowerCase() === 'true' ||
    row.featured === '1' || row.featured === 'yes';

  return {
    id,
    name: { zh: nameZh, en: nameEn },
    category,
    priceMin,
    priceMax,
    moq,
    mainImage: mainImage || images[0] || '',
    images,
    description: { zh: descZh, en: descEn },
    specs: [],
    featured,
    source: 'csv-import',
    createdAt: Date.now(),
  };
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

  // 鉴权
  if (!checkAuth(request, env)) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  try {
    const body = await request.json();
    const { csv, mode = 'merge' } = body; // mode: 'merge' (合并) | 'replace' (全量替换)

    if (!csv || typeof csv !== 'string') {
      return jsonResponse({ error: 'CSV content is required' }, 400);
    }

    const { headers, rows } = parseCSV(csv);

    if (rows.length === 0) {
      return jsonResponse({ error: 'No data rows found in CSV' }, 400);
    }

    const newProducts = rows.map((row, i) => mapRowToProduct(row, i));

    let resultProducts;
    let importedCount = newProducts.length;
    let totalCount;

    if (mode === 'replace') {
      // 全量替换
      resultProducts = newProducts;
      totalCount = newProducts.length;
    } else {
      // 合并模式：读取已有数据，按 ID 去重合并
      const existingRaw = await env.KV.get('data:products');
      let existing = [];
      if (existingRaw) {
        try {
          existing = JSON.parse(existingRaw);
        } catch {
          existing = [];
        }
      }

      const existingMap = new Map(existing.map((p) => [p.id, p]));
      let updated = 0;
      let added = 0;

      for (const product of newProducts) {
        if (existingMap.has(product.id)) {
          existingMap.set(product.id, { ...existingMap.get(product.id), ...product });
          updated++;
        } else {
          existingMap.set(product.id, product);
          added++;
        }
      }

      resultProducts = Array.from(existingMap.values());
      totalCount = resultProducts.length;
      importedCount = { added, updated, total: newProducts.length };
    }

    // 写入 KV
    await env.KV.put('data:products', JSON.stringify(resultProducts), {
      metadata: {
        updatedAt: new Date().toISOString(),
        updatedBy: 'admin',
        source: 'csv-import',
      },
    });

    return jsonResponse({
      success: true,
      mode,
      imported: importedCount,
      totalProducts: totalCount,
      columns: headers,
      preview: resultProducts.slice(0, 3).map((p) => ({ id: p.id, name: p.name, category: p.category })),
    });
  } catch (error) {
    return jsonResponse({ error: 'Failed to import CSV', message: error.message }, 500);
  }
}
