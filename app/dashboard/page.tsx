"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DashboardRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // This will redirect to the actual dashboard page in the (workspace) route group
    router.replace('/(workspace)/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-violet-700" />
        <p>Redirecting to dashboard...</p>
      </div>
    </div>
  );
}