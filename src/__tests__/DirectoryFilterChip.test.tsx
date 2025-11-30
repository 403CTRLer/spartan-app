import { render, screen, fireEvent } from '@testing-library/react';
import { DirectoryFilterChip } from '@/components/ui/DirectoryFilterChip';

describe('DirectoryFilterChip', () => {
  it('renders label text', () => {
    render(<DirectoryFilterChip label="All" active={false} onClick={() => {}} />);

    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('has active styles when active is true', () => {
    render(<DirectoryFilterChip label="Available" active={true} onClick={() => {}} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primaryYellow', 'border-midGreyBorder');
    expect(button).not.toHaveClass('bg-white');
  });

  it('has inactive styles when active is false', () => {
    render(<DirectoryFilterChip label="All" active={false} onClick={() => {}} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-white', 'border-lightGreyBorder');
    expect(button).not.toHaveClass('bg-primaryYellow');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<DirectoryFilterChip label="All" active={false} onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has correct sizing and styling', () => {
    render(<DirectoryFilterChip label="All" active={false} onClick={() => {}} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-[23px]', 'px-[8px]', 'rounded-[12px]');
    expect(button).toHaveClass(
      'flex',
      'items-center',
      'justify-center',
      'transition-colors',
      'border'
    );
  });

  it('renders label with correct font styling', () => {
    render(<DirectoryFilterChip label="Unavailable" active={false} onClick={() => {}} />);

    const label = screen.getByText('Unavailable');
    expect(label).toHaveClass(
      'font-inter',
      'font-medium',
      'text-[12px]',
      'leading-[15px]',
      'text-[#3C3D3E]'
    );
  });
});
