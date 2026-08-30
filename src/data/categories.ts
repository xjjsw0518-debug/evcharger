// EXPORTS: ICategory, MOCK_CATEGORIES
export interface ICategory {
  id: string
  name: { zh: string; en: string }
  icon: string
  order: number
}

export const MOCK_CATEGORIES: ICategory[] = [
  { id: 'charging-guns',       name: { zh: '充电枪', en: 'Charging Guns' },                  icon: 'Zap',        order: 1 },
  { id: 'adapters',            name: { zh: '转接器', en: 'Adapters' },                        icon: 'Plug',       order: 2 },
  { id: 'portable-chargers',   name: { zh: '便携充电器', en: 'Portable Chargers' },           icon: 'Battery',    order: 3 },
  { id: 'cables',              name: { zh: '充电线缆', en: 'Cables' },                        icon: 'Cable',      order: 4 },
  { id: 'sockets-connectors',  name: { zh: '插座与连接器', en: 'Sockets & Connectors' },       icon: 'Socket',     order: 5 },
  { id: 'v2l-discharge',       name: { zh: 'V2L外放电', en: 'V2L Discharge' },                icon: 'Zap',        order: 6 },
  { id: 'car-power-station',   name: { zh: '车载移动电源', en: 'Car Power Stations' },         icon: 'BatteryCharging', order: 7 },
  { id: 'accessories',         name: { zh: '配件周边', en: 'Accessories' },                   icon: 'Package',    order: 8 },
]
