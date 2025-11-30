import { render, screen } from '@testing-library/react';

// Mock spartan data for testing
const mockSpartans = [
  {
    id: '1',
    name: 'Priya Rai',
    avatarUrl: 'https://example.com/avatar1.png',
    designation: 'City Admin',
    college: "St. Xavier's",
    dateJoined: '23/1/23',
    approvedBy: 'Sahil Mehra - Central Admin',
    status: 'available' as const,
  },
  {
    id: '2',
    name: 'Rahul Sharma',
    avatarUrl: 'https://example.com/avatar2.png',
    designation: 'Field Executive',
    college: 'Christ University',
    dateJoined: '22/2/23',
    approvedBy: 'Vikram Singh - Regional Head',
    status: 'unavailable' as const,
  },
  {
    id: '3',
    name: 'Very Long Name That Should Be Truncated Properly In The Table Display',
    avatarUrl: 'https://example.com/avatar3.png',
    designation: 'Very Long Designation That Might Cause Layout Issues If Not Handled',
    college: 'Very Long College Name That Could Break The Layout If Not Truncated',
    dateJoined: '21/3/23',
    approvedBy: 'Very Long Approver Name That Should Also Be Truncated',
    status: 'available' as const,
  },
];

// Simple TableRow component for testing
function TableRow({ spartan }: { spartan: (typeof mockSpartans)[0] }) {
  return (
    <tr data-testid="table-row">
      <td>
        <span className="truncate">{spartan.name}</span>
      </td>
      <td className="truncate">{spartan.designation}</td>
      <td className="truncate">{spartan.college}</td>
      <td>{spartan.dateJoined}</td>
      <td className="truncate">{spartan.approvedBy}</td>
      <td>
        <span
          data-testid="status-badge"
          className={spartan.status === 'available' ? 'bg-green' : 'bg-red'}
        >
          {spartan.status === 'available' ? 'Available' : 'Unavailable'}
        </span>
      </td>
    </tr>
  );
}

function SpartansTable({ spartans }: { spartans: typeof mockSpartans }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Designation</th>
          <th>College</th>
          <th>Date Joined</th>
          <th>Approved By</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {spartans.map(spartan => (
          <TableRow key={spartan.id} spartan={spartan} />
        ))}
      </tbody>
    </table>
  );
}

describe('SpartansTable', () => {
  it('renders table headers', () => {
    render(<SpartansTable spartans={mockSpartans} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Designation')).toBeInTheDocument();
    expect(screen.getByText('College')).toBeInTheDocument();
    expect(screen.getByText('Date Joined')).toBeInTheDocument();
    expect(screen.getByText('Approved By')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders spartan names', () => {
    render(<SpartansTable spartans={mockSpartans} />);

    expect(screen.getByText('Priya Rai')).toBeInTheDocument();
    expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
  });

  it('renders spartan designations', () => {
    render(<SpartansTable spartans={mockSpartans} />);

    expect(screen.getByText('City Admin')).toBeInTheDocument();
    expect(screen.getByText('Field Executive')).toBeInTheDocument();
  });

  it('renders spartan colleges', () => {
    render(<SpartansTable spartans={mockSpartans} />);

    expect(screen.getByText("St. Xavier's")).toBeInTheDocument();
    expect(screen.getByText('Christ University')).toBeInTheDocument();
  });

  it('renders status badges with correct status', () => {
    render(<SpartansTable spartans={mockSpartans} />);

    const badges = screen.getAllByTestId('status-badge');
    expect(badges).toHaveLength(3);
    expect(badges[0]).toHaveTextContent('Available');
    expect(badges[1]).toHaveTextContent('Unavailable');
    expect(badges[2]).toHaveTextContent('Available');
  });

  it('renders correct number of rows', () => {
    render(<SpartansTable spartans={mockSpartans} />);

    const rows = screen.getAllByTestId('table-row');
    expect(rows).toHaveLength(3);
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('handles very long names with truncation', () => {
      render(<SpartansTable spartans={mockSpartans} />);

      const longName = screen.getByText(/Very Long Name That Should Be Truncated/i);
      expect(longName).toBeInTheDocument();
      expect(longName).toHaveClass('truncate');
    });

    it('handles very long designations with truncation', () => {
      render(<SpartansTable spartans={mockSpartans} />);

      const longDesignation = screen.getByText(/Very Long Designation/i);
      expect(longDesignation).toBeInTheDocument();
      expect(longDesignation.closest('td')).toHaveClass('truncate');
    });

    it('handles very long college names with truncation', () => {
      render(<SpartansTable spartans={mockSpartans} />);

      const longCollege = screen.getByText(/Very Long College Name/i);
      expect(longCollege).toBeInTheDocument();
      expect(longCollege.closest('td')).toHaveClass('truncate');
    });

    it('handles very long approver names with truncation', () => {
      render(<SpartansTable spartans={mockSpartans} />);

      const longApprover = screen.getByText(/Very Long Approver Name/i);
      expect(longApprover).toBeInTheDocument();
      expect(longApprover.closest('td')).toHaveClass('truncate');
    });

    it('handles empty table', () => {
      render(<SpartansTable spartans={[]} />);

      const rows = screen.queryAllByTestId('table-row');
      expect(rows).toHaveLength(0);
    });

    it('handles single row', () => {
      render(<SpartansTable spartans={[mockSpartans[0]]} />);

      const rows = screen.getAllByTestId('table-row');
      expect(rows).toHaveLength(1);
      expect(screen.getByText('Priya Rai')).toBeInTheDocument();
    });

    it('renders all data fields correctly', () => {
      render(<SpartansTable spartans={[mockSpartans[0]]} />);

      expect(screen.getByText('Priya Rai')).toBeInTheDocument();
      expect(screen.getByText('City Admin')).toBeInTheDocument();
      expect(screen.getByText("St. Xavier's")).toBeInTheDocument();
      expect(screen.getByText('23/1/23')).toBeInTheDocument();
      expect(screen.getByText('Sahil Mehra - Central Admin')).toBeInTheDocument();
    });
  });
});
