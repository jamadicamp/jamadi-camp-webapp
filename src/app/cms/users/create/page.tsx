import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Create User - CMS',
  description: 'Create a new user account',
};

export default async function CreateUserPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/cms/login');
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key'
    );
    
    const { payload } = await jwtVerify(token, secret);
    
    // Only admins can create users
    if (payload.role !== 'admin') {
      redirect('/cms');
    }
  } catch {
    redirect('/cms/login');
  }

  async function handleSubmit(formData: FormData) {
    'use server';
    
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    // Handle API URL - in server actions, we might need to construct it differently
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const fullUrl = `${apiUrl}/api/auth/users`;

    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email, password, role }),
      });
      

      if (!response.ok) {
        const data = await response.json();
        const errorMessage = encodeURIComponent(data.error || 'Failed to create user');
        redirect(`/cms/users/create?error=${errorMessage}`);
        return; // This return will never be reached due to redirect, but it's good practice
      }

      
      // If we get here, the user was created successfully
      redirect('/cms/users?success=user-created');
    } catch (error) {
      console.error('User creation error:', error);
      
      // Check if this is a redirect error (which is expected)
      if (error && typeof error === 'object' && 'digest' in error && typeof error.digest === 'string' && error.digest.includes('NEXT_REDIRECT')) {
        // This is a Next.js redirect, which is expected behavior - re-throw it
        throw error;
      }
      
      // This is an actual error (network, parsing, etc.)
      const errorMessage = encodeURIComponent(`An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
      redirect(`/cms/users/create?error=${errorMessage}`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New User
          </h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/cms/users">Back to User Management</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/cms">Dashboard</Link>
            </Button>
            <form action="/api/auth/logout" method="POST">
              <Button variant="outline" type="submit">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Error Message */}
          {params.error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    {decodeURIComponent(params.error)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                User Information
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Create a new user account with username, email, and password.
              </p>
            </div>

            <form className="px-6 py-4 space-y-6" action={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    minLength={6}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Enter password (min 6 characters)"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role *
                  </label>
                  <select
                    name="role"
                    id="role"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  >
                    <option value="">Select a role</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="helper">Helper</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 rounded-md">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Role Descriptions:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><strong>Admin:</strong> Full access to all CMS features including user management</li>
                  <li><strong>Manager:</strong> Can manage properties and bookings</li>
                  <li><strong>Helper:</strong> Limited access to basic property information</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button variant="outline" type="button" asChild>
                  <Link href="/cms/users">Cancel</Link>
                </Button>
                <Button type="submit">
                  Create User
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 