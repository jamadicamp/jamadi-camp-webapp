import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ClientButton } from '@/components/ui/client-button';
import { Property } from '@/app/types/models';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import PropertyList from './components/PropertyList';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'CMS Dashboard',
  description: 'Content Management System Dashboard',
};

async function getProperties() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cms/properties`, {
    headers: {
      Cookie: `token=${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch properties');
  }

  return response.json();
}

export default async function CMSPage() {
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

  const properties: Property[] = await getProperties();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            CMS Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <form action="/api/auth/logout" method="POST">
              <Button variant="outline" type="submit">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Properties
            </h2>
            <Link href="/cms/properties/new">
              <ClientButton>
                Create Property
              </ClientButton>
            </Link>
          </div>

          <PropertyList properties={properties} />
        </div>
      </main>
    </div>
  );
} 