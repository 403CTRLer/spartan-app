interface DirectoryFilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function DirectoryFilterChip({ label, active, onClick }: DirectoryFilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`h-[23px] px-[8px] rounded-[12px] flex items-center justify-center transition-colors border ${
        active
          ? 'bg-primaryYellow border-midGreyBorder'
          : 'bg-white border-lightGreyBorder hover:bg-[#FAFAFA]'
      }`}
    >
      <span className="font-inter font-medium text-[12px] leading-[15px] text-[#3C3D3E]">
        {label}
      </span>
    </button>
  );
}
