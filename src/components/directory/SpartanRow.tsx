'use client';

import { Spartan } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface SpartanRowProps {
  spartan: Spartan;
}

export function SpartanRow({ spartan }: SpartanRowProps) {
  return (
    <tr className="border-b border-layout-border hover:bg-layout-bg/50 transition-colors">
      {/* Name with avatar */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar src={spartan.avatarUrl} alt={spartan.name} size="md" />
          <span className="font-medium text-text-main whitespace-nowrap">{spartan.name}</span>
        </div>
      </td>

      {/* Designation */}
      <td className="px-4 py-4 text-text-secondary whitespace-nowrap">{spartan.designation}</td>

      {/* College */}
      <td className="px-4 py-4 text-text-secondary whitespace-nowrap">{spartan.college}</td>

      {/* Date Joined */}
      <td className="px-4 py-4 text-text-secondary whitespace-nowrap">{spartan.dateJoined}</td>

      {/* Approved By */}
      <td className="px-4 py-4 text-text-secondary whitespace-nowrap">{spartan.approvedBy}</td>

      {/* Status */}
      <td className="px-4 py-4">
        <StatusBadge status={spartan.status} />
      </td>
    </tr>
  );
}
