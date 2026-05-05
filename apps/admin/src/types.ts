// ── Shared type definitions for the admin app ──

export interface AdminData {
  id: string
  name: string
  role: string
  login: string
  email: string
  device: string
  ip: string
  last: string
  risk: 'LOW' | 'HIGH' | 'MEDIUM'
  time: string
  event: string
}

export interface Episode {
  code: string
  name: string
  price: string
}

export interface Product {
  code: string
  name: string
  price: string
  type: 'MOVIE' | 'SERIES'
  genre: string
  description: string
  totalEpisodes: number
  episodes: Episode[]
}

export interface CastMember {
  code: string
  name: string
  role: string
}

export interface Cast {
  code: string
  name: string
  type: 'MOVIE' | 'SERIES'
  cast: CastMember[]
}

export interface Customer {
  code: string
  name: string
  phone: string
  email: string
  country: string
  dob: string
}

export interface SignupFormData {
  email: string
  fullname: string
  username: string
  phone: string
  birthdate: string
  password: string
  confirmPassword: string
}

export interface Column {
  key: string
  label: string
}

export interface SalesSummaryRow {
  product: string
  name: string
  quantity: number
  revenue: number
}

export interface SalesChartDataPoint {
  date: string
  [key: string]: string | number
}

export interface ChartSeries {
  key: string
  label: string
  color: string
  dash?: boolean
  total?: number
}

export interface LovProduct {
  code: string
  name: string
  price: string
}
