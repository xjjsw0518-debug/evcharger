// EXPORTS: IProduct, MOCK_PRODUCTS
export interface IProduct {
  id: string
  name: { zh: string; en: string }
  category: string
  priceMin: number
  priceMax: number
  moq: number
  mainImage: string
  images: string[]
  description: { zh: string; en: string }
  specs: { label: { zh: string; en: string }; value: string }[]
  featured?: boolean
  source?: 'mock' | 'user'
  createdAt: number
}

export const MOCK_PRODUCTS: IProduct[] = [
  {
    id: '1',
    name: { zh: '汽车LED大灯H7', en: 'Car LED Headlight H7' },
    category: 'lighting',
    priceMin: 45,
    priceMax: 120,
    moq: 10,
    mainImage: 'https://picsum.photos/seed/headlight1/400/400',
    images: [
      'https://picsum.photos/seed/headlight1/600/600',
      'https://picsum.photos/seed/headlight2/600/600',
    ],
    description: { zh: '高亮度LED大灯，寿命长能耗低', en: 'High brightness LED headlight, long lifespan' },
    specs: [
      { label: { zh: '材质', en: 'Material' }, value: '铝合金' },
      { label: { zh: '功率', en: 'Power' }, value: '60W' },
    ],
    featured: true,
    source: 'mock',
    createdAt: Date.now(),
  },
  {
    id: '2',
    name: { zh: '车载手机支架', en: 'Car Phone Mount' },
    category: 'gadgets',
    priceMin: 15,
    priceMax: 35,
    moq: 50,
    mainImage: 'https://picsum.photos/seed/phonemount/400/400',
    images: ['https://picsum.photos/seed/phonemount/600/600'],
    description: { zh: '稳固磁吸支架，360度旋转', en: 'Stable magnetic mount, 360° rotation' },
    specs: [
      { label: { zh: '材质', en: 'Material' }, value: 'ABS+硅胶' },
    ],
    featured: true,
    source: 'mock',
    createdAt: Date.now(),
  },
  {
    id: '3',
    name: { zh: '刹车片套装', en: 'Brake Pad Set' },
    category: 'brake',
    priceMin: 80,
    priceMax: 260,
    moq: 20,
    mainImage: 'https://picsum.photos/seed/brakepad/400/400',
    images: ['https://picsum.photos/seed/brakepad/600/600'],
    description: { zh: '陶瓷刹车片，低噪音耐磨', en: 'Ceramic brake pads, low noise, wear resistant' },
    specs: [
      { label: { zh: '材质', en: 'Material' }, value: '陶瓷复合材料' },
    ],
    featured: true,
    source: 'mock',
    createdAt: Date.now(),
  },
]