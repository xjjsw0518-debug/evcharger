// EXPORTS: ICategory, MOCK_CATEGORIES
export interface ICategory {
  id: string
  name: { zh: string; en: string }
  icon: string
  order: number
}

export const MOCK_CATEGORIES: ICategory[] = [
  { id: 'smart-driving', name: { zh: '智能驾驶系统', en: 'Smart Driving' }, icon: 'Cpu', order: 1 },
  { id: 'car-gadgets', name: { zh: '汽车用品', en: 'Car Gadgets' }, icon: 'Zap', order: 2 },
  { id: 'styling', name: { zh: '外观改装', en: 'Styling & Body' }, icon: 'Sparkles', order: 3 },
  { id: 'dashboard', name: { zh: '仪表监测', en: 'Dashboard & Gauges' }, icon: 'Gauge', order: 4 },
  { id: 'engine', name: { zh: '发动机配件', en: 'Engine Parts' }, icon: 'Settings', order: 5 },
  { id: 'wheels-tires', name: { zh: '轮毂轮胎', en: 'Wheels & Tires' }, icon: 'Circle', order: 6 },
  { id: 'interior', name: { zh: '内饰装饰', en: 'Interior Decor' }, icon: 'Car', order: 7 },
  { id: 'brake-systems', name: { zh: '刹车系统', en: 'Brake Systems' }, icon: 'OctagonPaused', order: 8 },
  { id: 'car-care', name: { zh: '汽车养护', en: 'Car Care' }, icon: 'Droplets', order: 9 },
  { id: 'phone-holders', name: { zh: '手机支架', en: 'Phone Holders' }, icon: 'Smartphone', order: 10 },
  { id: 'safety', name: { zh: '安全防盗', en: 'Safety & Security' }, icon: 'Shield', order: 11 },
  { id: 'storage', name: { zh: '收纳整理', en: 'Storage & Organizers' }, icon: 'Package', order: 12 },
]