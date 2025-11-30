import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/components/ui/StatusBadge';

describe('StatusBadge', () => {
  it('renders "Available" text for available status', () => {
    render(<StatusBadge status="available" />);

    expect(screen.getByTestId('status-badge')).toHaveTextContent('Available');
  });

  it('renders "Unavailable" text for unavailable status', () => {
    render(<StatusBadge status="unavailable" />);

    expect(screen.getByTestId('status-badge')).toHaveTextContent('Unavailable');
  });

  it('has green background class for available status', () => {
    render(<StatusBadge status="available" />);

    const badge = screen.getByTestId('status-badge');
    expect(badge).toHaveClass('bg-status-available-bg');
    expect(badge).toHaveClass('text-status-available-text');
  });

  it('has red background class for unavailable status', () => {
    render(<StatusBadge status="unavailable" />);

    const badge = screen.getByTestId('status-badge');
    expect(badge).toHaveClass('bg-status-unavailable-bg');
    expect(badge).toHaveClass('text-status-unavailable-text');
  });

  it('has rounded-full class for pill style', () => {
    render(<StatusBadge status="available" />);

    expect(screen.getByTestId('status-badge')).toHaveClass('rounded-full');
  });
});
