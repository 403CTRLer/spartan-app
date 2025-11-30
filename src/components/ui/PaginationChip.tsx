interface PaginationChipProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
}

export function PaginationChip({ page, isActive, onClick }: PaginationChipProps) {
  return (
    <button
      onClick={onClick}
      className={`w-[28px] h-[28px] rounded-[12px] text-[12px] font-medium font-inter flex items-center justify-center border ${
        isActive
          ? 'bg-primaryYellow border-midGreyBorder text-[#3C3D3E]'
          : 'bg-white border-lightGreyBorder text-[#3C3D3E] hover:bg-[#FAFAFA]'
      }`}
    >
      {page}
    </button>
  );
}
