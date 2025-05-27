import mongoose from 'mongoose';
import { Property } from '@/app/types/models';

const propertySchema = new mongoose.Schema<Property>({
  name: { type: String, required: true },
  internal_name: { type: String, required: true },
  description: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String, required: true },
  hide_address: { type: Boolean, default: false },
  zip: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  images: [{
    url: { type: String, required: true }
  }],
  has_addons: { type: Boolean, default: false },
  rating: { type: Number, default: 5 },
  is_active: { type: Boolean, default: true },
  currencies: [{
    id: { type: Number, required: true },
    code: { type: String, required: true },
    name: { type: String, required: true },
    euro_forex: { type: Number, required: true },
    symbol: { type: String, required: true }
  }],
  
  // Room fields merged into Property
  amenities: {
    additionalProp: [{
      name: { type: String, required: true },
      prefix: { type: String, default: '' },
      bracket: { type: String, default: '' },
      text: { type: String, default: '' }
    }]
  },
  breakfast_included: { type: Boolean, default: false },
  has_parking: { type: Boolean, default: false },
  adults_only: { type: Boolean, default: false },
  pets_allowed: { type: Boolean, default: false },
  show_additional_key_facts: { type: Boolean, default: false },
  image_url: { type: String },
  max_people: { type: Number, required: true },
  units: { type: Number, default: 1 },
  has_wifi: { type: Boolean, default: false },
  has_meal_plan: { type: Boolean, default: false },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  area_unit: { type: String, required: true },
  area: { type: Number, required: true },
  availability: {
    blockedDates: [{
      from: { type: Date, required: true },
      to: { type: Date, required: true },
    }],
    unavailableDays: [{
      date: { type: Date, required: true },
      reason: { 
        type: String, 
        required: true,
        enum: ['maintenance', 'booking', 'owner_use', 'seasonal_closure', 'other']
      },
      description: { type: String, default: '' },
      bookingId: { type: String, default: null },
      bookingGuestName: { type: String, default: null },
      bookingContactInfo: { type: String, default: null },
      createdAt: { type: Date, default: Date.now },
      createdBy: { type: String, required: true } // User ID who created this entry
    }]
  },
}, {
  timestamps: true,
});

export default mongoose.models.Property || mongoose.model<Property>('Property', propertySchema); 