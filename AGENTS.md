# 汽配产品展示独立站 - 需求拆解文档

## 产品概述

- **产品类型**: B2B 汽配产品展示独立站（供应商官网）
- **场景类型**: <scene_type>prototype-app</scene_type>
- **目标用户**: 海外汽配采购商、批发商、电商卖家（面向全球客户）
- **核心价值**: 作为中国汽配供应商的线上展示窗口，展示丰富汽配SKU，支持分类浏览与询盘转化
- **界面语言**: 中英文双语（默认中文，可切换英文）
- **主题偏好**: 浅色（商务专业调性）
- **导航模式**: 路径导航
- **导航布局**: Topbar（消费者/采购商前台，顶部导航栏）

> **参考素材**: 用户提供 1 张速卖通 Automotive 分类页截图（attachment_id: https://aka.doubaocdn.com/s/3DSgwu71mJ），布局特征为顶部搜索栏 + 圆形分类图标网格 + 底部品牌 logo 墙，待 design-agent 阶段参考其视觉风格。

---

## 页面结构总览

> **说明**: 前台 + 简易后台，共 7 个页面（6 个一级页 + 1 个二级详情页）

| 页面名称 | 文件名 | 路由 | 页面类型 | 入口来源 |
|---------|-------|------|---------|---------|
| 首页 | `HomePage.tsx` | `/` | 一级 | 导航 |
| 产品列表页 | `ProductListPage.tsx` | `/products`、`/products/:category` | 一级 | 导航 / 首页分类图标点击 / 首页精选产品点击 |
| 产品详情页 | `ProductDetailPage.tsx` | `/product/:id` | 二级 | 产品列表页 → 产品卡片"查看详情"点击 / 首页精选产品点击 |
| 关于我们 | `AboutPage.tsx` | `/about` | 一级 | 导航 |
| 联系我们/询盘 | `ContactPage.tsx` | `/contact` | 一级 | 导航 / 产品详情页"询盘"按钮 |
| 后台管理 | `AdminPage.tsx` | `/admin` | 一级 | 页脚"管理后台"入口 / 直接访问路径 |

> **备注**: 后台管理不在顶部主导航中展示，仅通过页脚链接或直接路径访问，符合用户"入口放在页脚或通过特定路径访问"的要求。

---

## 页面布局建议

### 首页 (HomePage)
- **布局模式**: 纵向分区块单栏布局（Hero → 分类图标 → 精选产品 → 品牌墙 → 供应商优势）
- **视觉重心**: 分类图标区 + 精选产品区（用户核心动作是找产品）
- **结果承载区**: 精选产品网格（初始态直接展示 8-12 个精选产品）

### 产品列表页 (ProductListPage)
- **布局模式**: 左右分栏（FilterAside + 产品网格），移动端上下堆叠
- **视觉重心**: 右侧产品卡片网格
- **结果承载区**: 产品卡片网格（初始态加载当前分类下所有产品，左侧筛选实时过滤）

### 产品详情页 (ProductDetailPage)
- **布局模式**: 左右分栏（左：主图+缩略图 / 右：标题+价格+询盘按钮），下方描述+规格+相关产品
- **视觉重心**: 产品图片 + 询盘转化按钮
- **结果承载区**: 相关产品推荐区（初始态展示 4-6 个同分类产品）

---

## 导航配置

- **导航布局**: Topbar（顶部固定，桌面端水平展开，移动端汉堡菜单）
- **导航项**（仅一级页面，后台不在主导航）:

| 导航文字（中/英） | 路由 | 图标(可选) |
|-----------------|------|-----------|
| 首页 / Home | `/` | Home |
| 产品分类 / Products | `/products` | Grid |
| 关于我们 / About | `/about` | Info |
| 联系我们 / Contact | `/contact` | Mail |

> **补充**: 导航栏还包含 Logo（左侧）、搜索框（中间）、语言切换按钮（右侧，中/EN）。搜索框输入关键词后跳转至 `/products?keyword=xxx` 带参列表页。

---

## 数据来源声明

