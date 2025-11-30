import { render, screen } from '@testing-library/react';
import { StatusPill } from '@/components/ui/StatusPill';

describe('StatusPill', () => {
  it('renders "Available" with green background when status is available', () => {
    render(<StatusPill status="available" />);

    const pill = screen.getByText('Available');
    expect(pill).toBeInTheDocument();
    expect(pill).toHaveClass('bg-[#7DE099]');
    expect(pill).toHaveClass('w-[90px]', 'h-[22px]', 'rounded-full');
  });

  it('renders "Unavailable" with red background when status is unavailable', () => {
    render(<StatusPill status="unavailable" />);

    const pill = screen.getByText('Unavailable');
    expect(pill).toBeInTheDocument();
    expect(pill).toHaveClass('bg-unavailableRed');
    expect(pill).toHaveClass('w-[90px]', 'h-[22px]', 'rounded-full');
  });

  it('has consistent sizing for both statuses', () => {
    const { rerender } = render(<StatusPill status="available" />);
    const availablePill = screen.getByText('Available');
    expect(availablePill).toHaveClass('w-[90px]', 'h-[22px]', 'rounded-full');

    rerender(<StatusPill status="unavailable" />);
    const unavailablePill = screen.getByText('Unavailable');
    expect(unavailablePill).toHaveClass('w-[90px]', 'h-[22px]', 'rounded-full');
  });

  it('has correct text styling', () => {
    render(<StatusPill status="available" />);
    const pill = screen.getByText('Available');
    expect(pill).toHaveClass('text-[12px]', 'font-medium', 'font-inter', 'text-[#3C3D3E]');
  });

  it('centers text content', () => {
    render(<StatusPill status="available" />);
    const pill = screen.getByText('Available');
    expect(pill).toHaveClass('inline-flex', 'items-center', 'justify-center');
  });
});
