# Cloudflare Pages Functions

本目录包含 Cloudflare Pages Functions 后端代码，部署时随静态资源一起上传到 Cloudflare Pages。

## 文件结构

```
functions/
├── _middleware.js            # SPA 路由回退中间件
└── api/
    ├── data/
    │   └── [key].js          # 数据持久化 API (KV 存储)
    ├── login.js              # 管理员登录验证
    ├── analytics.js          # 运营分析数据记录
    └── csv-import.js         # CSV 批量导入产品
```

## API 说明

### 数据持久化

- `GET /api/data/products` - 读取产品数据
- `GET /api/data/categories` - 读取分类数据
- `GET /api/data/brands` - 读取品牌数据
- `GET /api/data/company` - 读取公司信息
- `PUT /api/data/{key}` - 更新数据（需管理员登录，Bearer Token）

### 管理员登录

- `POST /api/login` - 验证用户名密码，返回 token
  - Body: `{ username, password }`

### 运营分析

- `POST /api/analytics` - 记录用户行为事件
  - 支持事件类型: page_view, product_view, inquiry_submit, category_click, search_query, contact_click

### CSV 导入

- `POST /api/csv-import` - 批量导入产品数据（需管理员登录）
  - Body: `{ csv: "...", mode: "merge" | "replace" }`

## 环境变量

在 Cloudflare Pages 项目设置中配置：

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `ADMIN_USERNAME` | 管理员用户名 | XUEJIAN |
| `ADMIN_PASSWORD` | 管理员密码 | XueJian0812511 |

## KV 绑定

在 Cloudflare Pages 项目设置中绑定 KV 命名空间：

| 绑定变量名 | 说明 |
|-----------|------|
| `KV` | 数据存储（产品、分类、分析等） |
