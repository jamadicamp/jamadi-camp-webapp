/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Property {
  _id?: string;
  id: string;
  name: string;
  internal_name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  hide_address: boolean;
  zip: string;
  city: string;
  state: string;
  country: string;
  images: { url: string }[];
  has_addons: boolean;
  has_agreement: boolean;
  agreement_text?: string;
  agreement_url?: string;
  contact: {
    spoken_languages: string[];
  };
  rating: number;
  price_unit_in_days: number;
  min_price: number;
  max_price: number;
  currency_code: string;
  is_active: boolean;
  currencies: {
    id: number;
    code: string;
    name: string;
    euro_forex: number;
    symbol: string;
  }[];
  subscription_plans: string[];
  amenities: {
    additionalProp: {
      name: string;
      prefix: string;
      bracket: string;
      text: string;
    }[];
  };
  breakfast_included: boolean;
  has_parking: boolean;
  adults_only: boolean;
  pets_allowed: boolean;
  show_additional_key_facts: boolean;
  image_url?: string;
  max_people: number;
  units: number;
  has_wifi: boolean;
  has_meal_plan: boolean;
  bedrooms: number;
  bathrooms: number;
  area_unit: string;
  area: number;
  availability: {
    blockedDates: {
      from: Date;
      to: Date;
    }[];
  };
}

export interface Image {
  alt?: string;
  url: string;
  src?: string;
  text?: string;
}

export interface Amenities {
  additionalProp: AdditionalProp[];
}

export interface AdditionalProp {
  name: string;
  prefix: string;
  bracket: string;
  text: string;
}

export interface Contact {
  spoken_languages: any[];
}

export interface InOut {
  is_restricted: boolean;
  check_in: CheckIn[];
  check_out: CheckOut[];
  not_available: NotAvailable[];
}

export interface CheckIn {
  date: string;
  for: string;
}

export interface CheckOut {
  date: string;
  for: string;
}

export interface NotAvailable {
  date: string;
  for: string;
}

export interface Currency {
  id: number;
  code: string;
  name: string;
  euro_forex: number;
  symbol: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'helper';
  createdAt: Date;
  updatedAt: Date;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

// Keep the existing Property and Room types for the external API
export * from './Property';
export * from './Room'; 