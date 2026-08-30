// EXPORTS: IProduct, ISku, IProductDetailSection, MOCK_PRODUCTS
export interface ISku {
  id: string;
  name: { zh: string; en: string };
  price: number;                       // USD 批发价
  stock: number;
  image?: string;
  attributes?: Record<string, string>;
}

export interface IProductDetailSection {
  key: 'features' | 'specification' | 'application' | 'package' | 'warranty' | 'certification';
  title: { zh: string; en: string };
  content: { zh: string; en: string };
  bullets?: { zh: string[]; en: string[] };
}

export interface IProduct {
  id: string;
  name: { zh: string; en: string };
  category: string;           // category id
  priceMin: number;           // USD
  priceMax: number;           // USD
  moq: number;
  mainImage: string;
  images: string[];
  description: { zh: string; en: string };
  specs: { label: { zh: string; en: string }; value: string }[];
  skus?: ISku[];
  detailSections?: IProductDetailSection[];
  featured?: boolean;
  source?: 'mock' | 'user' | 'csv';
  ceCertified?: boolean;
  sniNote?: boolean;          // SNI certification handled by importer
  createdAt: number;
}

const genImg = (seed: string, w = 600, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const mkSkus = (baseId: string, variants: { key: string; zh: string; en: string; price: number; stock: number }[]): ISku[] =>
  variants.map((v, i) => ({
    id: `${baseId}-sku-${i}`,
    name: { zh: v.zh, en: v.en },
    price: v.price,
    stock: v.stock,
    attributes: { type: v.key },
  }));

const buildDetailSections = (opts: {
  features: { zh: string[]; en: string[] };
  application: { zh: string; en: string };
  packageItems: { zh: string[]; en: string[] };
  warranty: { zh: string; en: string };
  certification: { zh: string; en: string };
}): IProductDetailSection[] => [
  {
    key: 'features',
    title: { zh: '产品特点', en: 'Key Features' },
    content: { zh: '优质产品，性能卓越，核心特点如下：', en: 'Premium quality product with excellent performance. Key features:' },
    bullets: opts.features,
  },
  {
    key: 'application',
    title: { zh: '适用场景', en: 'Applications' },
    content: opts.application,
  },
  {
    key: 'package',
    title: { zh: '包装清单', en: 'Package Contents' },
    content: { zh: '包装包含以下物品：', en: 'Package includes the following items:' },
    bullets: opts.packageItems,
  },
  {
    key: 'warranty',
    title: { zh: '质保说明', en: 'Warranty' },
    content: opts.warranty,
  },
  {
    key: 'certification',
    title: { zh: '认证信息', en: 'Certifications' },
    content: opts.certification,
  },
];

export const MOCK_PRODUCTS: IProduct[] = [
  // 1. GBT AC Charging Gun Head (32A 7kW)
  {
    id: 'ev-gun-001',
    name: {
      zh: 'GBT 交流充电枪头 32A 7kW',
      en: 'GBT AC Charging Gun Head (32A 7kW)'
    },
    category: 'charging-guns',
    priceMin: 18, priceMax: 35, moq: 2,
    mainImage: genImg('ev-charging-gun-gbt-32a-black', 600, 600),
    images: [
      genImg('ev-charging-gun-gbt-32a-black', 800, 800),
      genImg('ev-charging-gun-gbt-32a-orange', 800, 800),
      genImg('ev-charging-gun-gbt-32a-side', 800, 800),
      genImg('ev-charging-gun-gbt-32a-detail', 800, 800),
    ],
    description: {
      zh: '新国标 GB/T 交流充电枪头，32A 7kW 最大输出功率，兼容所有国标电动车辆，包括比亚迪、吉利、奇瑞、长安等主流品牌。IP54 全天候防护等级，镀银铜针确保最佳导电性能。人体工学握把设计，插拔手感舒适。',
      en: 'New national standard GB/T AC charging gun head with 32A 7kW maximum output. Compatible with all Chinese standard EVs including BYD, Geely, Chery, and Changan. IP54 weather protection rating. Silver-plated copper pins ensure optimal electrical conductivity. Ergonomic handle design for comfortable plugging and unplugging.'
    },
    specs: [
      { label: { zh: '额定电流', en: 'Rated Current' }, value: '32A' },
      { label: { zh: '额定电压', en: 'Rated Voltage' }, value: '250V AC' },
      { label: { zh: '执行标准', en: 'Standard' }, value: 'GB/T 20234.2-2015' },
      { label: { zh: '防护等级', en: 'Protection Rating' }, value: 'IP54' },
      { label: { zh: '外壳材质', en: 'Housing Material' }, value: 'Thermoplastic + Silver-plated Copper Alloy' },
      { label: { zh: '工作温度', en: 'Working Temp' }, value: '-30°C ~ +50°C' },
      { label: { zh: '插拔次数', en: 'Plug Cycles' }, value: '≥10,000 times' },
    ],
    skus: mkSkus('ev-gun-001', [
      { key: 'black-no-drain', zh: '黑色 / 无泄水孔', en: 'Black / No Drain Hole', price: 18, stock: 500 },
      { key: 'black-drain',    zh: '黑色 / 带泄水孔', en: 'Black / With Drain Hole', price: 22, stock: 400 },
      { key: 'orange-no-drain', zh: '橙色 / 无泄水孔', en: 'Orange / No Drain Hole', price: 20, stock: 300 },
      { key: 'orange-drain',   zh: '橙色 / 带泄水孔', en: 'Orange / With Drain Hole', price: 25, stock: 350 },
    ]),
    detailSections: buildDetailSections({
      features: {
        zh: ['符合 GB/T 20234.2-2015 国家标准', '32A 大电流，支持 7kW 快速充电', 'IP54 防尘防水，全天候使用', '镀银铜针，低阻抗高导电', '人体工学设计，握持舒适', '10000+ 次插拔寿命'],
        en: ['Compliant with GB/T 20234.2-2015 standard', '32A high current, supports 7kW fast charging', 'IP54 dustproof and waterproof, all-weather use', 'Silver-plated copper pins, low impedance high conductivity', 'Ergonomic design, comfortable grip', '10,000+ plug cycle lifespan'],
      },
      application: {
        zh: '适用于所有国标电动汽车交流充电场景，包括家用充电、公共充电站、商业停车场、小区充电桩等。是充电设备制造商和维修服务商的理想选择。',
        en: 'Suitable for all GB/T standard EV AC charging scenarios, including home charging, public charging stations, commercial parking lots, and community chargers. Ideal for charging equipment manufacturers and repair service providers.',
      },
      packageItems: {
        zh: ['1 × GB/T 交流充电枪头', '产品合格证', '使用说明书'],
        en: ['1 × GB/T AC charging gun head', 'Product certificate', 'User manual'],
      },
      warranty: {
        zh: '本产品提供 1 年质保服务，质保期内非人为损坏可免费更换或维修。',
        en: 'This product comes with a 1-year warranty. Free replacement or repair for non-human damage within the warranty period.',
      },
      certification: {
        zh: 'CE 认证。SNI 认证由进口商负责办理。',
        en: 'CE certified. SNI certification handled by importer.',
      },
    }),
    featured: true,
    ceCertified: true,
    sniNote: true,
    createdAt: Date.now(),
  },

  // 2. GB/T to Type 2 EV Charging Adapter (32A)
  {
    id: 'ev-adapter-001',
    name: {
      zh: 'GB/T 转 Type 2 充电转接器 32A',
      en: 'GB/T to Type 2 EV Charging Adapter (32A)'
    },
    category: 'adapters',
    priceMin: 25, priceMax: 45, moq: 2,
    mainImage: genImg('ev-adapter-gbt-type2-32a', 600, 600),
    images: [
      genImg('ev-adapter-gbt-type2-32a', 800, 800),
      genImg('ev-adapter-gbt-type2-side', 800, 800),
      genImg('ev-adapter-gbt-type2-detail', 800, 800),
    ],
    description: {
      zh: '国标 GB/T 转欧标 Type 2 充电转接器，让中国标准电动车能在欧洲 Type 2 充电桩上充电。32A 额定电流，支持单相 7kW 和三相 22kW。紧凑便携设计，即插即用，无需额外工具。',
      en: 'GB/T to Type 2 charging adapter enables Chinese standard EVs to charge on European Type 2 charging stations. 32A rated current, supports both single-phase 7kW and three-phase 22kW. Compact and portable design, plug and play, no additional tools required.'
    },
    specs: [
      { label: { zh: '额定电流', en: 'Rated Current' }, value: '32A' },
      { label: { zh: '额定电压', en: 'Rated Voltage' }, value: '250V / 380V AC' },
      { label: { zh: '防护等级', en: 'Protection Rating' }, value: 'IP54' },
      { label: { zh: '相数', en: 'Phase' }, value: 'Single Phase / Three Phase' },
      { label: { zh: '接口类型', en: 'Connector Type' }, value: 'GB/T male to Type 2 female' },
      { label: { zh: '工作温度', en: 'Working Temp' }, value: '-30°C ~ +50°C' },
    ],
    skus: mkSkus('ev-adapter-001', [
      { key: 'single-phase', zh: '单相 7kW', en: 'Single Phase 7kW', price: 25, stock: 300 },
      { key: 'three-phase',  zh: '三相 22kW', en: 'Three Phase 22kW', price: 45, stock: 200 },
    ]),
    detailSections: buildDetailSections({
      features: {
        zh: ['国标插头转欧标插座', '支持单相/三相充电', 'IP54 防水防尘', '紧凑设计，便于携带', '即插即用，无需配置', '内置温度保护'],
        en: ['GB/T male to Type 2 female', 'Supports single/three phase charging', 'IP54 waterproof and dustproof', 'Compact design, easy to carry', 'Plug and play, no configuration needed', 'Built-in temperature protection'],
      },
      application: {
        zh: '适用于驾驶国标电动车前往欧洲、东南亚等使用 Type 2 充电桩的地区旅行或居住的车主。是跨境出行必备充电配件。',
        en: 'Perfect for GB/T standard EV owners traveling or living in regions with Type 2 charging infrastructure such as Europe and Southeast Asia. An essential charging accessory for cross-border travel.',
      },
      packageItems: {
        zh: ['1 × GB/T 转 Type 2 转接器', '收纳袋', '产品说明书'],
        en: ['1 × GB/T to Type 2 adapter', 'Storage bag', 'User manual'],
      },
      warranty: {
        zh: '本产品提供 1 年质保服务。',
        en: 'This product comes with a 1-year warranty.',
      },
      certification: {
        zh: 'CE 认证。',
        en: 'CE certified.',
      },
    }),
    featured: true,
    ceCertified: true,
    createdAt: Date.now(),
  },

  // 3. Type 2 to GB/T EV Charging Adapter (32A)
  {
    id: 'ev-adapter-002',
    name: {
      zh: 'Type 2 转 GB/T 充电转接器 32A',
      en: 'Type 2 to GB/T EV Charging Adapter (32A)'
    },
    category: 'adapters',
    priceMin: 25, priceMax: 45, moq: 2,
    mainImage: genImg('ev-adapter-type2-gbt-32a', 600, 600),
    images: [
      genImg('ev-adapter-type2-gbt-32a', 800, 800),
      genImg('ev-adapter-type2-gbt-side', 800, 800),
      genImg('ev-adapter-type2-gbt-detail', 800, 800),
    ],
    description: {
      zh: '欧标 Type 2 转国标 GB/T 充电转接器，让欧洲标准电动车能在中国国标充电桩上充电。对于在中国和东南亚使用的进口电动车车主来说是必备配件。32A 额定电流，安全可靠。',
      en: 'Type 2 to GB/T charging adapter allows European standard EVs to charge on Chinese GB/T charging infrastructure. Essential for imported EV owners in China and Southeast Asia. 32A rated current, safe and reliable.'
    },
    specs: [
      { label: { zh: '额定电流', en: 'Rated Current' }, value: '32A' },
      { label: { zh: '额定电压', en: 'Rated Voltage' }, value: '250V / 380V AC' },
      { label: { zh: '防护等级', en: 'Protection Rating' }, value: 'IP54' },
      { label: { zh: '相数', en: 'Phase' }, value: 'Single Phase / Three Phase' },
      { label: { zh: '接口类型', en: 'Connector Type' }, value: 'Type 2 male to GB/T female' },
      { label: { zh: '工作温度', en: 'Working Temp' }, value: '-30°C ~ +50°C' },
    ],
    skus: mkSkus('ev-adapter-002', [
      { key: 'single-phase', zh: '单相 7kW', en: 'Single Phase 7kW', price: 25, stock: 250 },
      { key: 'three-phase',  zh: '三相 22kW', en: 'Three Phase 22kW', price: 45, stock: 180 },
    ]),
    detailSections: buildDetailSections({
      features: {
        zh: ['欧标插头转国标插座', '支持单相/三相充电', 'IP54 防水防尘', '高品质铜导体', '即插即用', '紧凑便携'],
        en: ['Type 2 male to GB/T female', 'Supports single/three phase charging', 'IP54 waterproof and dustproof', 'High quality copper conductor', 'Plug and play', 'Compact and portable'],
      },
      application: {
        zh: '适用于在中国、东南亚等使用国标充电桩的地区驾驶进口欧洲品牌电动车的车主，如特斯拉欧洲版、保时捷、奥迪、宝马等。',
        en: 'Suitable for imported European EV owners in regions with GB/T charging infrastructure such as China and Southeast Asia. Works with Tesla European version, Porsche, Audi, BMW, etc.',
      },
      packageItems: {
        zh: ['1 × Type 2 转 GB/T 转接器', '收纳袋', '产品说明书'],
        en: ['1 × Type 2 to GB/T adapter', 'Storage bag', 'User manual'],
      },
      warranty: {
        zh: '本产品提供 1 年质保服务。',
        en: 'This product comes with a 1-year warranty.',
      },
      certification: {
        zh: 'CE 认证。',
        en: 'CE certified.',
      },
    }),
    featured: true,
    ceCertified: true,
    createdAt: Date.now(),
  },

  // 4. Portable AC EV Charger 7kW 32A (GBT, BYD Compatible)
  {
    id: 'ev-charger-001',
    name: {
      zh: '便携式交流充电桩 7kW 32A（国标，比亚迪兼容）',
      en: 'Portable AC EV Charger 7kW 32A (GBT, BYD Compatible)'
    },
    category: 'portable-chargers',
    priceMin: 85, priceMax: 145, moq: 2,
    mainImage: genImg('ev-portable-charger-7kw-gbt', 600, 600),
    images: [
      genImg('ev-portable-charger-7kw-gbt', 800, 800),
      genImg('ev-portable-charger-7kw-display', 800, 800),
      genImg('ev-portable-charger-7kw-cable', 800, 800),
      genImg('ev-portable-charger-7kw-scene', 800, 800),
    ],
    description: {
      zh: '便携式 2 级交流充电桩，最大输出 7kW 32A。电流可通过按钮从 8A 到 32A 自由调节，适配不同电路负载。内置 B 型剩余电流保护器，最大程度保障充电安全。IP67 防水等级，室内外均可使用。兼容比亚迪、吉利、奇瑞等所有国标电动车。',
      en: 'Portable Level 2 EV charger with 7kW 32A maximum output. Current adjustable from 8A to 32A via button to match different circuit loads. Built-in Type B residual current device for maximum charging safety. IP67 waterproof rating, suitable for both indoor and outdoor use. Compatible with BYD, Geely, Chery and all GB/T standard electric vehicles.'
    },
    specs: [
      { label: { zh: '最大功率', en: 'Max Power' }, value: '7kW' },
      { label: { zh: '电流可调', en: 'Adjustable Current' }, value: '8/10/13/16/20/26/28/32A' },
      { label: { zh: '额定电压', en: 'Rated Voltage' }, value: '110-250V AC' },
      { label: { zh: '线缆长度', en: 'Cable Length' }, value: '5m / 10m' },
      { label: { zh: '防护等级', en: 'Protection Rating' }, value: 'IP67' },
      { label: { zh: '漏电保护', en: 'RCD Type' }, value: 'Type B (AC 30mA + DC 6mA)' },
      { label: { zh: '接口标准', en: 'Connector Standard' }, value: 'GB/T' },
    ],
    skus: mkSkus('ev-charger-001', [
      { key: '5m-no-lcd',   zh: '5米线 / 无LCD屏',   en: '5m Cable / No LCD',    price: 85,  stock: 200 },
      { key: '5m-lcd',      zh: '5米线 / 带LCD屏',   en: '5m Cable / With LCD', price: 105, stock: 180 },
      { key: '10m-no-lcd',  zh: '10米线 / 无LCD屏',  en: '10m Cable / No LCD',   price: 120, stock: 120 },
      { key: '10m-lcd',     zh: '10米线 / 带LCD屏',  en: '10m Cable / With LCD', price: 145, stock: 100 },
    ]),
    detailSections: buildDetailSections({
      features: {
        zh: ['7kW 32A 大功率输出', '8-32A 多档电流可调', 'Type B 漏电保护器', 'IP67 整机防水', '便携设计，随车携带', '兼容所有国标电动车', '多重安全保护：过压/欠压/过流/过温'],
        en: ['7kW 32A high power output', '8-32A multi-level adjustable current', 'Type B residual current device', 'IP67 full unit waterproof', 'Portable design, car-friendly', 'Compatible with all GB/T standard EVs', 'Multiple safety protections: OV/UV/OC/OT'],
      },
      application: {
        zh: '适用于家庭充电、办公场所充电、长途旅行应急充电等场景。特别适合没有固定充电桩的车主或经常出差的用户。',
        en: 'Suitable for home charging, office charging, emergency charging during long trips, etc. Especially ideal for EV owners without fixed charging stations or frequent travelers.',
      },
      packageItems: {
        zh: ['1 × 便携式交流充电桩', '1 × 国标充电枪（含线缆）', '1 × 电源插头', '收纳包', '使用说明书'],
        en: ['1 × Portable AC EV charger', '1 × GB/T charging gun (with cable)', '1 × Power plug', 'Storage bag', 'User manual'],
      },
      warranty: {
        zh: '本产品提供 2 年质保服务，人为损坏除外。',
        en: 'This product comes with a 2-year warranty, excluding human damage.',
      },
      certification: {
        zh: 'CE 认证。SNI 认证由进口商负责办理。',
        en: 'CE certified. SNI certification handled by importer.',
      },
    }),
    featured: true,
    ceCertified: true,
    sniNote: true,
    createdAt: Date.now(),
  },

  // 5. GBT AC Charging Gun Head (Gun Only, No Cable)
  {
    id: 'ev-gun-002',
    name: {
      zh: 'GBT 交流充电枪头（单枪头，不含线）',
      en: 'GBT AC Charging Gun Head (Gun Only, No Cable)'
    },
    category: 'charging-guns',
    priceMin: 15, priceMax: 28, moq: 5,
    mainImage: genImg('ev-charging-gun-head-only', 600, 600),
    images: [
      genImg('ev-charging-gun-head-only', 800, 800),
      genImg('ev-charging-gun-head-orange', 800, 800),
      genImg('ev-charging-gun-head-pins', 800, 800),
    ],
    description: {
      zh: '替换用国标 GB/T 交流充电枪头（不含线缆），专为充电桩制造商和维修服务商设计。32A 额定电流，镀银铜针导电性能优异。可自行焊接或压接线缆，灵活适配不同长度和规格的线缆需求。',
      en: 'Replacement GB/T AC charging gun head without cable, designed for charging station manufacturers and repair service providers. 32A rated current with silver-plated copper pins for excellent conductivity. Can be soldered or crimped to cables, flexibly adaptable to different lengths and specifications.'
    },
    specs: [
      { label: { zh: '额定电流', en: 'Rated Current' }, value: '32A' },
      { label: { zh: '额定电压', en: 'Rated Voltage' }, value: '250V AC' },
      { label: { zh: '执行标准', en: 'Standard' }, value: 'GB/T 20234.2-2015' },
      { label: { zh: '防护等级', en: 'Protection Rating' }, value: 'IP54' },
      { label: { zh: '类型', en: 'Type' }, value: 'Replacement gun head only' },
    ],
    skus: mkSkus('ev-gun-002', [
      { key: 'black',  zh: '黑色', en: 'Black',  price: 15, stock: 600 },
      { key: 'orange', zh: '橙色', en: 'Orange', price: 18, stock: 400 },
    ]),
    detailSections: buildDetailSections({
      features: {
        zh: ['仅枪头，不含线缆', '32A 额定电流', '镀银铜针', 'IP54 防护', '适合自制/维修', '符合国标'],
        en: ['Gun head only, no cable included', '32A rated current', 'Silver-plated copper pins', 'IP54 protection', 'Ideal for DIY / repair', 'GB/T standard compliant'],
      },
      application: {
        zh: '适用于充电桩生产厂家组装生产、维修服务商更换损坏枪头、DIY 爱好者自制充电线等场景。',
        en: 'Suitable for charging station manufacturers assembly, repair services replacing damaged gun heads, DIY enthusiasts building custom charging cables, etc.',
      },
      packageItems: {
        zh: ['1 × GB/T 交流充电枪头（无线）', '产品合格证'],
        en: ['1 × GB/T AC charging gun head (no cable)', 'Product certificate'],
      },
      warranty: {
        zh: '本产品提供 1 年质保服务。',
        en: 'This product comes with a 1-year warranty.',
      },
      certification: {
        zh: 'CE 认证。',
        en: 'CE certified.',
      },
    }),
    ceCertified: true,
    createdAt: Date.now(),
  },

  // 6. GBT EV Charging Cable (5m / 10m, 32A)
  {
    id: 'ev-cable-001',
    name: {
      zh: 'GBT 电动汽车充电线 5米/10米 32A',
      en: 'GBT EV Charging Cable (5m / 10m, 32A)'
    },
    category: 'cables',
    priceMin: 30, priceMax: 65, moq: 2,
    mainImage: genImg('ev-charging-cable-gbt-32a', 600, 600),
    images: [
      genImg('ev-charging-cable-gbt-32a', 800, 800),
      genImg('ev-charging-cable-coiled', 800, 800),
      genImg('ev-charging-cable-detail', 800, 800),
    ],
    description: {
      zh: '高品质 TPE 绝缘充电线缆，32A 7kW 承载能力。柔软耐用，耐油、抗紫外线、耐高低温。提供 5 米和 10 米两种长度可选，可选择双头枪或枪+插头配置。符合国标标准，安全可靠。',
      en: 'High quality TPE insulated charging cable with 32A 7kW capacity. Flexible and durable, resistant to oil, UV, and extreme temperatures. Available in 5m and 10m lengths, choose between double gun or gun+plug configurations. GB/T standard compliant, safe and reliable.'
    },
    specs: [
      { label: { zh: '额定电流', en: 'Rated Current' }, value: '32A' },
      { label: { zh: '额定电压', en: 'Rated Voltage' }, value: '250V AC' },
      { label: { zh: '长度', en: 'Length' }, value: '5m / 10m' },
      { label: { zh: '线缆材质', en: 'Cable Material' }, value: 'TPE flexible cable' },
      { label: { zh: '接口配置', en: 'Connector Config' }, value: 'GB/T both ends / GB/T to plug' },
    ],
    skus: mkSkus('ev-cable-001', [
      { key: '5m-dual',   zh: '5米 / 双头枪', en: '5m / Dual Gun',  price: 30, stock: 300 },
      { key: '5m-plug',   zh: '5米 / 枪+插头', en: '5m / Gun+Plug', price: 35, stock: 250 },
      { key: '10m-dual',  zh: '10米 / 双头枪', en: '10m / Dual Gun', price: 50, stock: 180 },
      { key: '10m-plug',  zh: '10米 / 枪+插头', en: '10m / Gun+Plug', price: 65, stock: 150 },
    ]),
    detailSections: buildDetailSections({
      features: {
        zh: ['32A 7kW 大电流承载', 'TPE 材质，柔软耐用', '耐油、抗紫外线、耐高低温', '国标 GB/T 接口', '多长度/配置可选', '阻燃材质'],
        en: ['32A 7kW high current capacity', 'TPE material, flexible and durable', 'Oil/UV/temperature resistant', 'GB/T standard connector', 'Multiple lengths/configurations', 'Flame retardant material'],
      },
      application: {
        zh: '适用于家用充电延长、公共充电桩延长线、车载备用充电线等场景。',
        en: 'Suitable for home charging extension, public charger extension cable, on-board spare charging cable, etc.',
      },
      packageItems: {
        zh: ['1 × 国标充电线', '收纳束带', '产品说明书'],
        en: ['1 × GB/T charging cable', 'Cable tie', 'User manual'],
      },
      warranty: {
        zh: '本产品提供 1 年质保服务。',
        en: 'This product comes with a 1-year warranty.',
      },
      certification: {
        zh: 'CE 认证。',
        en: 'CE certified.',
      },
    }),
    ceCertified: true,
    createdAt: Date.now(),
  },

  // 7. GBT AC Charging Socket (Vehicle Side Inlet)
  {
    id: 'ev-socket-001',
    name: {
      zh: 'GBT 交流充电插座（车端入口）',
      en: 'GBT AC Charging Socket (Vehicle Side Inlet)'
    },
    category: 'sockets-connectors',
    priceMin: 12, priceMax: 25, moq: 5,
    mainImage: genImg('ev-charging-socket-vehicle-side', 600, 600),
    images: [
      genImg('ev-charging-socket-vehicle-side', 800, 800),
      genImg('ev-charging-socket-locking', 800, 800),
      genImg('ev-charging-socket-back', 800, 800),
    ],
    description: {
      zh: '国标 GB/T 车端交流充电入口插座，适用于电动车改装项目和替换维修。32A 额定电流，结构坚固耐用。可选标准款和带锁款，满足不同安全需求。',
      en: 'GB/T standard vehicle side AC charging inlet socket, suitable for EV conversion projects and replacement repairs. 32A rated current with robust construction. Available in standard and locking versions to meet different safety requirements.'
    },
    specs: [
      { label: { zh: '额定电流', en: 'Rated Current' }, value: '32A' },
      { label: { zh: '额定电压', en: 'Rated Voltage' }, value: '250V AC' },
      { label: { zh: '执行标准', en: 'Standard' }, value: 'GB/T 20234.2-2015' },
      { label: { zh: '类型', en: 'Type' }, value: 'Vehicle side inlet socket' },
      { label: { zh: '安装方式', en: 'Mounting' }, value: 'Panel mount' },
    ],
    skus: mkSkus('ev-socket-001', [
      { key: 'standard', zh: '标准款', en: 'Standard',   price: 12, stock: 400 },
      { key: 'locking',  zh: '带锁款', en: 'With Lock',  price: 25, stock: 200 },
    ]),
    detailSections: buildDetailSections({
      features: {
        zh: ['国标车端入口插座', '32A 额定电流', '面板式安装', '坚固耐用结构', '标准款/带锁款可选', '耐高温材质'],
        en: ['GB/T vehicle side inlet socket', '32A rated current', 'Panel mount installation', 'Robust and durable construction', 'Standard / locking versions', 'High temperature resistant material'],
      },
      application: {
        zh: '适用于电动汽车改装项目、老款车辆充电口更换、新能源车辆维修配件等场景。',
        en: 'Suitable for EV conversion projects, older vehicle charging port replacement, new energy vehicle repair parts, etc.',
      },
      packageItems: {
        zh: ['1 × 国标车端充电插座', '安装螺丝配件包', '产品说明书'],
        en: ['1 × GB/T vehicle side charging socket', 'Mounting screw accessory kit', 'User manual'],
      },
      warranty: {
        zh: '本产品提供 1 年质保服务。',
        en: 'This product comes with a 1-year warranty.',
      },
      certification: {
        zh: 'CE 认证。',
        en: 'CE certified.',
      },
    }),
    ceCertified: true,
    createdAt: Date.now(),
  },

  // 8. Charging Gun Lock + Anti-theft Buckle + Waterproof Dust Cap Kit
  {
    id: 'ev-acc-001',
    name: {
      zh: '充电枪防盗锁+防盗扣+防水防尘盖套装',
      en: 'Charging Gun Lock + Anti-theft Buckle + Waterproof Dust Cap Kit'
    },
    category: 'accessories',
    priceMin: 5, priceMax: 15, moq: 10,
    mainImage: genImg('ev-charging-gun-lock-kit', 600, 600),
    images: [
      genImg('ev-charging-gun-lock-kit', 800, 800),
      genImg('ev-charging-gun-lock-detail', 800, 800),
      genImg('ev-charging-dust-cap', 800, 800),
    ],
    description: {
      zh: '充电枪完整配件套装，包含防盗锁（防止充电过程中枪被偷拔）、防盗扣和防水防尘盖（不用时保护接口）。通用适配国标/欧标充电枪，安装简单，是每位电车车主的必备配件。',
      en: 'Complete accessory kit for EV charging guns. Includes security lock to prevent theft during charging, anti-theft buckle, and waterproof dust cap to protect the connector when not in use. Universal fit for GB/T and Type 2 charging guns. Easy to install, an essential accessory for every EV owner.'
    },
    specs: [
      { label: { zh: '套装内容', en: 'Kit Includes' }, value: 'Lock + Anti-theft buckle + Dust cap' },
      { label: { zh: '适用接口', en: 'Compatible Connectors' }, value: 'GB/T / Type 2 (universal fit)' },
      { label: { zh: '材质', en: 'Material' }, value: 'ABS + Silicone + Metal' },
      { label: { zh: '防尘盖防护', en: 'Dust Cap Protection' }, value: 'IP54 when covered' },
    ],
    skus: mkSkus('ev-acc-001', [
      { key: 'gbt',    zh: 'GBT款',   en: 'GB/T Version',  price: 5,  stock: 1000 },
      { key: 'type2',  zh: 'Type2款', en: 'Type 2 Version', price: 8, stock: 800 },
    ]),
    detailSections: buildDetailSections({
      features: {
        zh: ['三件套齐全', '防盗锁防止偷拔', '防尘防水保护接口', '通用适配国标/欧标', '安装简便', '优质耐用材质'],
        en: ['Complete 3-piece kit', 'Security lock prevents theft', 'Dustproof and waterproof connector protection', 'Universal fit for GB/T / Type 2', 'Easy installation', 'High quality durable materials'],
      },
      application: {
        zh: '适用于所有国标和欧标电动车车主，特别是在公共充电桩充电时防止充电枪被偷拔，以及户外停放时保护充电接口。',
        en: 'Suitable for all GB/T and Type 2 EV owners, especially when charging at public stations to prevent theft, and for protecting the charging port during outdoor parking.',
      },
      packageItems: {
        zh: ['1 × 充电枪防盗锁', '1 × 防盗扣', '1 × 防水防尘盖', '使用说明书'],
        en: ['1 × Charging gun security lock', '1 × Anti-theft buckle', '1 × Waterproof dust cap', 'User manual'],
      },
      warranty: {
        zh: '本产品提供 3 个月质保服务。',
        en: 'This product comes with a 3-month warranty.',
      },
      certification: {
        zh: '符合环保要求。',
        en: 'Environmental compliance certified.',
      },
    }),
    createdAt: Date.now(),
  },

  // 9. Charging Station Waterproof Connector + High Voltage Harness Connector
  {
    id: 'ev-conn-001',
    name: {
      zh: '充电桩防水连接器 + 高压线束连接器',
      en: 'Charging Station Waterproof Connector + High Voltage Harness Connector'
    },
    category: 'sockets-connectors',
    priceMin: 8, priceMax: 20, moq: 5,
    mainImage: genImg('ev-waterproof-connector-hv', 600, 600),
    images: [
      genImg('ev-waterproof-connector-hv', 800, 800),
      genImg('ev-connector-2pin', 800, 800),
      genImg('ev-connector-5pin', 800, 800),
    ],
    description: {
      zh: '充电桩安装和高压线束连接用防水连接器，IP67 防护等级，适合户外安装使用。提供 2 芯、3 芯、5 芯多种针脚配置可选，满足不同功率和信号传输需求。阻燃材质，安全可靠。',
      en: 'Waterproof connectors for EV charging station installation and high voltage harness connections. IP67 protection rating, suitable for outdoor installation. Available in 2-pin, 3-pin, and 5-pin configurations to meet different power and signal transmission needs. Flame retardant material, safe and reliable.'
    },
    specs: [
      { label: { zh: '防护等级', en: 'Protection Rating' }, value: 'IP67 waterproof' },
      { label: { zh: '电压等级', en: 'Voltage Rating' }, value: 'High voltage rated' },
      { label: { zh: '针脚配置', en: 'Pin Configurations' }, value: '2-pin / 3-pin / 5-pin' },
      { label: { zh: '材质', en: 'Material' }, value: 'Flame retardant PA66 + Copper alloy' },
      { label: { zh: '安装方式', en: 'Mounting' }, value: 'Panel / cable mount' },
    ],
    skus: mkSkus('ev-conn-001', [
      { key: '2pin', zh: '2芯', en: '2-pin', price: 8,  stock: 500 },
      { key: '3pin', zh: '3芯', en: '3-pin', price: 12, stock: 450 },
      { key: '5pin', zh: '5芯', en: '5-pin', price: 20, stock: 300 },
    ]),
    detailSections: buildDetailSections({
      features: {
        zh: ['IP67 防水等级', '多种针脚配置', '高压额定', '阻燃材质', '铜合金端子', '户外安装适用'],
        en: ['IP67 waterproof rating', 'Multiple pin configurations', 'High voltage rated', 'Flame retardant material', 'Copper alloy terminals', 'Suitable for outdoor installation'],
      },
      application: {
        zh: '适用于充电桩生产安装、高压线束组装、电动汽车改装项目、工业电气连接等场景。',
        en: 'Suitable for charging station manufacturing and installation, high voltage harness assembly, EV conversion projects, industrial electrical connections, etc.',
      },
      packageItems: {
        zh: ['1 × 防水连接器（公母一对）', '密封胶圈', '产品说明书'],
        en: ['1 × Waterproof connector (male+female pair)', 'Sealing gasket', 'User manual'],
      },
      warranty: {
        zh: '本产品提供 1 年质保服务。',
        en: 'This product comes with a 1-year warranty.',
      },
      certification: {
        zh: 'CE 认证。',
        en: 'CE certified.',
      },
    }),
    ceCertified: true,
    createdAt: Date.now(),
  },

  // 10. V2L Vehicle to Load Discharge Adapter (BYD Compatible)
  {
    id: 'ev-v2l-001',
    name: {
      zh: 'V2L 车外放电适配器（比亚迪兼容）',
      en: 'V2L Vehicle to Load Discharge Adapter (BYD Compatible)'
    },
    category: 'v2l-discharge',
    priceMin: 35, priceMax: 60, moq: 2,
    mainImage: genImg('ev-v2l-discharge-adapter-byd', 600, 600),
    images: [
      genImg('ev-v2l-discharge-adapter-byd', 800, 800),
      genImg('ev-v2l-discharge-outlets', 800, 800),
      genImg('ev-v2l-camping-scene', 800, 800),
      genImg('ev-v2l-power-strip', 800, 800),
    ],
    description: {
      zh: 'V2L（Vehicle to Load）车外放电适配器，将电动车充电口转换为常规交流电源输出。完美适配比亚迪 ATTO 3、汉、唐、宋、海豹等支持 V2L 功能的车型。3.3kW/4kW 输出，内置多功能排插，露营、户外活动、应急备电必备神器。',
      en: 'V2L (Vehicle to Load) discharge adapter transforms your EV charging port into a standard AC power outlet. Perfectly compatible with BYD ATTO 3, Han, Tang, Song, Seal and other V2L-enabled EVs. 3.3kW/4kW output with built-in universal power strip. Essential for camping, outdoor activities, and emergency power backup.'
    },
    specs: [
      { label: { zh: '最大功率', en: 'Max Power' }, value: '3.3kW / 4kW' },
      { label: { zh: '额定电流', en: 'Rated Current' }, value: '16A' },
      { label: { zh: '输出电压', en: 'Output Voltage' }, value: '110-240V AC' },
      { label: { zh: '输入接口', en: 'Input Connector' }, value: 'GB/T plug' },
      { label: { zh: '输出接口', en: 'Output Socket' }, value: 'Universal outlet (multi-type)' },
      { label: { zh: '兼容车型', en: 'Compatible Models' }, value: 'BYD ATTO 3 / Han / Tang / Song / Seal etc.' },
    ],
    skus: mkSkus('ev-v2l-001', [
      { key: 'cn-33kw',  zh: '国标插座 / 3.3kW', en: 'CN Socket / 3.3kW', price: 35, stock: 250 },
      { key: 'cn-4kw',   zh: '国标插座 / 4kW',   en: 'CN Socket / 4kW',   price: 45, stock: 200 },
      { key: 'eu-33kw',  zh: '欧标插座 / 3.3kW', en: 'EU Socket / 3.3kW', price: 40, stock: 180 },
      { key: 'us-33kw',  zh: '美标插座 / 3.3kW', en: 'US Socket / 3.3kW', price: 42, stock: 150 },
    ]),
    detailSections: buildDetailSections({
      features: {
        zh: ['V2L 车外放电功能', '3.3kW/4kW 大功率输出', '内置多功能排插', '兼容比亚迪全系 V2L 车型', '安全保护：过载/短路/过温', '便携式设计', '露营/应急必备'],
        en: ['V2L vehicle to load discharge', '3.3kW/4kW high power output', 'Built-in universal power strip', 'Compatible with BYD V2L models', 'Safety protections: OCP/SCP/OTP', 'Portable design', 'Essential for camping / emergencies'],
      },
      application: {
        zh: '适用于户外露营、野餐、家庭应急停电备电、夜市摆摊、工地临时供电等场景。让你的电动车秒变移动电站。',
        en: 'Suitable for outdoor camping, picnics, home emergency power backup, night market stalls, construction site temporary power supply, and more. Turn your EV into a mobile power station in seconds.',
      },
      packageItems: {
        zh: ['1 × V2L 放电适配器', '收纳袋', '使用说明书'],
        en: ['1 × V2L discharge adapter', 'Storage bag', 'User manual'],
      },
      warranty: {
        zh: '本产品提供 1 年质保服务。',
        en: 'This product comes with a 1-year warranty.',
      },
      certification: {
        zh: 'CE 认证。',
        en: 'CE certified.',
      },
    }),
    featured: true,
    ceCertified: true,
    createdAt: Date.now(),
  },

  // 11. 7kW 32A GBT Portable AC EV Charger with LCD Display (IP54)
  {
    id: 'ev-charger-002',
    name: {
      zh: '7kW 32A 国标便携交流充电桩 带LCD显示屏（IP54）',
      en: '7kW 32A GBT Portable AC EV Charger with LCD Display (IP54)'
    },
    category: 'portable-chargers',
    priceMin: 95, priceMax: 155, moq: 2,
    mainImage: genImg('ev-portable-charger-lcd-ip54', 600, 600),
    images: [
      genImg('ev-portable-charger-lcd-ip54', 800, 800),
      genImg('ev-portable-charger-lcd-display', 800, 800),
      genImg('ev-portable-charger-lcd-side', 800, 800),
      genImg('ev-portable-charger-lcd-outdoor', 800, 800),
    ],
    description: {
      zh: '高端便携式电动汽车充电桩，配备 1.3 英寸 LCD 显示屏，实时显示充电电压、电流、功率、温度等状态。7kW 32A 输出功率，多档电流可调。IP54 全天候防护等级，内置 B 型漏电保护。兼容所有国标电动车，是追求品质的车主和批发商的首选。',
      en: 'Premium portable EV charger featuring a 1.3 inch LCD display showing real-time charging status including voltage, current, power, and temperature. 7kW 32A output with adjustable current levels. IP54 all-weather protection rating with built-in Type B leakage protection. Compatible with all GB/T standard electric vehicles. The top choice for quality-conscious EV owners and wholesalers.'
    },
    specs: [
      { label: { zh: '最大功率', en: 'Max Power' }, value: '7kW' },
      { label: { zh: '电流调节', en: 'Adjustable Current' }, value: '32A (multi-level)' },
      { label: { zh: '显示屏', en: 'Display' }, value: '1.3 inch LCD (V/A/P/T)' },
      { label: { zh: '防护等级', en: 'Protection Rating' }, value: 'IP54' },
      { label: { zh: '线缆长度', en: 'Cable Length' }, value: '5m / 10m' },
      { label: { zh: '漏电保护', en: 'RCD' }, value: 'Type B (AC 30mA + DC 6mA)' },
      { label: { zh: '接口', en: 'Connector' }, value: 'GB/T' },
    ],
    skus: mkSkus('ev-charger-002', [
      { key: '5m-cn',  zh: '5米 / 国标插头', en: '5m / CN Plug', price: 95,  stock: 150 },
      { key: '5m-eu',  zh: '5米 / 欧标插头', en: '5m / EU Plug', price: 105, stock: 120 },
      { key: '10m-cn', zh: '10米 / 国标插头', en: '10m / CN Plug', price: 135, stock: 100 },
      { key: '10m-eu', zh: '10米 / 欧标插头', en: '10m / EU Plug', price: 155, stock: 80 },
    ]),
    detailSections: buildDetailSections({
      features: {
        zh: ['1.3 英寸 LCD 显示屏', '实时显示电压/电流/功率/温度', '7kW 32A 大功率', 'IP54 全天候防护', 'Type B 漏电保护', '多档电流可调', '5米/10米线缆可选', '国标/欧标插头可选'],
        en: ['1.3 inch LCD display', 'Real-time V/A/P/T display', '7kW 32A high power', 'IP54 all-weather protection', 'Type B RCD protection', 'Adjustable current levels', '5m / 10m cable options', 'CN / EU plug options'],
      },
      application: {
        zh: '适用于家庭充电、出差旅行、商务出行等多种场景。实时显示充电数据，让充电过程一目了然。特别适合对充电安全有高要求的用户。',
        en: 'Suitable for home charging, business trips, travel, and various scenarios. Real-time charging data display makes the charging process transparent. Especially suitable for users with high charging safety requirements.',
      },
      packageItems: {
        zh: ['1 × 便携式 LCD 充电桩', '1 × 国标充电枪（含线缆）', '1 × 电源插头', '便携收纳包', '使用说明书'],
        en: ['1 × Portable LCD EV charger', '1 × GB/T charging gun (with cable)', '1 × Power plug', 'Carrying bag', 'User manual'],
      },
      warranty: {
        zh: '本产品提供 2 年质保服务。',
        en: 'This product comes with a 2-year warranty.',
      },
      certification: {
        zh: 'CE 认证。SNI 认证由进口商负责办理。',
        en: 'CE certified. SNI certification handled by importer.',
      },
    }),
    featured: true,
    ceCertified: true,
    sniNote: true,
    createdAt: Date.now(),
  },

  // 12. EV Charging Cable Organizer + Wall Mount Holder
  {
    id: 'ev-acc-002',
    name: {
      zh: '电动汽车充电线收纳架 + 壁挂支架',
      en: 'EV Charging Cable Organizer + Wall Mount Holder'
    },
    category: 'accessories',
    priceMin: 8, priceMax: 18, moq: 5,
    mainImage: genImg('ev-cable-organizer-wall-mount', 600, 600),
    images: [
      genImg('ev-cable-organizer-wall-mount', 800, 800),
      genImg('ev-cable-organizer-mounted', 800, 800),
      genImg('ev-cable-organizer-detail', 800, 800),
    ],
    description: {
      zh: '壁挂式充电线缆收纳架和枪托支架，让你的充电线缆整齐有序，避免拖拽和踩踏损坏。耐候材质构造，适合户外安装。通用适配国标和欧标充电枪，安装简单，是家用充电桩的必备配件。',
      en: 'Wall mounted charging cable organizer and gun holder keeps your charging cable tidy and protected from dragging and stepping damage. Weather resistant construction suitable for outdoor installation. Universal fit for GB/T and Type 2 charging guns. Easy to install, an essential accessory for home charging stations.'
    },
    specs: [
      { label: { zh: '安装方式', en: 'Mounting' }, value: 'Wall mount' },
      { label: { zh: '功能', en: 'Function' }, value: 'Holds charging gun and cable' },
      { label: { zh: '材质', en: 'Material' }, value: 'Weather resistant ABS / Steel' },
      { label: { zh: '适配接口', en: 'Compatible Connectors' }, value: 'Universal (GB/T / Type 2)' },
    ],
    skus: mkSkus('ev-acc-002', [
      { key: 'gbt',    zh: 'GBT款',    en: 'GB/T Version',   price: 8,  stock: 500 },
      { key: 'type2',  zh: 'Type2款',  en: 'Type 2 Version', price: 10, stock: 400 },
      { key: 'universal', zh: '通用款', en: 'Universal',     price: 18, stock: 300 },
    ]),
    detailSections: buildDetailSections({
      features: {
        zh: ['壁挂式设计，节省空间', '同时收纳线缆和枪头', '耐候材质，户外适用', '通用适配国标/欧标', '安装简便', '坚固耐用'],
        en: ['Wall mount design, space saving', 'Stores both cable and gun', 'Weather resistant, outdoor suitable', 'Universal fit GB/T / Type 2', 'Easy installation', 'Sturdy and durable'],
      },
      application: {
        zh: '适用于家庭车库、小区充电桩、商业充电站等场所，整理收纳充电线缆，延长线缆使用寿命。',
        en: 'Suitable for home garages, community charging stations, commercial charging stations, etc. Organizes charging cables and extends cable service life.',
      },
      packageItems: {
        zh: ['1 × 充电线缆壁挂收纳架', '安装螺丝包', '安装说明书'],
        en: ['1 × EV cable wall mount organizer', 'Mounting screw kit', 'Installation manual'],
      },
      warranty: {
        zh: '本产品提供 1 年质保服务。',
        en: 'This product comes with a 1-year warranty.',
      },
      certification: {
        zh: '符合环保和安全标准。',
        en: 'Environmental and safety compliance certified.',
      },
    }),
    createdAt: Date.now(),
  },
];