| 数据/操作 | 来源类型 | 实现要求 | mock 兜底 |
|---|---|---|---|
| 产品列表展示 | local-persist | localStorage key=`__auto_parts_products`，首次访问时从内置 mock 数据初始化写入，后续读写均走 localStorage | 内置 25+ 条预置示例产品数据（source='mock'），覆盖 10+ 分类 |
| 产品分类数据 | demo-mock | `src/data/categories.ts` const 数组，定义分类 id、名称（中/英）、图标、排序 | ✅ 本身就是 mock（分类为静态配置） |
| 品牌墙数据 | demo-mock | `src/data/brands.ts` const 数组，定义品牌名称 + logo URL | ✅ 本身就是 mock |
| 产品管理(增删改) | local-persist | 后台对产品的增删改操作均读写 localStorage，数据持久化在浏览器 | 无（以 localStorage 为准） |
| 询盘表单提交 | demo-mock | 前端表单校验 + 提交成功 toast 反馈，第一版不接真实邮件/API | ✅ 模拟提交成功 |
| 语言切换状态 | local-persist | localStorage key=`__auto_parts_lang`，保存当前语言偏好（zh/en） | 默认 'zh' |
| 供应商介绍/优势文案 | demo-mock | `src/data/company.ts` const 对象，中英文双语字段 | ✅ 本身就是 mock |

---

## 功能列表

### 首页 (HomePage)
- **页面目标**: 展示供应商定位与产品分类，引导采购商进入产品列表或发起询盘
- **功能点**:
  - **Hero 横幅展示**: 突出"中国汽配供应商 / China Auto Parts Supplier"核心定位，含主标题、副标题、CTA 按钮（浏览产品 / 联系我们）
  - **圆形分类图标导航**: 展示 20+ 个汽配品类（智能驾驶系统、汽车用品、外观改装、仪表监测、动力改装、车膜贴纸、轮毂轮胎、发动机配件、内饰装饰、防护用品、座套方向盘、应急启动电源、安全防盗、手机支架、尾翼改装、千斤顶、钥匙遥控、汽车养护、香水香薰、脚垫、刹车系统、收纳整理等），点击跳转对应分类产品列表
  - **精选产品网格**: 展示 8-12 个精选产品卡片（主图、标题、价格区间、MOQ），点击进入详情页
  - **品牌墙展示**: 横向滚动展示常见汽配品牌 logo（参考小米、联想、倍思等风格）
  - **供应商优势介绍**: 4 栏图标+文字展示（工厂直供、MOQ 灵活、全球发货、品质保证）

### 产品列表页 (ProductListPage)
- **页面目标**: 让采购商按分类/关键词筛选找到目标产品
- **功能点**:
  - **左侧分类筛选栏**: 树形/列表展示全部分类，点击切换当前分类，支持价格区间、MOQ 区间等筛选条件
  - **顶部搜索/排序**: 搜索框关键词过滤 + 排序下拉（价格升/降序、新品优先）
  - **产品卡片网格**: 响应式网格布局，每卡含主图、标题、价格区间（人民币）、MOQ、"查看详情"按钮
  - **分页/加载更多**: 产品较多时支持分页或"加载更多"按钮

### 产品详情页 (ProductDetailPage)
- **页面目标**: 展示产品完整信息，引导采购商发起询盘
- **功能点**:
  - **产品多图展示**: 左侧大图 + 下方缩略图横向排列，点击缩略图切换主图
  - **产品核心信息**: 标题、价格区间、MOQ、分类标签
  - **产品描述区**: 详细介绍文案（支持段落+要点列表）
  - **规格参数表**: 表格形式展示产品规格参数（如材质、尺寸、重量、包装等）
  - **询盘按钮**: 醒目位置放置"立即询盘"按钮，点击弹窗展示简易询盘表单（预填产品名）或跳转联系页
  - **相关产品推荐**: 同分类 4-6 个产品卡片，促进浏览深度

### 关于我们 (AboutPage)
- **页面目标**: 建立供应商信任，展示公司实力与合作流程
- **功能点**:
  - **公司介绍**: 图文并茂展示公司背景、行业经验、服务范围
  - **核心优势**: 5 项核心优势（工厂直供价格、丰富SKU、灵活MOQ、专业质检、全球物流），图标+标题+描述
  - **合作流程**: 步骤式流程图展示（询盘 → 报价 → 样品 → 下单 → 生产质检 → 发货 → 售后）

