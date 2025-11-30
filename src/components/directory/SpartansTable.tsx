'use client';

import { Spartan } from '@/types';
import { SpartanRow } from './SpartanRow';
import { SpartanCard } from './SpartanCard';

interface SpartansTableProps {
  spartans: Spartan[];
}

export function SpartansTable({ spartans }: SpartansTableProps) {
  return (
    <>
      {/* Desktop table view */}
      <div className="hidden lg:block overflow-x-auto table-scroll">
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
          <tbody className="divide-y divide-layout-border">
            {spartans.map(spartan => (
              <SpartanRow key={spartan.id} spartan={spartan} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet card view */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {spartans.map(spartan => (
          <SpartanCard key={spartan.id} spartan={spartan} />
        ))}
      </div>
    </>
  );
}
