// EXPORTS: IBrand, MOCK_BRANDS
export interface IBrand {
  id: string
  name: string
  logoUrl: string
}

export const MOCK_BRANDS: IBrand[] = [
  {
    id: '1',
    name: 'Bosch',
    logoUrl: 'https://www.bosch.com.cn/assets/img/bosch-logo.svg',
  },
  {
    id: '2',
    name: '3M',
    logoUrl: 'https://www.3m.com.cn/3MCompany/assets/3m-logo.svg',
  },
  {
    id: '3',
    name: 'Xiaomi',
    logoUrl: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-com-images/logo-mi2.png',
  },
  {
    id: '4',
    name: 'Baseus',
    logoUrl: 'https://www.baseus.com/Uploads/logo/index_logo.png',
  },
  {
    id: '5',
    name: 'Lenovo',
    logoUrl: 'https://www.lenovo.com.cn/medias/logo.svg',
  },
  {
    id: '6',
    name: 'Philips',
    logoUrl: 'https://www.philips.com.cn/etc.clientlibs/settings/wcm/designs/philips-respiratory/clientlib/resources/img/philips-logo-blue.svg',
  },
]