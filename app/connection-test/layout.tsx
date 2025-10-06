'use client';

import Link from 'next/link';

export default function ConnectionTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-bold text-xl text-blue-600">
              Project Management
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-blue-600">
                Home
              </Link>
              <Link href="/connection-test" className="font-medium text-blue-600">
                Connection Test
              </Link>
              <Link href="/auth/signin" className="text-gray-600 hover:text-blue-600">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}