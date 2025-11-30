import { render, screen, fireEvent } from '@testing-library/react';
import { PaginationChip } from '@/components/ui/PaginationChip';

describe('PaginationChip', () => {
  it('renders page number', () => {
    render(<PaginationChip page={1} isActive={false} onClick={() => {}} />);

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders multi-digit page numbers', () => {
    render(<PaginationChip page={42} isActive={false} onClick={() => {}} />);

    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('has active styles when isActive is true', () => {
    render(<PaginationChip page={2} isActive={true} onClick={() => {}} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primaryYellow', 'border-midGreyBorder', 'text-[#3C3D3E]');
    expect(button).not.toHaveClass('bg-white');
  });

  it('has inactive styles when isActive is false', () => {
    render(<PaginationChip page={3} isActive={false} onClick={() => {}} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-white', 'border-lightGreyBorder', 'text-[#3C3D3E]');
    expect(button).not.toHaveClass('bg-primaryYellow');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<PaginationChip page={5} isActive={false} onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has correct sizing and styling', () => {
    render(<PaginationChip page={1} isActive={false} onClick={() => {}} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-[28px]', 'h-[28px]', 'rounded-[12px]');
    expect(button).toHaveClass('text-[12px]', 'font-medium', 'font-inter');
    expect(button).toHaveClass('flex', 'items-center', 'justify-center', 'border');
  });

  it('has hover effect when inactive', () => {
    render(<PaginationChip page={1} isActive={false} onClick={() => {}} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-[#FAFAFA]');
  });
});
