# 网站架构升级部署指南

## 🎯 升级内容

本次升级将网站设置从**浏览器本地存储（localStorage）**迁移到**Cloudflare Workers KV 服务器端存储**，实现：

- ✅ 后台修改设置后，**所有电脑、所有浏览器**都能看到修改结果
- ✅ 不再依赖单台电脑的浏览器缓存
- ✅ 支持 Logo、品牌名称、邮箱、页脚、Hero 等所有设置的全局同步

---

## 📋 部署步骤

### 第一步：创建 Cloudflare KV 命名空间

1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)
2. 在左侧菜单中找到 **Workers & Pages**
3. 点击 **KV** 标签页
4. 点击 **Create a namespace**（创建命名空间）
5. 输入名称：`SITE_SETTINGS`
6. 点击 **Add**（添加）

### 第二步：获取 KV 命名空间 ID

1. 在 KV 列表中找到刚创建的 `SITE_SETTINGS`
2. 点击右侧的 **View**（查看）
3. 复制 **Namespace ID**（命名空间 ID），格式类似：
   ```
   a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
   ```

### 第三步：配置 wrangler.toml

1. 打开项目根目录下的 `wrangler.toml` 文件
2. 找到这一行：
   ```toml
   id = "REPLACE_WITH_YOUR_KV_NAMESPACE_ID"
   ```
3. 把 `REPLACE_WITH_YOUR_KV_NAMESPACE_ID` 替换为你刚才复制的 KV 命名空间 ID
4. 保存文件

### 第四步：安装依赖

在项目根目录下运行：

```bash
npm install
```

或者如果你使用 bun：

```bash
bun install
```

### 第五步：构建前端

```bash
npm run build
```

这会生成 `dist` 目录，包含前端静态文件。

### 第六步：部署到 Cloudflare

```bash
npx wrangler deploy
```

部署成功后，你会看到类似这样的输出：

```
✨ Deployment complete!
https://evcharger.xjjsw0518.workers.dev
```

---

## 🔧 验证部署是否成功

### 1. 验证 API 是否正常工作

在浏览器中访问：

```
https://你的域名/api/settings
```

如果返回 JSON 数据（包含 brandName、logoUrl 等字段），说明 API 正常工作。

### 2. 验证后台设置是否全局同步

1. 在电脑 A 上打开后台，修改品牌名称为 "Test Brand"
2. 点击保存
3. 在电脑 B 上打开网站首页
4. 强制刷新（Ctrl + F5 或 Cmd + Shift + R）
5. 应该能看到 "Test Brand" 显示在导航栏

如果能看到，说明全局同步功能正常工作！

---

## 📁 修改的文件清单

### 新增文件
- `src/worker/index.ts` - Cloudflare Workers 后端入口，处理 API 路由和静态资源

### 修改的文件
- `wrangler.toml` - 添加 KV 命名空间绑定和 Workers 入口配置
- `package.json` - 添加 wrangler 和 @cloudflare/workers-types 依赖
- `src/hooks/useSiteSettings.ts` - 从 API 读取/保存设置，保留 localStorage 缓存
- `src/hooks/useContactSettings.ts` - 从 API 读取/保存联系信息，保留 localStorage 缓存
- `src/pages/AdminPage/LogoSettingsSection.tsx` - 适配异步 updateSettings
- `src/pages/AdminPage/ContactSettingsSection.tsx` - 适配异步 updateSettings
- `src/pages/AdminPage/VideoSettingsSection.tsx` - 适配异步 updateSettings
- `src/pages/AdminPage/SecuritySettingsSection.tsx` - 适配异步 updateSettings
- `src/pages/AdminPage/HeroSettingsSection.tsx` - 适配异步 updateSettings
- `src/pages/AdminPage/FooterSettingsSection.tsx` - 适配异步 updateSettings

---

## ❓ 常见问题

### Q1: 部署后网站打不开，显示 500 错误？

**可能原因**：KV 命名空间 ID 配置错误，或者 KV 命名空间没有正确绑定。

**解决方法**：
1. 检查 `wrangler.toml` 中的 KV ID 是否正确
2. 确认 KV 命名空间名称是 `SITE_SETTINGS`
3. 重新运行 `npx wrangler deploy`

### Q2: 后台保存设置后，其他电脑看不到变化？

**可能原因**：浏览器缓存了旧的设置。

**解决方法**：
1. 在其他电脑上**强制刷新**页面（Ctrl + F5 或 Cmd + Shift + R）
2. 或者清除浏览器缓存后重新访问

### Q3: 保存设置时提示"保存到服务器失败"？

**可能原因**：管理员密码不正确，或者网络问题。

**解决方法**：
1. 确认你使用的是正确的管理员密码（默认：XueJian0812511）
2. 检查网络连接
3. 查看浏览器控制台（F12）中的错误信息

### Q4: 如何修改管理员密码？

1. 登录后台
2. 进入 **安全设置**（Security Settings）
3. 修改密码后保存
4. 新密码会自动同步到服务器，所有电脑生效

### Q5: 本地开发时如何测试？

本地开发时，API 请求会失败（因为没有 Workers 环境），但设置会保存在 localStorage 中，不影响本地开发。

部署到 Cloudflare 后，API 会自动生效。

---

## 📞 技术支持

如果在部署过程中遇到问题，请检查：

1. Cloudflare 账户是否有 Workers 免费额度
2. KV 命名空间是否正确创建和绑定
3. `wrangler.toml` 配置是否正确
4. 部署日志中是否有错误信息

---

## 🎉 完成！

部署完成后，你的网站将具备：

- ✅ **全局设置同步**：后台修改，所有电脑立即生效
- ✅ **服务器端存储**：不再依赖单台电脑的浏览器缓存
- ✅ **向后兼容**：保留 localStorage 缓存，提高加载速度
- ✅ **安全认证**：保存设置需要管理员密码验证
- ✅ **所有设置支持**：Logo、品牌名称、邮箱、页脚、Hero、视频等

享受全新的全局同步体验吧！🚀
