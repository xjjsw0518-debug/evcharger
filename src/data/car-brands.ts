// EXPORTS: ICarBrand, MOCK_CAR_BRANDS
export interface ICarBrand {
  id: string;
  name: string;        // 英文品牌名（用于匹配）
  nameCn: string;      // 中文品牌名
  logoText: string;    // logo 展示文字
  color: string;       // 品牌主色（hex）
  country: string;     // 国别（英文）
  countryCn: string;   // 国别（中文）
  origin: { zh: string; en: string };  // 产地展示文本
  order: number;
}

const zhCountryMap: Record<string, string> = {
  China: '中国',
  Japan: '日本',
  USA: '美国',
  Germany: '德国',
  Korea: '韩国',
};

export const MOCK_CAR_BRANDS: ICarBrand[] = [
  { id: 'byd',       name: 'BYD',              nameCn: '比亚迪',   logoText: 'BYD',        color: '#CC0000', country: 'China',    countryCn: '中国',   origin: { zh: '中国', en: 'China' },    order: 1  },
  { id: 'chery',     name: 'Chery',            nameCn: '奇瑞',     logoText: 'CHERY',      color: '#C8102E', country: 'China',    countryCn: '中国',   origin: { zh: '中国', en: 'China' },    order: 2  },
  { id: 'geely',     name: 'Geely',            nameCn: '吉利',     logoText: 'GEELY',      color: '#003366', country: 'China',    countryCn: '中国',   origin: { zh: '中国', en: 'China' },    order: 3  },
  { id: 'greatwall', name: 'Great Wall',       nameCn: '长城',     logoText: 'GWM',        color: '#000000', country: 'China',    countryCn: '中国',   origin: { zh: '中国', en: 'China' },    order: 4  },
  { id: 'changan',   name: 'Changan',          nameCn: '长安',     logoText: 'CHANGAN',    color: '#005BAC', country: 'China',    countryCn: '中国',   origin: { zh: '中国', en: 'China' },    order: 5  },
  { id: 'toyota',    name: 'Toyota',           nameCn: '丰田',     logoText: 'TOYOTA',     color: '#EB0A1E', country: 'Japan',    countryCn: '日本',   origin: { zh: '日本', en: 'Japan' },    order: 6  },
  { id: 'honda',     name: 'Honda',            nameCn: '本田',     logoText: 'Honda',      color: '#C8102E', country: 'Japan',    countryCn: '日本',   origin: { zh: '日本', en: 'Japan' },    order: 7  },
  { id: 'nissan',    name: 'Nissan',           nameCn: '日产',     logoText: 'NISSAN',     color: '#C8102E', country: 'Japan',    countryCn: '日本',   origin: { zh: '日本', en: 'Japan' },    order: 8  },
  { id: 'mazda',     name: 'Mazda',            nameCn: '马自达',   logoText: 'MAZDA',      color: '#9D0019', country: 'Japan',    countryCn: '日本',   origin: { zh: '日本', en: 'Japan' },    order: 9  },
  { id: 'tesla',     name: 'Tesla',            nameCn: '特斯拉',   logoText: 'TESLA',      color: '#CC0000', country: 'USA',      countryCn: '美国',   origin: { zh: '美国', en: 'USA' },      order: 10 },
  { id: 'ford',      name: 'Ford',             nameCn: '福特',     logoText: 'FORD',       color: '#003478', country: 'USA',      countryCn: '美国',   origin: { zh: '美国', en: 'USA' },      order: 11 },
  { id: 'gm',        name: 'GM',               nameCn: '通用',     logoText: 'GM',         color: '#0072CE', country: 'USA',      countryCn: '美国',   origin: { zh: '美国', en: 'USA' },      order: 12 },
  { id: 'volkswagen',name: 'Volkswagen',       nameCn: '大众',     logoText: 'VW',         color: '#003366', country: 'Germany',  countryCn: '德国',   origin: { zh: '德国', en: 'Germany' },  order: 13 },
  { id: 'bmw',       name: 'BMW',              nameCn: '宝马',     logoText: 'BMW',        color: '#0066B1', country: 'Germany',  countryCn: '德国',   origin: { zh: '德国', en: 'Germany' },  order: 14 },
  { id: 'mercedes',  name: 'Mercedes-Benz',    nameCn: '奔驰',     logoText: 'MERCEDES',   color: '#00A9E0', country: 'Germany',  countryCn: '德国',   origin: { zh: '德国', en: 'Germany' },  order: 15 },
  { id: 'audi',      name: 'Audi',             nameCn: '奥迪',     logoText: 'AUDI',       color: '#000000', country: 'Germany',  countryCn: '德国',   origin: { zh: '德国', en: 'Germany' },  order: 16 },
  { id: 'hyundai',   name: 'Hyundai',          nameCn: '现代',     logoText: 'HYUNDAI',    color: '#002C5F', country: 'Korea',    countryCn: '韩国',   origin: { zh: '韩国', en: 'Korea' },    order: 17 },
  { id: 'kia',       name: 'Kia',              nameCn: '起亚',     logoText: 'KIA',        color: '#E50000', country: 'Korea',    countryCn: '韩国',   origin: { zh: '韩国', en: 'Korea' },    order: 18 },
];
