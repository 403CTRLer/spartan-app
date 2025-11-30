import { SpartanStatus } from '@/types';

interface StatusPillProps {
  status: SpartanStatus;
}

export function StatusPill({ status }: StatusPillProps) {
  return (
    <div
      className={`inline-flex items-center justify-center w-[90px] h-[22px] rounded-full text-[12px] font-medium font-inter text-[#3C3D3E] ${
        status === 'available' ? 'bg-[#7DE099]' : 'bg-unavailableRed'
      }`}
    >
      {status === 'available' ? 'Available' : 'Unavailable'}
    </div>
  );
}
