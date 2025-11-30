'use client';

import { Spartan } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface SpartanCardProps {
  spartan: Spartan;
}

export function SpartanCard({ spartan }: SpartanCardProps) {
  return (
    <div className="bg-layout-card border border-layout-border rounded-xl p-4 hover:shadow-card transition-shadow">
      {/* Header with avatar and status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar src={spartan.avatarUrl} alt={spartan.name} size="lg" />
          <div>
            <h3 className="font-medium text-text-main">{spartan.name}</h3>
            <p className="text-sm text-text-secondary">{spartan.designation}</p>
          </div>
        </div>
        <StatusBadge status={spartan.status} />
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-text-muted">College</span>
          <span className="text-text-secondary text-right">{spartan.college}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Joined</span>
          <span className="text-text-secondary">{spartan.dateJoined}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Approved by</span>
          <span className="text-text-secondary text-right truncate max-w-[180px]">
            {spartan.approvedBy}
          </span>
        </div>
      </div>
    </div>
  );
}
