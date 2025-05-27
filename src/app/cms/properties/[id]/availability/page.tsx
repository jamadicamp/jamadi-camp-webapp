import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ClientButton } from '@/components/ui/client-button';
import { Property } from '@/app/types/models';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import { Calendar } from '@/components/ui/calendar';

export const metadata: Metadata = {
  title: 'Manage Availability',
  description: 'Manage property availability',
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

export default async function AvailabilityPage({
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

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cms/properties/${params.id}/availability`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${token}`,
      },
      body: JSON.stringify({
        blockedDates: formData.get('blockedDates'),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update availability');
    }

    redirect('/cms');
  }

  const blockedDates = property.availability?.blockedDates?.map(date => ({
    from: new Date(date.from),
    to: new Date(date.to),
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Availability
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <form action={handleSubmit} className="space-y-8">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Blocked Dates
                    </label>
                    <div className="mt-1">
                      <Calendar
                        mode="range"
                        selected={blockedDates[0]}
                        className="rounded-md border"
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