"use client";

import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Property } from '@/app/types/models';

export const metadata: Metadata = {
  title: 'Edit Property',
  description: 'Edit property details',
};

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch property');
        }
        const data = await response.json();
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params.id]);

  async function handleSubmit(formData: FormData) {
    'use server';
    
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      redirect('/cms/login');
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.get('name'),
          internal_name: formData.get('internal_name'),
          description: formData.get('description'),
          latitude: parseFloat(formData.get('latitude') as string),
          longitude: parseFloat(formData.get('longitude') as string),
          address: formData.get('address'),
          hide_address: formData.get('hide_address') === 'true',
          zip: formData.get('zip'),
          city: formData.get('city'),
          state: formData.get('state'),
          country: formData.get('country'),
          images: (formData.get('images') as string).split(',').map(url => ({ url: url.trim() })),
          has_addons: formData.get('has_addons') === 'true',
          rating: parseFloat(formData.get('rating') as string),
          is_active: formData.get('is_active') === 'true',
          currencies: JSON.parse(formData.get('currencies') as string),
          
          // Room fields
          amenities: {
            additionalProp: (formData.get('amenities') as string).split(',').map(amenity => ({
              name: amenity.trim(),
              prefix: '',
              bracket: '',
              text: ''
            }))
          },
          breakfast_included: formData.get('breakfast_included') === 'true',
          has_parking: formData.get('has_parking') === 'true',
          adults_only: formData.get('adults_only') === 'true',
          pets_allowed: formData.get('pets_allowed') === 'true',
          show_additional_key_facts: formData.get('show_additional_key_facts') === 'true',
          image_url: formData.get('image_url'),
          max_people: parseInt(formData.get('max_people') as string),
          units: parseInt(formData.get('units') as string),
          has_wifi: formData.get('has_wifi') === 'true',
          has_meal_plan: formData.get('has_meal_plan') === 'true',
          bedrooms: parseInt(formData.get('bedrooms') as string),
          bathrooms: parseInt(formData.get('bathrooms') as string),
          area_unit: formData.get('area_unit'),
          area: parseFloat(formData.get('area') as string)
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update property');
      }

      redirect('/cms/properties');
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Property</h1>
        
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
                defaultValue={property.name}
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
                defaultValue={property.internal_name}
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
                defaultValue={property.description}
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
                defaultValue={property.address}
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
                defaultValue={property.city}
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
                defaultValue={property.state}
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
                defaultValue={property.country}
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
                defaultValue={property.zip}
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
                defaultValue={property.latitude}
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
                defaultValue={property.longitude}
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
                defaultValue={property.max_people}
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
                defaultValue={property.bedrooms}
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
                defaultValue={property.bathrooms}
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
                defaultValue={property.area}
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
                defaultValue={property.area_unit}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="sqm">Square Meters</option>
                <option value="sqft">Square Feet</option>
              </select>
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
                defaultValue={property.amenities.additionalProp.map(a => a.name).join(', ')}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                Image URLs (comma-separated)
              </label>
              <input
                type="text"
                id="images"
                name="images"
                defaultValue={property.images.map(img => img.url).join(', ')}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="currencies" className="block text-sm font-medium text-gray-700">
                Currencies (JSON array)
              </label>
              <textarea
                id="currencies"
                name="currencies"
                rows={4}
                required
                defaultValue={JSON.stringify(property.currencies, null, 2)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            {/* Checkboxes */}
            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hide_address"
                  name="hide_address"
                  defaultChecked={property.hide_address}
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
                  defaultChecked={property.has_addons}
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
                  defaultChecked={property.adults_only}
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
                  defaultChecked={property.pets_allowed}
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
                  defaultChecked={property.has_wifi}
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
                  defaultChecked={property.has_meal_plan}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="has_meal_plan" className="ml-2 block text-sm text-gray-700">
                  Has Meal Plan
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  defaultChecked={property.is_active}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                  Is Active
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 