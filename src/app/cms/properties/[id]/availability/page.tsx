'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { updateProperty } from '@/app/actions/property-action';
import { Property } from '@/app/types/models';

export default function AvailabilityPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError('Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params.id]);

  const handleSubmit = async (formData: FormData) => {
    try {
      await updateProperty(params.id, formData);
      router.back();
    } catch (error) {
      console.error('Error updating property:', error);
      setError('Failed to update property');
    }
  };

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
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

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
                    defaultChecked={property.currencies.some(c => c.code === 'USD')}
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
                    defaultValue={property.currencies.find(c => c.code === 'USD')?.euro_forex || 1.1}
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
                    defaultChecked={property.currencies.some(c => c.code === 'MXN')}
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
                    defaultValue={property.currencies.find(c => c.code === 'MXN')?.euro_forex || 20.0}
                    placeholder="EUR to MXN rate"
                    className="w-32 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>
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