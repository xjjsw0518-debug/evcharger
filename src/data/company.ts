// EXPORTS: ICompany, MOCK_COMPANY
export interface ICompany {
  id: string
  name: { zh: string; en: string }
  shortName: string
  slogan: { zh: string; en: string }
  heroTitle: { zh: string; en: string }
  heroSubtitle: { zh: string; en: string }
  description: { zh: string; en: string }
  foundedYear: number
  skuCount: string
  exportCountries: string
  advantages: {
    icon: string
    title: { zh: string; en: string }
    description: { zh: string; en: string }
  }[]
  process: {
    step: number
    title: { zh: string; en: string }
    description: { zh: string; en: string }
  }[]
  contact: {
    email: string
    whatsapp: string
    wechat: string
    address: { zh: string; en: string }
  }
}

export const MOCK_COMPANY: ICompany = {
  id: '1',
  name: {
    zh: '优配电动汽车充电配件有限公司',
    en: 'Youpei EV Charging Accessories Co., Ltd.'
  },
  shortName: 'Youpei Auto',
  slogan: {
    zh: '中国EV充电配件批发供应商 - 工厂直供 · CE认证',
    en: 'China EV Charging Accessories Wholesale Supplier - Factory Direct · CE Certified'
  },
  heroTitle: {
    zh: '专业EV充电配件批发供应商',
    en: 'Professional EV Charging Accessories Wholesale Supplier'
  },
  heroSubtitle: {
    zh: '工厂直供 · MOQ低至2件 · CE认证 · 全球发货',
    en: 'Factory Direct · MOQ From 2 pcs · CE Certified · Global Shipping'
  },
  description: {
    zh: '优配EV充电是一家专注于电动汽车充电配件的专业供应商，拥有多年行业经验，产品涵盖充电枪、转接器、便携式充电桩、充电线缆、插座连接器、V2L放电器等7大品类。我们的产品全部通过CE认证，出口全球80+国家和地区，尤其在东南亚市场拥有丰富的服务经验。我们坚持"品质第一、客户至上"的经营理念，为全球B端批发客户提供一站式EV充电配件采购解决方案。',
    en: 'Youpei EV Charging is a specialized supplier focused on electric vehicle charging accessories with years of industry experience. Our product range covers 7 major categories including charging guns, adapters, portable chargers, charging cables, sockets & connectors, V2L discharge adapters, and accessories. All our products are CE certified and exported to 80+ countries worldwide, with extensive experience especially in the Southeast Asian market. We adhere to the business philosophy of "Quality First, Customer First", providing one-stop EV charging accessories procurement solutions for B2B wholesale customers globally.'
  },
  foundedYear: 2018,
  skuCount: '500+',
  exportCountries: '80+',
  advantages: [
    {
      icon: 'Factory',
      title: { zh: '工厂直供价格', en: 'Factory Direct Price' },
      description: { zh: '自有工厂，省去中间环节，批发价更优', en: 'Own factory, no middlemen, better wholesale pricing' }
    },
    {
      icon: 'ShieldCheck',
      title: { zh: 'CE认证品质', en: 'CE Certified Quality' },
      description: { zh: '全系列CE认证，产品安全有保障', en: 'Full range CE certified, product safety guaranteed' }
    },
    {
      icon: 'Package',
      title: { zh: '品类齐全', en: 'Complete Product Range' },
      description: { zh: '7大品类500+SKU，一站式采购', en: '7 categories, 500+ SKUs, one-stop sourcing' }
    },
    {
      icon: 'Truck',
      title: { zh: '低MOQ起订', en: 'Low MOQ' },
      description: { zh: '2件起订，支持小批量试单', en: 'MOQ from 2 pcs, small trial orders supported' }
    },
    {
      icon: 'Settings',
      title: { zh: 'OEM/ODM定制', en: 'OEM/ODM Customization' },
      description: { zh: '支持贴牌定制，打造自有品牌', en: 'Private label available, build your own brand' }
    }
  ],
  process: [
    {
      step: 1,
      title: { zh: '询盘', en: 'Inquiry' },
      description: { zh: '发送产品需求和数量', en: 'Send product requirements and quantity' }
    },
    {
      step: 2,
      title: { zh: '报价', en: 'Quotation' },
      description: { zh: '24小时内提供详细报价', en: 'Provide detailed quote within 24 hours' }
    },
    {
      step: 3,
      title: { zh: '样品', en: 'Sample' },
      description: { zh: '可提供样品确认品质', en: 'Samples available for quality confirmation' }
    },
    {
      step: 4,
      title: { zh: '下单', en: 'Order' },
      description: { zh: '确认订单签订合同', en: 'Confirm order and sign contract' }
    },
    {
      step: 5,
      title: { zh: '生产质检', en: 'Production & QC' },
      description: { zh: '生产完成后全检', en: 'Full inspection after production' }
    },
    {
      step: 6,
      title: { zh: '发货', en: 'Shipping' },
      description: { zh: '安排物流发往全球', en: 'Arrange logistics to ship worldwide' }
    },
    {
      step: 7,
      title: { zh: '售后', en: 'After-sales' },
      description: { zh: '完善售后保障服务', en: 'Comprehensive after-sales support' }
    }
  ],
  contact: {
    email: 'sales@youpei-auto.com',
    whatsapp: '+86 138-0000-0000',
    wechat: 'youpei_auto',
    address: {
      zh: '中国广东省广州市白云区汽配产业园A栋',
      en: 'Building A, Auto Parts Industrial Park, Baiyun District, Guangzhou, Guangdong, China'
    }
  }
}