### 联系我们/询盘 (ContactPage)
- **页面目标**: 收集采购商询盘信息，提供多种联系方式
- **功能点**:
  - **询盘表单**: 字段含姓名、邮箱、国家、产品名称、数量、详细需求、提交按钮；带前端校验（邮箱格式、必填项），提交后 toast 成功提示
  - **联系方式展示**: 邮箱、WhatsApp、微信、公司地址，每项配图标
  - **地图占位**: 嵌入静态地图区域（占位图+地址文字）

### 后台管理 (AdminPage)
- **页面目标**: 简易管理产品数据（增删改查），数据持久化在 localStorage
- **功能点**:
  - **产品列表管理**: 表格展示所有产品（ID、名称、分类、价格、MOQ、操作列），支持按名称搜索、按分类过滤
  - **添加新产品**: 点击"新增产品"按钮 → 弹窗表单（图片 URL、标题、分类、价格区间、MOQ、描述、规格参数 JSON/文本）→ 提交写入 localStorage
  - **编辑产品**: 行内"编辑"按钮 → 弹窗预填当前数据 → 保存更新 localStorage
  - **删除产品**: 行内"删除"按钮 → 二次确认 Dialog → 从 localStorage 移除 + toast 反馈
  - **数据重置**: 提供"恢复初始示例数据"按钮，清空后重新写入 mock 数据（防止误删后无数据）

---

## 数据共享配置

| 存储键名 | 数据说明 | 使用页面 |
|---------|---------|---------|
| `__auto_parts_products` | 产品数据列表，类型为 `IProduct[]` | 首页、产品列表页、产品详情页、后台管理页 |
| `__auto_parts_lang` | 当前语言偏好，类型为 `'zh' \| 'en'` | 所有页面 |
| `__auto_parts_categories` | 产品分类配置，类型为 `ICategory[]` | 首页、产品列表页、后台管理页 |

```ts
interface IProduct {
  id: string;
  name: { zh: string; en: string };
  category: string; // category id
  priceMin: number; // 人民币
  priceMax: number;
  moq: number; // 起订量
  mainImage: string; // URL
  images: string[]; // 多图 URL 数组
  description: { zh: string; en: string };
  specs: { label: { zh: string; en: string }; value: string }[];
  featured?: boolean; // 是否精选
  source?: 'mock' | 'user'; // 数据来源
  createdAt: number;
}

interface ICategory {
  id: string;
  name: { zh: string; en: string };
  icon: string; // 图标名或 URL
  order: number;
}
```

---

## 双语与响应式要求

### 中英文双语
- 所有静态文案（导航、按钮、标题、页脚、表单标签等）均提供中/英两套
- 语言切换按钮放在顶部导航右侧，切换时更新 localStorage 并实时刷新页面文案
- 产品数据中的名称、描述、规格标签等字段也设计为 `{ zh, en }` 双语结构

### 响应式设计
- **桌面端** (>1024px): 顶部全导航 + 产品列表页左右分栏 + 产品详情页左右分栏
- **平板端** (768-1024px): 导航折叠为汉堡菜单 + 产品网格 3 列
- **移动端** (<768px): 汉堡菜单 + 产品网格 2 列 + 列表页筛选改为顶部下拉/抽屉 + 详情页上下堆叠

-------

<scene_type>prototype-app</scene_type>

# UI 设计指南

## 1. 设计推导依据

- **参考意图**: Structural Reference —— 参考图提供首页分类导航的圆形图标矩阵+品牌墙的区块结构与信息层级，不做像素级复刻；其余页面按产品语义独立设计。
- **核心情绪 / 应用类型**: 中国汽配B2B独立站，面向海外采购商，传递「可靠货源 + 丰富品类 + 高效询盘」的工业信任感与采购效率感。
- **独特记忆点**: 首页圆形分类图标矩阵延续参考图的品类识别习惯，配以深铬红主色与金属银细节，形成汽配工业感的视觉锚点。

## 2. Art Direction

- **方向名**: 工业汽配风
- **Design Style**: Swiss Grid 网格秩序 + Industrial Accent 工业金属细节 —— 以清晰网格承载大量品类与产品卡片，深铬红作为CTA与品牌锚点，细灰线与浅底构建专业B2B采购体验。
- **DNA 参数**: 圆角 subtle（`rounded-md`，卡片/按钮）与 pill（`rounded-full`，分类图标）混合 / 阴影 subtle（`shadow-sm`，卡片hover时加深） / 间距 standard（`gap-4` / `p-6`） / 字体方向 无衬线清晰可读 / 装饰手法 细边框分割、圆形品类图标、极细金属银描边。
- **应用类型**: Landing + Catalog + Tool —— 首页营销叙事 + 产品目录浏览 + 简易后台管理。

