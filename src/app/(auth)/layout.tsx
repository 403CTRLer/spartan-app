'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/directory');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-purpleCTA border-t-transparent rounded-full animate-spin" />
          <span className="text-[#808182] font-inter">Loading...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-[60px] h-[60px] rounded-full border border-[#F6F6F6] overflow-hidden flex-shrink-0">
            <Image
              src="/logo.png"
              alt="TEC Logo"
              width={60}
              height={60}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <span className="text-[24px] font-semibold text-[#3C3D3E] font-inter">Spartans</span>
        </div>

        {/* Auth form container */}
        <div className="bg-[#FFFFFF] rounded-[8px] p-8 shadow-sm">{children}</div>
      </div>
    </div>
  );
}
