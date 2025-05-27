export interface Property {
  id: number;
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
  images: Image[];
  has_addons: boolean;
  rating: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  currencies: Currency[];
  
  // Room fields merged into Property
  amenities: Amenities;
  breakfast_included: boolean;
  has_parking: boolean;
  adults_only: boolean;
  pets_allowed: boolean;
  show_additional_key_facts: boolean;
  image_url: string;
  max_people: number;
  units: number;
  has_wifi: boolean;
  has_meal_plan: boolean;
  bedrooms: number;
  bathrooms: number;
  area_unit: string;
  area: number;
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