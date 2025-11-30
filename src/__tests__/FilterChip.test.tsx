import { render, screen, fireEvent } from '@testing-library/react';
import { FilterChip } from '@/components/ui/FilterChip';

describe('FilterChip', () => {
  it('renders label text', () => {
    render(<FilterChip label="All" isActive={false} onClick={() => {}} />);

    expect(screen.getByRole('button')).toHaveTextContent('All');
  });

  it('renders count when provided', () => {
    render(<FilterChip label="Available" isActive={false} onClick={() => {}} count={42} />);

    expect(screen.getByRole('button')).toHaveTextContent('(42)');
  });

  it('has active styles when isActive is true', () => {
    render(<FilterChip label="All" isActive={true} onClick={() => {}} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-brand-primary');
    expect(button).toHaveClass('text-white');
  });

  it('has inactive styles when isActive is false', () => {
    render(<FilterChip label="All" isActive={false} onClick={() => {}} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-layout-card');
    expect(button).toHaveClass('text-text-secondary');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<FilterChip label="All" isActive={false} onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
