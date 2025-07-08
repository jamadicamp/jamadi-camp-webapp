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
  title: 'Panel de Administración',
  description: 'Panel del Sistema de Gestión de Contenido',
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

export default async function CMSPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/cms/login');
  }

  let userRole = '';
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key'
    );
    
    const { payload } = await jwtVerify(token, secret);
    userRole = payload.role as string;
  } catch {
    redirect('/cms/login');
  }

  const properties: Property[] = await getProperties();
  console.log(properties)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Administración
          </h1>
          <div className="flex items-center space-x-4">
            <form action="/api/auth/logout" method="POST">
              <Button variant="outline" type="submit">
                Cerrar Sesión
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Success Message */}
          {((await searchParams).success === 'user-created') && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    ¡Usuario creado exitosamente!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* User Management Section - Only for Admins */}
          {userRole === 'admin' && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Gestión de Usuarios
                </h2>
                <Link href="/cms/users">
                  <ClientButton>
                    Administrar Usuarios
                  </ClientButton>
                </Link>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-600">
                  Administra cuentas de usuario y permisos. Ve todos los usuarios, crea nuevas cuentas y elimina usuarios existentes.
                </p>
              </div>
            </div>
          )}

          {/* Properties Section */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Propiedades
            </h2>
            <Link href="/cms/properties/new">
              <ClientButton>
                Crear Propiedad
              </ClientButton>
            </Link>
          </div>

          <PropertyList properties={properties} />
        </div>
      </main>
    </div>
  );
} 