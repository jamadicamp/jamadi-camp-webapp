import mongoose from 'mongoose';
import { Property } from '@/app/types/models';

const propertySchema = new mongoose.Schema<Property>({
  name: { type: String, required: true },
  internal_name: { type: String, required: true },
  description: {
    en: { type: String, required: true },
    es: { type: String, required: true },
  },
  location: {
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  images: [{ type: String, required: true }],
  amenities: [{ type: String, required: true }],
  pricing: {
    usd: {
      perNight: { type: Number, required: true },
      cleaningFee: { type: Number, required: true },
      serviceFee: { type: Number, required: true },
    },
    mxn: {
      perNight: { type: Number, required: true },
      cleaningFee: { type: Number, required: true },
      serviceFee: { type: Number, required: true },
    },
  },
  maxGuests: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  availability: {
    blockedDates: [{
      from: { type: Date, required: true },
      to: { type: Date, required: true },
    }],
  },
}, {
  timestamps: true,
});

export default mongoose.models.Property || mongoose.model<Property>('Property', propertySchema); 