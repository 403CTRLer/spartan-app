'use client';

function SkeletonRow() {
  return (
    <tr className="border-b border-layout-border">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full skeleton" />
          <div className="h-4 w-32 rounded skeleton" />
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="h-4 w-24 rounded skeleton" />
      </td>
      <td className="px-4 py-4">
        <div className="h-4 w-36 rounded skeleton" />
      </td>
      <td className="px-4 py-4">
        <div className="h-4 w-24 rounded skeleton" />
      </td>
      <td className="px-4 py-4">
        <div className="h-4 w-40 rounded skeleton" />
      </td>
      <td className="px-4 py-4">
        <div className="h-6 w-20 rounded-full skeleton" />
      </td>
    </tr>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-layout-card border border-layout-border rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full skeleton" />
          <div>
            <div className="h-4 w-28 rounded skeleton mb-2" />
            <div className="h-3 w-20 rounded skeleton" />
          </div>
        </div>
        <div className="h-6 w-20 rounded-full skeleton" />
      </div>
      <div className="space-y-3 mt-4">
        <div className="flex justify-between">
          <div className="h-3 w-16 rounded skeleton" />
          <div className="h-3 w-32 rounded skeleton" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 w-12 rounded skeleton" />
          <div className="h-3 w-24 rounded skeleton" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 w-20 rounded skeleton" />
          <div className="h-3 w-36 rounded skeleton" />
        </div>
      </div>
    </div>
  );
}

interface LoadingSkeletonProps {
  rows?: number;
}

export function LoadingSkeleton({ rows = 10 }: LoadingSkeletonProps) {
  return (
    <>
      {/* Desktop skeleton */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-layout-border bg-layout-bg/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Designation
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                College
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Date Joined
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Approved By
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <SkeletonRow key={index} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile skeleton */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: rows }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </>
  );
}
