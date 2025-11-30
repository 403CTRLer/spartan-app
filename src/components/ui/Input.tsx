'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-main mb-1.5">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-2.5 text-sm
              bg-layout-card border border-layout-border rounded-lg
              text-text-main placeholder:text-text-muted
              focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent
              disabled:bg-layout-bg disabled:cursor-not-allowed
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-status-unavailable-text focus:ring-status-unavailable-text' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-status-unavailable-text">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
