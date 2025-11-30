'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const success = await signup(name, email, password);
      if (success) {
        router.push('/directory');
      } else {
        setErrors({ general: 'An account with this email already exists.' });
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
        Create an account
      </h1>
      <p className="text-[14px] text-[#808182] text-center mb-8 font-inter">
        Get started with TEC Spartans today
      </p>

      {errors.general && (
        <div className="mb-6 p-4 bg-unavailableRed/20 text-[#3C3D3E] text-[14px] rounded-[8px] font-inter">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[14px] font-medium text-[#3C3D3E] mb-1.5 font-inter">
            Full name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 text-[14px] bg-[#FFFFFF] border border-midGreyBorder rounded-[8px] text-[#3C3D3E] placeholder:text-midGreyBorder outline-none focus:border-purpleCTA font-inter"
          />
          {errors.name && (
            <p className="mt-1 text-[12px] text-[#EB4055] font-inter">{errors.name}</p>
          )}
        </div>

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

        <div>
          <label className="block text-[14px] font-medium text-[#3C3D3E] mb-1.5 font-inter">
            Confirm password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 text-[14px] bg-[#FFFFFF] border border-midGreyBorder rounded-[8px] text-[#3C3D3E] placeholder:text-midGreyBorder outline-none focus:border-purpleCTA font-inter"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-[12px] text-[#EB4055] font-inter">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-purpleCTA text-[#FFFFFF] text-[16px] font-semibold rounded-[28px] hover:bg-[#4A3ED8] disabled:opacity-50 disabled:cursor-not-allowed font-inter"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-[14px] text-[#808182] font-inter">
        Already have an account?{' '}
        <Link href="/login" className="text-purpleCTA font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
