export interface Property {
  _id: string;
  name: string;
  internal_name: string;
  description: {
    en: string;
    es: string;
  };
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  amenities: string[];
  pricing: {
    usd: {
      perNight: number;
      cleaningFee: number;
      serviceFee: number;
    };
    mxn: {
      perNight: number;
      cleaningFee: number;
      serviceFee: number;
    };
  };
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  availability: {
    blockedDates: DateRange[];
  };
  createdAt: Date;
  updatedAt: Date;
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