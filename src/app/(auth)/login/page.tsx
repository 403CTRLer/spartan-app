'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/directory');
      } else {
        setErrors({ general: 'Invalid email or password. Please try again.' });
      }
    } catch {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-[24px] font-semibold text-[#3C3D3E] text-center mb-2 font-inter">
        Welcome back
      </h1>
      <p className="text-[14px] text-[#808182] text-center mb-8 font-inter">
        Sign in to your account to continue
      </p>

      {errors.general && (
        <div className="mb-6 p-4 bg-unavailableRed/20 text-[#3C3D3E] text-[14px] rounded-[8px] font-inter">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[14px] font-medium text-[#3C3D3E] mb-1.5 font-inter">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 text-[14px] bg-[#FFFFFF] border border-midGreyBorder rounded-[8px] text-[#3C3D3E] placeholder:text-midGreyBorder outline-none focus:border-purpleCTA font-inter"
          />
          {errors.email && (
            <p className="mt-1 text-[12px] text-[#EB4055] font-inter">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-[14px] font-medium text-[#3C3D3E] mb-1.5 font-inter">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 text-[14px] bg-[#FFFFFF] border border-midGreyBorder rounded-[8px] text-[#3C3D3E] placeholder:text-midGreyBorder outline-none focus:border-purpleCTA font-inter"
          />
          {errors.password && (
            <p className="mt-1 text-[12px] text-[#EB4055] font-inter">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-purpleCTA text-[#FFFFFF] text-[16px] font-semibold rounded-[28px] hover:bg-[#4A3ED8] disabled:opacity-50 disabled:cursor-not-allowed font-inter"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-[14px] text-[#808182] font-inter">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-purpleCTA font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
