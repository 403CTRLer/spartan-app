'use client';

import { EmptyIcon } from '@/components/icons';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = 'No spartans found',
  description = "Try adjusting your search or filter to find what you're looking for.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-text-muted mb-4">
        <EmptyIcon size={80} />
      </div>
      <h3 className="text-lg font-semibold text-text-main mb-2">{title}</h3>
      <p className="text-sm text-text-muted text-center max-w-sm">{description}</p>
    </div>
  );
}
