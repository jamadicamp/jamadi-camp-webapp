import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ClientButton } from '@/components/ui/client-button';
import { Property } from '@/app/types/models';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';

export const metadata: Metadata = {
  title: 'Edit Property',
  description: 'Edit property details',
};

async function getProperty(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cms/properties/${id}`, {
    headers: {
      Cookie: `token=${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch property');
  }

  return response.json();
}

export default async function EditPropertyPage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/cms/login');
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key'
    );
    
    await jwtVerify(token, secret);
  } catch {
    redirect('/cms/login');
  }

  const property: Property = await getProperty(params.id);

  async function handleSubmit(formData: FormData) {
    'use server';

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cms/properties/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${token}`,
      },
      body: JSON.stringify({
        name: formData.get('name'),
        internal_name: formData.get('internal_name'),
        description: {
          en: formData.get('descriptionEn'),
          es: formData.get('descriptionEs'),
        },
        location: {
          address: formData.get('address'),
          coordinates: {
            lat: parseFloat(formData.get('lat') as string),
            lng: parseFloat(formData.get('lng') as string),
          },
        },
        pricing: {
          usd: {
            perNight: parseFloat(formData.get('usdPerNight') as string),
            cleaningFee: parseFloat(formData.get('usdCleaningFee') as string),
            serviceFee: parseFloat(formData.get('usdServiceFee') as string),
          },
          mxn: {
            perNight: parseFloat(formData.get('mxnPerNight') as string),
            cleaningFee: parseFloat(formData.get('mxnCleaningFee') as string),
            serviceFee: parseFloat(formData.get('mxnServiceFee') as string),
          },
        },
        maxGuests: parseInt(formData.get('maxGuests') as string),
        bedrooms: parseInt(formData.get('bedrooms') as string),
        bathrooms: parseInt(formData.get('bathrooms') as string),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update property');
    }

    redirect('/cms');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Property
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <form action={handleSubmit} className="space-y-8">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Property Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        defaultValue={property.name}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="internal_name" className="block text-sm font-medium text-gray-700">
                      Internal Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="internal_name"
                        id="internal_name"
                        defaultValue={property.internal_name}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="descriptionEn" className="block text-sm font-medium text-gray-700">
                      Description (English)
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="descriptionEn"
                        name="descriptionEn"
                        rows={3}
                        defaultValue={property.description.en}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="descriptionEs" className="block text-sm font-medium text-gray-700">
                      Description (Spanish)
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="descriptionEs"
                        name="descriptionEs"
                        rows={3}
                        defaultValue={property.description.es}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        defaultValue={property.location.address}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="lat" className="block text-sm font-medium text-gray-700">
                      Latitude
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        step="any"
                        name="lat"
                        id="lat"
                        defaultValue={property.location.coordinates.lat}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="lng" className="block text-sm font-medium text-gray-700">
                      Longitude
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        step="any"
                        name="lng"
                        id="lng"
                        defaultValue={property.location.coordinates.lng}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="usdPerNight" className="block text-sm font-medium text-gray-700">
                      USD Per Night
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        step="0.01"
                        name="usdPerNight"
                        id="usdPerNight"
                        defaultValue={property.pricing.usd.perNight}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="usdCleaningFee" className="block text-sm font-medium text-gray-700">
                      USD Cleaning Fee
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        step="0.01"
                        name="usdCleaningFee"
                        id="usdCleaningFee"
                        defaultValue={property.pricing.usd.cleaningFee}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="usdServiceFee" className="block text-sm font-medium text-gray-700">
                      USD Service Fee
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        step="0.01"
                        name="usdServiceFee"
                        id="usdServiceFee"
                        defaultValue={property.pricing.usd.serviceFee}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="mxnPerNight" className="block text-sm font-medium text-gray-700">
                      MXN Per Night
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        step="0.01"
                        name="mxnPerNight"
                        id="mxnPerNight"
                        defaultValue={property.pricing.mxn.perNight}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="mxnCleaningFee" className="block text-sm font-medium text-gray-700">
                      MXN Cleaning Fee
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        step="0.01"
                        name="mxnCleaningFee"
                        id="mxnCleaningFee"
                        defaultValue={property.pricing.mxn.cleaningFee}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="mxnServiceFee" className="block text-sm font-medium text-gray-700">
                      MXN Service Fee
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        step="0.01"
                        name="mxnServiceFee"
                        id="mxnServiceFee"
                        defaultValue={property.pricing.mxn.serviceFee}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700">
                      Max Guests
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="maxGuests"
                        id="maxGuests"
                        defaultValue={property.maxGuests}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                      Bedrooms
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="bedrooms"
                        id="bedrooms"
                        defaultValue={property.bedrooms}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
                      Bathrooms
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="bathrooms"
                        id="bathrooms"
                        defaultValue={property.bathrooms}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <ClientButton
                  type="button"
                  variant="outline"
                  onClick={() => window.location.href = '/cms'}
                  className="mr-3"
                >
                  Cancel
                </ClientButton>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 