import { Room } from "./Room"

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PropertiesV2Response {
  count: number
  items: Property[]
}

export interface Property {
  id: number
  name: string
  internal_name: string
  description: string
  latitude: number
  longitude: number
  address: string
  hide_address: boolean
  zip: string
  city: string
  state: string
  country: string
  image_url: string
  has_addons: boolean
  has_agreement: boolean
  agreement_text: any
  agreement_url: any
  contact: Contact
  rating: number
  price_unit_in_days: number
  min_price: number
  original_min_price: number
  max_price: number
  original_max_price: number
  rooms: Partial<Room>[]
  in_out_max_date: string
  in_out: any
  currency_code: string
  created_at: string
  updated_at: string
  is_active: boolean
  subscription_plans: string[]
}

export interface Contact {
  spoken_languages: any[]
}

export interface InOut {
  is_restricted: boolean
  check_in: CheckIn[]
  check_out: CheckOut[]
  not_available: NotAvailable[]
}

export interface CheckIn {
  date: string
  for: string
}

export interface CheckOut {
  date: string
  for: string
}

export interface NotAvailable {
  date: string
  for: string
}
