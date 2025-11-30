'use client';

import { ErrorIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  description = "We couldn't load the spartans directory. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-status-unavailable-text mb-4">
        <ErrorIcon size={80} />
      </div>
      <h3 className="text-lg font-semibold text-text-main mb-2">{title}</h3>
      <p className="text-sm text-text-muted text-center max-w-sm mb-6">{description}</p>
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
    </div>
  );
}
