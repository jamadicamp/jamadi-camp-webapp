"use client";

import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Property Availability',
  description: 'Manage property availability',
};

interface Property {
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
}

export default function AvailabilityPage({ params }: { params: { id: string } }) {
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
          units: parseInt(formData.get('units') as string),
          max_people: parseInt(formData.get('max_people') as string),
          is_active: formData.get('is_active') === 'true',
          currencies: JSON.parse(formData.get('currencies') as string)
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
        <h1 className="text-3xl font-bold mb-8">Property Availability</h1>
        
        <form action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="units" className="block text-sm font-medium text-gray-700">
                Available Units
              </label>
              <input
                type="number"
                id="units"
                name="units"
                defaultValue={property.units}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="max_people" className="block text-sm font-medium text-gray-700">
                Maximum People
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

            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  defaultChecked={property.is_active}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                  Active
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