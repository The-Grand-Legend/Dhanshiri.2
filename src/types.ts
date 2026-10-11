export type Lang = 'bn' | 'en'

export type Badge = 'bestseller' | 'hot' | 'popular' | 'new' | 'dessert'

export interface MenuItem {
  id: string
  nameBn: string
  nameEn: string
  descBn: string
  descEn: string
  price: number
  category: string
  badge: Badge | ''
  image: string
  available: boolean
}

export interface Booking {
  id: string
  name: string
  phone: string
  date: string
  time: string
  guests: number
  payment: 'bkash' | 'nagad' | 'card' | 'cash'
  amount: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

export interface CartLine {
  id: string
  qty: number
}

export interface OrderItem {
  id: string
  nameEn: string
  nameBn: string
  price: number
  qty: number
}

export type OrderStatus = 'placed' | 'preparing' | 'on-the-way' | 'delivered'

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  customer: string
  phone: string
  address: string
  payment: 'bkash' | 'nagad' | 'card' | 'cash'
  status: OrderStatus
  createdAt: string
}

export interface GalleryItem {
  id: string
  url: string
  titleBn: string
  titleEn: string
  category: 'interior' | 'food' | 'event'
}

export interface Offer {
  id: string
  titleBn: string
  titleEn: string
  descBn: string
  descEn: string
  code: string
  discount: number
  active: boolean
}

export interface Notice {
  id: string
  titleBn: string
  titleEn: string
  bodyBn: string
  bodyEn: string
  date: string
  pinned: boolean
}

export interface Review {
  id: string
  name: string
  rating: number
  comment: string
  date: string
}

export interface EventBooking {
  id: string
  name: string
  phone: string
  date: string
  guests: number
  type: string
  fullRoom: boolean
  amount: number
  createdAt: string
}

export interface Settings {
  password: string
  tableBookingPrice: number
  partyHallPrice: number
  deliveryCharge: number
  phone: string
  address: string
  hours: string
}

export interface AppData {
  menu: MenuItem[]
  bookings: Booking[]
  orders: Order[]
  gallery: GalleryItem[]
  offers: Offer[]
  notices: Notice[]
  reviews: Review[]
  events: EventBooking[]
  settings: Settings
}

export interface Notification {
  id: string
  titleBn: string
  titleEn: string
  bodyBn: string
  bodyEn: string
  kind: 'order' | 'booking' | 'event' | 'general'
  createdAt: string
}
