// EXPORTS: IFaqItem, IFaqCategory, MOCK_FAQS, MOCK_FAQ_CATEGORIES
export interface IFaqCategory {
  id: string;
  name: { zh: string; en: string };
  order: number;
}

export interface IFaqItem {
  id: string;
  question: { zh: string; en: string };
  answer: { zh: string; en: string };
  category: string; // category id
  order: number;
  source?: 'mock' | 'user';
  createdAt: number;
}

export const MOCK_FAQ_CATEGORIES: IFaqCategory[] = [
  { id: 'moq-order', name: { zh: '起订量与下单', en: 'MOQ & Orders' }, order: 1 },
  { id: 'shipping', name: { zh: '物流与配送', en: 'Shipping & Delivery' }, order: 2 },
  { id: 'product-cert', name: { zh: '产品与认证', en: 'Products & Certification' }, order: 3 },
  { id: 'payment', name: { zh: '付款与价格', en: 'Payment & Pricing' }, order: 4 },
  { id: 'cooperation', name: { zh: '合作与定制', en: 'Cooperation & OEM' }, order: 5 },
];

export const MOCK_FAQS: IFaqItem[] = [
  // ===== MOQ & Orders =====
  {
    id: 'faq-001',
    question: { zh: '最小起订量(MOQ)是多少？', en: 'What is the Minimum Order Quantity (MOQ)?' },
    answer: {
      zh: '我们的MOQ根据产品类型有所不同：\n\n- 充电枪、转接器、便携式充电桩：MOQ 2件\n- 充电线、插座、连接器：MOQ 2件\n- 配件类（锁具、收纳架等）：MOQ 5-10件\n\n支持混装发货，多种产品可以拼单以达到起订量。首次合作可以先从样品单开始，样品费在后续大货订单中可退还。',
      en: 'Our MOQ varies by product type:\n\n- Charging guns, adapters, portable chargers: MOQ 2 pieces\n- Charging cables, sockets, connectors: MOQ 2 pieces\n- Accessories (locks, organizers, etc.): MOQ 5-10 pieces\n\nWe support mixed container shipping — multiple products can be combined to meet MOQ. For first-time partners, you can start with a sample order, and sample fees can be deducted from subsequent bulk orders.',
    },
    category: 'moq-order',
    order: 1,
    source: 'mock',
    createdAt: Date.now(),
  },
  {
    id: 'faq-002',
    question: { zh: '可以提供样品吗？样品费多少？', en: 'Can you provide samples? How much do they cost?' },
    answer: {
      zh: '可以，我们支持提供样品。具体说明如下：\n\n- 样品费：根据产品型号不同而不同，请联系销售获取样品报价\n- 运费：样品运费由买家承担（DHL/FedEx快递，约3-7天）\n- 样品费退还：后续下达批量订单时，可从货款中扣除样品费\n- 样品周期：现货产品1-3个工作日发出\n\n如需样品，请联系我们的WhatsApp销售，提供您的收件信息和所需样品型号。',
      en: 'Yes, we can provide samples. Details:\n\n- Sample fee: Varies by product model. Contact sales for sample pricing\n- Shipping: Sample shipping cost is borne by the buyer (DHL/FedEx express, ~3-7 days)\n- Sample fee refund: When placing a bulk order later, the sample fee can be deducted from payment\n- Sample lead time: In-stock products ship in 1-3 business days\n\nTo request samples, contact our WhatsApp sales team with your delivery address and required sample models.',
    },
    category: 'moq-order',
    order: 2,
    source: 'mock',
    createdAt: Date.now(),
  },
  {
    id: 'faq-003',
    question: { zh: '支持哪些付款方式？', en: 'What payment methods do you accept?' },
    answer: {
      zh: '我们支持多种付款方式，包括：\n\n- T/T银行转账（推荐，适合大额订单）\n- PayPal（适合样品单和小金额订单）\n- Western Union / MoneyGram\n- 支付宝 / 微信支付（人民币付款）\n- 信用证（L/C，大额订单可协商）\n\n通常采用 30% 定金 + 70% 发货前付清 的付款方式。具体条款可与您的销售代表协商确定。',
      en: 'We support multiple payment methods, including:\n\n- T/T bank transfer (recommended for large orders)\n- PayPal (suitable for sample and small orders)\n- Western Union / MoneyGram\n- Alipay / WeChat Pay (CNY payment)\n- Letter of Credit (L/C, negotiable for large orders)\n\nGenerally, we use 30% deposit + 70% before shipment. Specific terms can be negotiated with your sales representative.',
    },
    category: 'payment',
    order: 1,
    source: 'mock',
    createdAt: Date.now(),
  },
  // ===== Shipping =====
  {
    id: 'faq-004',
    question: { zh: '发货方式和交货期是怎样的？', en: 'What are the shipping methods and delivery times?' },
    answer: {
      zh: '我们提供多种物流方案：\n\n- **快递（DHL/FedEx/UPS）**：3-7天到货，适合样品单和紧急小单，运费较高\n- **空运**：5-10天到货，适合中小批量，性价比适中\n- **海运**：20-35天到货，适合大批量，运费最低\n- **陆运**：部分东南亚国家可走陆运，时效10-15天\n\n交货期：\n- 现货产品：付款后2-5个工作日内发货\n- 定制/贴牌产品：15-30个工作日（视数量而定）\n\n具体运费和时效请联系销售获取实时报价。',
      en: 'We offer multiple logistics options:\n\n- **Express (DHL/FedEx/UPS)**: 3-7 day delivery, for samples and urgent small orders, higher shipping cost\n- **Air freight**: 5-10 day delivery, for small-to-medium batches, good value\n- **Sea freight**: 20-35 day delivery, for large batches, lowest cost\n- **Land freight**: Available for some SE Asian countries, 10-15 day transit\n\nLead times:\n- In-stock products: Ship within 2-5 business days after payment\n- Custom/OEM products: 15-30 business days (depends on quantity)\n\nContact sales for real-time shipping quotes and timelines.',
    },
    category: 'shipping',
    order: 1,
    source: 'mock',
    createdAt: Date.now(),
  },
  {
    id: 'faq-005',
    question: { zh: '你们发哪些国家？能做一件代发吗？', en: 'Which countries do you ship to? Do you offer dropshipping?' },
    answer: {
      zh: '我们发货到全球80+国家和地区，主要市场包括：\n\n- 东南亚：印度尼西亚、泰国、越南、马来西亚、菲律宾、新加坡\n- 欧洲：德国、法国、英国、意大利、西班牙、波兰等\n- 中东：阿联酋、沙特、卡塔尔\n- 其他：澳大利亚、北美、南美、非洲\n\n关于一件代发（Dropshipping）：\n- 支持一件代发服务\n- 提供高清产品图片、英文描述、规格参数\n- 支持中性包装（不显示我方信息）\n- 电商卖家（Shopee/Lazada/Amazon/TikTok Shop）欢迎合作\n\n具体代发政策请联系销售咨询。',
      en: 'We ship to 80+ countries and regions worldwide. Key markets include:\n\n- Southeast Asia: Indonesia, Thailand, Vietnam, Malaysia, Philippines, Singapore\n- Europe: Germany, France, UK, Italy, Spain, Poland and more\n- Middle East: UAE, Saudi Arabia, Qatar\n- Others: Australia, North America, South America, Africa\n\nAbout dropshipping:\n- Yes, we offer dropshipping service\n- Provide high-res product images, English descriptions, specifications\n- Support neutral packaging (no our branding)\n- E-commerce sellers (Shopee/Lazada/Amazon/TikTok Shop) welcome\n\nContact sales for specific dropshipping terms.',
    },
    category: 'shipping',
    order: 2,
    source: 'mock',
    createdAt: Date.now(),
  },
  // ===== Product & Certification =====
  {
    id: 'faq-006',
    question: { zh: '产品有CE认证吗？还有哪些认证？', en: 'Do your products have CE certification? What other certifications are there?' },
    answer: {
      zh: '我们的产品认证情况如下：\n\n- **CE认证**：全系列产品均通过CE认证，符合欧盟标准要求（EMC + LVD）\n- **RoHS**：符合RoHS环保要求\n- **IP防护**：充电枪头和转接器IP54，便携式充电桩IP54-IP67（具体看型号）\n\n关于其他认证：\n- **SNI认证（印尼）**：SNI认证由进口商负责办理，我们可以提供技术支持和测试报告\n- **SIRIM/TISI等地区认证**：目前未全部覆盖，可配合客户做认证\n- 如需特定认证证书或测试报告，请联系销售索取。',
      en: 'Our product certification status:\n\n- **CE certification**: All products are CE certified, meeting EU standard requirements (EMC + LVD)\n- **RoHS**: Compliant with RoHS environmental requirements\n- **IP rating**: Charging guns and adapters IP54; portable chargers IP54-IP67 (varies by model)\n\nRegarding other certifications:\n- **SNI (Indonesia)**: SNI certification is handled by the importer. We can provide technical support and test reports\n- **SIRIM/TISI and other regional certifications**: Not all covered yet, but we can assist customers with certification\n- For specific certificates or test reports, please contact sales.',
    },
    category: 'product-cert',
    order: 1,
    source: 'mock',
    createdAt: Date.now(),
  },
  {
    id: 'faq-007',
    question: { zh: '产品质量如何保证？有售后质保吗？', en: 'How do you ensure product quality? Is there a warranty?' },
    answer: {
      zh: '我们对产品质量有严格把控：\n\n**质量管控：**\n- 供应商筛选：只与通过ISO 9001的工厂合作\n- 来料检验：关键元器件全检\n- 成品抽检：每批出货前抽检（外观、功能、包装）\n- 安全测试：高压、绝缘、温升等测试\n\n**质保政策：**\n- 标准质保：12个月质保期，非人为损坏免费换新或维修\n- 质保期外：提供成本价维修和配件供应\n- 质量问题：批量质量问题我们承担往返运费\n\n合作前可以先买样品验证质量，满意再批量采购。',
      en: 'We maintain strict quality control:\n\n**Quality Control:**\n- Supplier screening: Only work with ISO 9001 certified factories\n- Incoming inspection: 100% inspection for key components\n- Finished goods sampling: Sampling inspection before each batch shipment (appearance, function, packaging)\n- Safety testing: High voltage, insulation, temperature rise tests\n\n**Warranty Policy:**\n- Standard warranty: 12 months — free replacement or repair for non-man-made damage\n- After warranty period: Cost-price repair and spare parts available\n- Quality issues: We cover round-trip shipping for batch quality problems\n\nYou can purchase samples first to verify quality before placing bulk orders.',
    },
    category: 'product-cert',
    order: 2,
    source: 'mock',
    createdAt: Date.now(),
  },
  {
    id: 'faq-008',
    question: { zh: 'GBT和Type 2有什么区别？怎么选？', en: 'What is the difference between GB/T and Type 2? How do I choose?' },
    answer: {
      zh: 'GB/T和Type 2是两种不同的充电接口标准：\n\n**GB/T（中国国标）：**\n- 中国大陆强制标准\n- 中国品牌电动车（比亚迪、吉利、奇瑞等）使用\n- 东南亚地区因中国车企出海也在普及\n- 主要是单相7kW交流规格\n\n**Type 2（欧洲标准）：**\n- 欧盟、澳大利亚等地区使用\n- 欧洲品牌电动车（特斯拉欧洲版、大众、宝马等）使用\n- 支持单相和三相（最高22kW）\n\n**如何选：**\n- 看你的目标市场：中国/东南亚选GB/T，欧洲/澳洲选Type 2\n- 看当地主流车型：什么品牌的车多，就备什么接口的货\n- 转接器也很重要：备一些GB/T↔Type 2转接器，满足跨境需求\n\n如果不确定，可以咨询我们的销售获取市场建议。',
      en: 'GB/T and Type 2 are two different charging interface standards:\n\n**GB/T (Chinese national standard):**\n- Mandatory standard in mainland China\n- Used by Chinese EV brands (BYD, Geely, Chery, etc.)\n- Also growing in SE Asia due to Chinese EV exports\n- Mainly single-phase 7kW AC specification\n\n**Type 2 (European standard):**\n- Used in EU, Australia and other regions\n- Used by European EV brands (Tesla Europe, VW, BMW, etc.)\n- Supports both single-phase and three-phase (up to 22kW)\n\n**How to choose:**\n- Based on your target market: GB/T for China/SE Asia, Type 2 for Europe/Australia\n- Based on local popular EV brands: Stock whichever interfaces match the dominant brands\n- Adapters are also important: Stock some GB/T↔Type 2 adapters for cross-border needs\n\nIf unsure, consult our sales team for market recommendations.',
    },
    category: 'product-cert',
    order: 3,
    source: 'mock',
    createdAt: Date.now(),
  },
  // ===== Payment & Pricing =====
  {
    id: 'faq-009',
    question: { zh: '批发价格是多少？有没有价格表？', en: 'What are the wholesale prices? Do you have a price list?' },
    answer: {
      zh: '我们的价格根据采购量阶梯定价，量越大单价越低。由于产品规格和配置多样，具体价格需要根据您的需求定制报价。\n\n**影响报价的主要因素：**\n- 产品型号和规格参数\n- 采购数量（量越大单价越低）\n- 是否需要OEM贴牌或定制\n- 目的地国家（影响运费）\n\n**获取详细报价：**\n- 请通过WhatsApp联系我们的销售团队\n- 告知您需要的型号和数量\n- 我们会在24小时内发送完整产品目录和报价单\n- 量大客户可申请专属价格和账期\n\n我们提供有竞争力的工厂直供批发价，欢迎随时咨询。',
      en: 'Our pricing is tiered based on order quantity — larger volumes get lower unit prices. Due to the variety of product specifications and configurations, exact pricing requires a customized quote based on your needs.\n\n**Factors that affect pricing:**\n- Product model and specifications\n- Purchase quantity (larger volume = lower unit price)\n- OEM/private labeling or customization needs\n- Destination country (affects shipping cost)\n\n**To get detailed pricing:**\n- Contact our sales team via WhatsApp\n- Let us know which models and quantities you need\n- We will send a complete catalog and price list within 24 hours\n- High-volume customers can apply for special pricing and payment terms\n\nWe offer competitive factory-direct wholesale prices. Contact us anytime for a quote.',
    },
    category: 'payment',
    order: 2,
    source: 'mock',
    createdAt: Date.now(),
  },
  // ===== Cooperation & OEM =====
  {
    id: 'faq-010',
    question: { zh: '支持OEM/ODM定制吗？起订量多少？', en: 'Do you support OEM/ODM customization? What is the MOQ?' },
    answer: {
      zh: '我们支持OEM和ODM定制服务：\n\n**OEM定制（贴牌）：**\n- 定制内容：品牌Logo、包装、标签、说明书\n- 起订量：一般500件/型号（部分产品可低至200件）\n- 周期：15-30天\n- 费用：Logo印刷+包装设计费（量大可减免）\n\n**ODM定制（产品设计）：**\n- 定制内容：产品外观、功能、规格参数、APP等\n- 起订量：根据项目复杂度，一般1000件起\n- 周期：30-90天\n- 费用：开模费+研发费（量大可分摊）\n\n**合作流程：**\n1. 沟通需求 → 2. 报价确认 → 3. 打样确认 → 4. 签合同付定金 → 5. 大货生产 → 6. 验货发货\n\n欢迎有实力的经销商联系我们洽谈OEM/ODM合作。',
      en: 'We support OEM and ODM customization services:\n\n**OEM (Private Label):**\n- Customization: Brand logo, packaging, labels, user manuals\n- MOQ: Generally 500 pcs/model (some products as low as 200 pcs)\n- Lead time: 15-30 days\n- Fees: Logo printing + packaging design (waivable for large volumes)\n\n**ODM (Product Design):**\n- Customization: Product appearance, features, specs, APP, etc.\n- MOQ: Depends on project complexity, typically 1000+ pieces\n- Lead time: 30-90 days\n- Fees: Tooling + R&D (amortizable for large volumes)\n\n**Cooperation process:**\n1. Requirements discussion → 2. Quotation confirmation → 3. Sample confirmation → 4. Contract & deposit → 5. Mass production → 6. Inspection & shipping\n\nEstablished distributors are welcome to discuss OEM/ODM partnerships.',
    },
    category: 'cooperation',
    order: 1,
    source: 'mock',
    createdAt: Date.now(),
  },
  {
    id: 'faq-011',
    question: { zh: '你们是工厂还是贸易公司？能验厂吗？', en: 'Are you a factory or trading company? Can we audit the factory?' },
    answer: {
      zh: 'youpei auto 是专注EV充电配件的专业供应商：\n\n**关于我们：**\n- 我们有自建工厂和深度合作的供应链体系\n- 核心产品（充电枪、便携充）由自有工厂生产\n- 部分配件类产品来自我们长期合作的优质工厂\n- 总部位于广东深圳，工厂位于广东东莞\n\n**验厂和参观：**\n- 欢迎客户来深圳公司和东莞工厂参观考察\n- 支持第三方验厂（如SGS、BV等）\n- 可提供工厂资质证书、生产车间照片视频\n\n**我们的优势：**\n- 工厂直供价格，省去中间环节\n- 专业技术团队，支持产品定制开发\n- 稳定的品控体系，质量有保障\n- 丰富的出口经验，熟悉各国认证要求',
      en: 'youpei auto is a specialized supplier focused on EV charging accessories:\n\n**About us:**\n- We have our own factory and deep supply chain partnerships\n- Core products (charging guns, portable chargers) produced in our own factory\n- Some accessory products from our long-term partner factories\n- HQ in Shenzhen, Guangdong; factory in Dongguan, Guangdong\n\n**Factory visits and audits:**\n- Customers welcome to visit our Shenzhen office and Dongguan factory\n- Third-party factory audits supported (SGS, BV, etc.)\n- Factory certificates, production workshop photos/videos available\n\n**Our advantages:**\n- Factory direct pricing, no middlemen\n- Professional technical team supporting custom product development\n- Stable QC system ensuring quality\n- Extensive export experience, familiar with certification requirements across countries',
    },
    category: 'cooperation',
    order: 2,
    source: 'mock',
    createdAt: Date.now(),
  },
  {
    id: 'faq-012',
    question: { zh: '你们只做批发吗？个人可以买吗？', en: 'Do you only do wholesale? Can individuals buy?' },
    answer: {
      zh: '是的，youpei auto 只服务B2B批发客户。\n\n**原因：**\n- 我们的价格体系是批发价，不适合零售\n- 我们的服务模式是批量供货，不提供零售级别的售后服务\n- 产品没有零售包装和零售说明书\n\n**我们服务的客户类型：**\n- 汽车配件经销商 / 进口商\n- 电动车经销商和4S店\n- 电商卖家（线上零售）\n- 维修厂 / 安装服务商\n- 工程项目采购\n\n如果您是个人消费者，建议在当地电商平台或线下门店购买零售版本。感谢理解！',
      en: 'Yes, youpei auto exclusively serves B2B wholesale customers.\n\n**Why:**\n- Our pricing is wholesale-based, not suitable for retail\n- Our service model is bulk supply, we do not provide retail-level after-sales\n- Products do not come with retail packaging or retail user manuals\n\n**Customer types we serve:**\n- Auto parts distributors / importers\n- EV dealerships and 4S shops\n- E-commerce sellers (online retail)\n- Repair shops / installation service providers\n- Project procurement\n\nIf you are an individual consumer, we recommend purchasing retail versions from local e-commerce platforms or offline stores. Thank you for understanding!',
    },
    category: 'moq-order',
    order: 3,
    source: 'mock',
    createdAt: Date.now(),
  },
  // ===== After-sales & Support =====
  {
    id: 'faq-013',
    question: { zh: '退换货政策是什么？产品有质量问题怎么办？', en: 'What is the return policy? What if products have quality issues?' },
    answer: {
      zh: '我们的退换货政策如下：\n\n**质量问题退换：**\n- 收货后7天内发现质量问题，可申请退换货\n- 我方承担往返运费（需提供照片/视频证据）\n- 整批质量问题可整批退回或补发\n\n**非质量问题：**\n- 批量订单不支持无理由退货\n- 错发/漏发：核实后免费补发或退款\n- 样品订单不支持退换（除非有质量问题）\n\n**质保期内维修：**\n- 12个月质保期内，非人为损坏免费维修或换新\n- 如需技术支持，请联系我们的售后工程师',
      en: 'Our return and exchange policy:\n\n**Quality issues:**\n- Return/exchange available within 7 days of receipt for quality issues\n- We cover round-trip shipping (photo/video evidence required)\n- Batch quality issues can be returned in full or re-shipped\n\n**Non-quality issues:**\n- Bulk orders do not support returns without reason\n- Wrong/missing items: Free re-shipment or refund after verification\n- Sample orders are non-returnable (unless defective)\n\n**Warranty period repair:**\n- Within 12-month warranty, free repair or replacement for non-man-made damage\n- For technical support, contact our after-sales engineers',
    },
    category: 'moq-order',
    order: 4,
    source: 'mock',
    createdAt: Date.now(),
  },
  {
    id: 'faq-014',
    question: { zh: '可以成为你们的区域代理吗？有什么条件？', en: 'Can I become your regional distributor? What are the requirements?' },
    answer: {
      zh: '我们诚邀各地区代理合作伙伴，合作模式如下：\n\n**代理类型：**\n- **独家代理**：指定国家/地区独家经营权，需承诺年度采购额\n- **普通代理**：享受代理价和销售支持，无独家权限\n- **品牌代理**：代理youpei auto自有品牌产品线\n\n**成为代理的条件：**\n- 有稳定的销售渠道和客户资源\n- 首批订单达到一定金额（根据地区和产品线不同）\n- 承诺年度采购量\n- 配合市场推广活动\n\n**代理支持：**\n- 专属代理价和价格保护\n- 销售培训和技术支持\n- 营销素材支持（图片、视频、文案）\n- 区域客户信息共享\n\n如有意向，请通过WhatsApp联系我们，说明您的地区和业务情况。',
      en: 'We sincerely invite regional distribution partners. Cooperation models:\n\n**Distributor types:**\n- **Exclusive distributor**: Exclusive rights in designated country/region, with annual purchase commitment\n- **Regular distributor**: Distributor pricing and sales support, no exclusivity\n- **Brand distributor**: Distribute youpei auto brand product line\n\n**Requirements:**\n- Stable sales channels and customer base\n- First order meeting minimum amount (varies by region and product line)\n- Annual purchase volume commitment\n- Cooperation with marketing activities\n\n**Distributor support:**\n- Exclusive distributor pricing and price protection\n- Sales training and technical support\n- Marketing materials support (images, videos, copywriting)\n- Regional customer lead sharing\n\nIf interested, contact us via WhatsApp with your region and business profile.',
    },
    category: 'cooperation',
    order: 3,
    source: 'mock',
    createdAt: Date.now(),
  },
  {
    id: 'faq-015',
    question: { zh: '提供技术支持吗？产品安装使用有问题怎么办？', en: 'Do you provide technical support? What if I have installation or usage issues?' },
    answer: {
      zh: '我们提供全方位的技术支持服务：\n\n**技术支持内容：**\n- 产品选型咨询：帮您推荐合适的型号和规格\n- 安装指导：提供安装视频、说明书和技术文档\n- 故障排查：远程协助排查产品问题\n- 兼容性咨询：确认产品与您的车型/设备是否兼容\n\n**支持方式：**\n- WhatsApp在线支持（工作日24h内响应）\n- 邮件技术支持（2个工作日内回复）\n- 视频远程指导（预约制）\n\n**资料支持：**\n- 产品规格书（PDF）\n- 安装说明书（中英文）\n- 产品图片和视频素材\n- 认证证书副本\n\n批发客户可享受优先技术支持服务。',
      en: 'We provide comprehensive technical support services:\n\n**Technical support includes:**\n- Product selection consultation: Help you choose the right models and specs\n- Installation guidance: Installation videos, manuals and technical documentation\n- Troubleshooting: Remote assistance for product issues\n- Compatibility consultation: Confirm product compatibility with your vehicle/equipment\n\n**Support channels:**\n- WhatsApp online support (24h response on business days)\n- Email technical support (reply within 2 business days)\n- Video remote guidance (by appointment)\n\n**Documentation support:**\n- Product specification sheets (PDF)\n- Installation manuals (Chinese & English)\n- Product images and video assets\n- Certification certificate copies\n\nWholesale customers receive priority technical support.',
    },
    category: 'product-cert',
    order: 4,
    source: 'mock',
    createdAt: Date.now(),
  },
];
