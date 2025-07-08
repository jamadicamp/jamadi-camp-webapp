import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export const metadata: Metadata = {
  title: 'Configuración Inicial - Jamadi Camp',
  description: 'Crear el primer usuario administrador para la aplicación',
};

export default async function SetupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const params = await searchParams;

  // Check if setup is already completed
  try {
    await connectDB();
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      redirect('/cms/login?error=setup-already-completed');
    }
  } catch (error) {
    console.error('Database connection error:', error);
  }

  async function handleSubmit(formData: FormData) {
    'use server';
    
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      redirect('/setup?error=all-fields-required');
    }

    if (password !== confirmPassword) {
      redirect('/setup?error=passwords-dont-match');
    }

    if (password.length < 6) {
      redirect('/setup?error=password-too-short');
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/auth/setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMessage = encodeURIComponent(data.error || 'Error en la configuración');
        redirect(`/setup?error=${errorMessage}`);
      }

      redirect('/setup?success=setup-completed');
    } catch (error) {
      console.error('Setup error:', error);
      const errorMessage = encodeURIComponent('Ocurrió un error inesperado');
      redirect(`/setup?error=${errorMessage}`);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Configuración Inicial
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Crear el primer usuario administrador para Jamadi Camp
          </p>
        </div>

        {/* Error Message */}
        {params.error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {params.error === 'all-fields-required' && 'Todos los campos son requeridos'}
                  {params.error === 'passwords-dont-match' && 'Las contraseñas no coinciden'}
                  {params.error === 'password-too-short' && 'La contraseña debe tener al menos 6 caracteres'}
                  {params.error === 'setup-already-completed' && 'La configuración ya ha sido completada'}
                  {!['all-fields-required', 'passwords-dont-match', 'password-too-short', 'setup-already-completed'].includes(params.error) && params.error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {params.success === 'setup-completed' && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  ¡Configuración completada exitosamente! Ahora puedes iniciar sesión en el CMS.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Button asChild className="w-full">
                <a href="/cms/login">Ir al Login</a>
              </Button>
            </div>
          </div>
        )}

        {/* Setup Form */}
        {params.success !== 'setup-completed' && (
          <form className="mt-8 space-y-6" action={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Nombre de Usuario
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Nombre de Usuario"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Correo Electrónico"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Contraseña (mín 6 caracteres)"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirmar Contraseña
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Confirmar Contraseña"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Crear Usuario Administrador
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    Esto creará el primer usuario administrador para la aplicación. Después de la configuración, podrás iniciar sesión en el CMS y crear usuarios adicionales.
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 