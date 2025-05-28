'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import { createProperty } from '@/app/actions/property-action';

export default function NewPropertyPage() {
  const [images, setImages] = useState<string[]>([]);

  async function handleSubmit(formData: FormData) {
    try {
      await createProperty(formData);
    } catch (error) {
      console.error('Error creating property:', error);
      alert('Failed to create property. Please try again.');
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Property</h1>
        
        <form action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Property Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="internal_name" className="block text-sm font-medium text-gray-700">
                Internal Name
              </label>
              <input
                type="text"
                id="internal_name"
                name="internal_name"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            {/* Location Information */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <input
                type="text"
                id="zip"
                name="zip"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                id="latitude"
                name="latitude"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                id="longitude"
                name="longitude"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            {/* Property Details */}
            <div>
              <label htmlFor="max_people" className="block text-sm font-medium text-gray-700">
                Max People
              </label>
              <input
                type="number"
                id="max_people"
                name="max_people"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="units" className="block text-sm font-medium text-gray-700">
                Units
              </label>
              <input
                type="number"
                id="units"
                name="units"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                Bedrooms
              </label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
                Bathrooms
              </label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                Area
              </label>
              <input
                type="number"
                step="any"
                id="area"
                name="area"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="area_unit" className="block text-sm font-medium text-gray-700">
                Area Unit
              </label>
              <select
                id="area_unit"
                name="area_unit"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="sqm">Square Meters</option>
                <option value="sqft">Square Feet</option>
              </select>
            </div>

            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                Rating
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                id="rating"
                name="rating"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                Main Image URL
              </label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            {/* Features */}
            <div className="md:col-span-2">
              <label htmlFor="amenities" className="block text-sm font-medium text-gray-700">
                Amenities (comma-separated)
              </label>
              <input
                type="text"
                id="amenities"
                name="amenities"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            {/* Image Upload Section */}
            <div className="md:col-span-2">
              <ImageUpload
                images={images}
                onImagesChange={setImages}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currencies
              </label>
              <div className="space-y-4">
                {/* USD Currency */}
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    id="currency_usd"
                    name="currency_usd"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="currency_usd" className="text-sm text-gray-700">
                    USD (US Dollar)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="usd_forex"
                    name="usd_forex"
                    defaultValue={1.1}
                    placeholder="EUR to USD rate"
                    className="w-32 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                {/* MXN Currency */}
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    id="currency_mxn"
                    name="currency_mxn"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="currency_mxn" className="text-sm text-gray-700">
                    MXN (Mexican Peso)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="mxn_forex"
                    name="mxn_forex"
                    defaultValue={20.0}
                    placeholder="EUR to MXN rate"
                    className="w-32 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hide_address"
                  name="hide_address"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="hide_address" className="ml-2 block text-sm text-gray-700">
                  Hide Address
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="has_addons"
                  name="has_addons"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="has_addons" className="ml-2 block text-sm text-gray-700">
                  Has Addons
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="adults_only"
                  name="adults_only"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="adults_only" className="ml-2 block text-sm text-gray-700">
                  Adults Only
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pets_allowed"
                  name="pets_allowed"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="pets_allowed" className="ml-2 block text-sm text-gray-700">
                  Pets Allowed
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="has_wifi"
                  name="has_wifi"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="has_wifi" className="ml-2 block text-sm text-gray-700">
                  Has WiFi
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="has_meal_plan"
                  name="has_meal_plan"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="has_meal_plan" className="ml-2 block text-sm text-gray-700">
                  Has Meal Plan
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="breakfast_included"
                  name="breakfast_included"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="breakfast_included" className="ml-2 block text-sm text-gray-700">
                  Breakfast Included
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="has_parking"
                  name="has_parking"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="has_parking" className="ml-2 block text-sm text-gray-700">
                  Has Parking
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="show_additional_key_facts"
                  name="show_additional_key_facts"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="show_additional_key_facts" className="ml-2 block text-sm text-gray-700">
                  Show Key Facts
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                  Is Active
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="submit">
              Create Property
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 