## 3. Color System

**色彩关系**: 深铬红主色 + 冷白/浅灰中性基底 + 金属银灰边框与辅助色，整体克制低饱和，主色只用于CTA与关键强调。
**配色设计理由**: 深铬红源于汽车刹车、尾灯与工业警示的行业语义，传递可靠与行动力；冷白底保证大量产品图与文字的可读性；银灰边框呼应汽配金属质感，整体适合B2B采购的严肃高效氛围。
**主色推导**: 从汽车制动系统、性能改装的经典红提取，降低饱和度提高明度适配Web长时间浏览，primary承担询盘按钮、当前分类、价格标签等核心行动与信息锚点。
**使用比例**: 70% 中性（bg/card/border）/ 22% 辅助（accent/textMuted）/ 8% primary；主按钮与价格用primary，tab激活与icon用accent或border层级，严禁全站泛红。

| 角色 | CSS 变量 | Tailwind Class | HSL 值 | 设计说明 |
|---|---|---|---|---|
| bg | `--background` | `bg-background` | hsl(0 0% 98%) | 页面背景，偏冷的工业白 |
| card | `--card` | `bg-card` | hsl(0 0% 100%) | 产品卡片、表单、弹层承载面 |
| text | `--foreground` | `text-foreground` | hsl(215 25% 14%) | 标题与正文，深炭灰 |
| textMuted | `--muted-foreground` | `text-muted-foreground` | hsl(215 12% 45%) | 辅助说明、MOQ、元信息 |
| primary | `--primary` | `bg-primary` / `text-primary` | hsl(355 78% 48%) | 深铬红，询盘CTA、价格、当前分类 |
| primaryForeground | `--primary-foreground` | `text-primary-foreground` | hsl(0 0% 100%) | 主按钮与主色块上的文字 |
| accent | `--accent` | `bg-accent` | hsl(215 20% 94%) | hover浅底、选中底、骨架屏 |
| accentForeground | `--accent-foreground` | `text-accent-foreground` | hsl(215 25% 20%) | accent上的文字与图标 |
| border | `--border` | `border-border` | hsl(215 10% 86%) | 卡片、输入框、菜单边界，金属银灰感 |

**语义色提示**: 成功 hsl(142 55% 38%) bg hsl(142 48% 95%) / border hsl(142 40% 80%) / text hsl(142 55% 32%)；警告 hsl(38 92% 50%) bg hsl(45 80% 96%) / border hsl(40 75% 82%) / text hsl(30 85% 35%)；错误 hsl(0 75% 55%) bg hsl(0 60% 96%) / border hsl(0 55% 82%) / text hsl(0 70% 42%)；语义色饱和度与primary对齐±10%，保持工业克制感。

## 4. 字体与节奏

- **font-display**: Space Grotesk —— 几何无衬线带工业机械感，适合Hero标题与品类大标题，强化汽配科技属性。
- **font-body**: Noto Sans SC + Inter 双栈 —— 中英文都清晰易读，适合产品描述、规格表、表单等长文本与高密度信息。
- **字号**: H1 text-4xl md:text-5xl；H2 text-2xl md:text-3xl；H3 text-lg；body text-base；muted text-sm。
- **圆角**: 卡片/按钮 `rounded-md`（subtle，工业利落）；分类图标 `rounded-full`（pill，与参考图一致）；输入框 `rounded-md`。

## 5. 全局布局契约

