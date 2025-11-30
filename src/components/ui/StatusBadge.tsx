'use client';

import { SpartanStatus } from '@/types';

interface StatusBadgeProps {
  status: SpartanStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isAvailable = status === 'available';

  return (
    <span
      data-testid="status-badge"
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
        ${
          isAvailable
            ? 'bg-status-available-bg text-status-available-text'
            : 'bg-status-unavailable-bg text-status-unavailable-text'
        }
      `}
    >
      {isAvailable ? 'Available' : 'Unavailable'}
    </span>
  );
}
