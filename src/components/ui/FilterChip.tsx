'use client';

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}

export function FilterChip({ label, isActive, onClick, count }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150
        ${
          isActive
            ? 'bg-brand-primary text-white'
            : 'bg-layout-card text-text-secondary border border-layout-border hover:bg-layout-bg'
        }
      `}
    >
      {label}
      {count !== undefined && (
        <span className={`ml-1.5 ${isActive ? 'text-white/80' : 'text-text-muted'}`}>
          ({count})
        </span>
      )}
    </button>
  );
}