- **Reference Layout Use**: 首页圆形分类矩阵+品牌墙的区块顺序与行列密度来自参考图结构；顶部导航形态参考搜索+菜单组合；产品列表、详情、关于、联系、后台页面按需求结构推导。
- **Page / Section Order**: 首页（导航→Hero→分类矩阵→品牌墙→精选产品→供应商优势→页脚）/ 产品列表（左侧筛选+右侧网格）/ 产品详情（图+信息+规格+相关）/ 关于 / 联系 / 后台。
- **Standard Content Zone**: Landing 与产品页 `max-w-7xl` + `mx-auto`；后台管理页 `max-w-6xl` + `mx-auto`。
- **Shell / Frame Alignment**: 内容容器与顶部导航同宽对齐，页脚全宽但内部内容受Standard Content Zone约束。
- **Padding & Rhythm**: `px-4 md:px-6 lg:px-8 py-10 md:py-14`，section间 `space-y-12 md:space-y-16`，保持8px倍数。
- **Full-bleed Zones**: Hero背景、页脚背景、供应商优势区块背景可全宽，内部文字与按钮受内容区约束。
- **Local Narrowing**: 询盘表单、关于正文、后台表单可收窄至 `max-w-2xl` 或 `max-w-3xl` 居中。
- **Overflow Strategy**: 规格参数表、分类筛选栏（移动端）、后台产品表格使用 `overflow-x-auto`。
- **Flexibility Boundary**: 允许移动端卡片列数、分类图标大小、内边距微调；不允许切换主色、圆角系统或阴影语言。

## 6. 视觉与动效

- **装饰**: 细灰分割线、圆形分类图标底衬、极细红边点缀
- **阴影/边界**: 轻阴影 + 清晰边界；卡片默认border，hover时加`shadow-md`与上移2px
- **动效**: 克制 —— hover状态有150ms过渡；图片懒加载淡入；分类切换有轻滑效果；不做夸张入场动画

## 7. 组件原则

- 按钮：Primary实心深铬红（询盘、提交）；Outline描边灰（查看详情、次要操作）；Ghost文字型（导航、筛选）。
- 产品卡片：白底+细边框+`rounded-md`，包含主图、标题、价格（红）、MOQ（灰）、操作按钮。
- 分类圆形图标：`rounded-full` + 浅灰底 + 居中图标/图 + 下方文字，hover时边框变红、轻微上浮。
- 表单输入框：`rounded-md` + border + focus时primary色环，统一高度。
- 所有交互元素必须有Default / Hover / Active / Focus-visible / Disabled五态。
- 加载与空状态用accent色底 + muted文字 + 简约线稿图标，延续工业克制感。

## 8. Image Direction

- **Image Role**: Hero主视觉图 + 分类图标图 + 产品主图/多图 + 品牌logo墙 + 供应商优势配图
- **Image Art Direction**: Hero图采用工业摄影风格，前景为汽配零件（刹车卡钳、轮毂、滤清器等金属质感部件）错落摆放于深灰工作台上，侧顶光打亮金属高光与阴影，背景虚化露出工厂/仓库纵深，冷色调配一抹红色点缀（如卡钳红），传递"中国汽配供应链"的专业与体量感；分类图标为白底或浅灰底的品类单品特写，居中构图，干净产品摄影风；产品图为标准电商白底主图+场景辅图。
- **Image Prompt Keywords**: automotive parts studio shot, brake caliper and wheel rim on dark workbench, industrial side lighting, metal texture highlights, shallow depth of field, warehouse background bokeh, cool tone with red accent, commercial product photography, clean composition, high detail
- **Image Avoidance**: 避免卡通化汽配插图、过度PS的炫光科技感、拼接感明显的素材图库图、人物摆拍的商务团队照、廉价白底商品图的随意堆叠、与汽配无关的抽象渐变背景。

## 9. Anti-patterns

- **Split personality**: 首页用工业风、内页退回默认SaaS蓝；全站统一深铬红+冷灰银的汽配视觉系统。
- **Phantom tokens**: 编造shadcn不存在的CSS变量；只使用9个基础token + 语义色，或在主题中补齐。
- **Red everywhere**: 主色铺满按钮、tab、icon、边框、链接、价格；严格控制primary在8%以内，其余用accent/border层级。
- **Catalog chaos**: 产品卡片信息密度不统一，标题行数、图片比例随意；所有产品卡统一4:3图、2行标题、价格+MOQ固定位置。
- **Invisible interaction**: 只做hover不做focus-visible；每个可交互元素都要有清晰的键盘焦点环。
- **Hero bloat**: Hero塞太多卖点与按钮；Hero只承载"中国汽配供应商"主定位+搜索/询盘一个核心行动。
- **Status color drift**: 成功/警告/错误色饱和度过高刺眼；语义色饱和度必须与primary的78%对齐±10%。