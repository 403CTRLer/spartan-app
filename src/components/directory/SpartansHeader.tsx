'use client';

import { FilterChip } from '@/components/ui/FilterChip';
import { Input } from '@/components/ui/Input';
import { SearchIcon } from '@/components/icons';
import { FilterType } from '@/types';

interface SpartansHeaderProps {
  totalCount: number;
  availableCount: number;
  unavailableCount: number;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function SpartansHeader({
  totalCount,
  availableCount,
  unavailableCount,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: SpartansHeaderProps) {
  return (
    <div className="mb-6">
      {/* Title and count */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-xl lg:text-2xl font-semibold text-text-main">
          Spartans Directory <span className="text-text-muted font-normal">({totalCount})</span>
        </h1>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <FilterChip
            label="All"
            isActive={activeFilter === 'all'}
            onClick={() => onFilterChange('all')}
            count={totalCount}
          />
          <FilterChip
            label="Available"
            isActive={activeFilter === 'available'}
            onClick={() => onFilterChange('available')}
            count={availableCount}
          />
          <FilterChip
            label="Unavailable"
            isActive={activeFilter === 'unavailable'}
            onClick={() => onFilterChange('unavailable')}
            count={unavailableCount}
          />
        </div>

        {/* Search input */}
        <div className="w-full sm:w-72">
          <Input
            type="text"
            placeholder="Search by name, designation, college..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            icon={<SearchIcon size={18} />}
          />
        </div>
      </div>
    </div>
  );
}
