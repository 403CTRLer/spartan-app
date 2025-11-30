import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useMemo } from 'react';

// Mock spartan data
const MOCK_SPARTANS = [
  {
    id: '1',
    name: 'Priya Rai',
    designation: 'City Admin',
    college: "St. Xavier's",
    dateJoined: '23/1/23',
    approvedBy: 'Sahil',
    status: 'available' as const,
    avatarUrl: '',
  },
  {
    id: '2',
    name: 'Rahul Sharma',
    designation: 'Field Executive',
    college: 'Christ University',
    dateJoined: '23/1/23',
    approvedBy: 'Vikram',
    status: 'unavailable' as const,
    avatarUrl: '',
  },
  {
    id: '3',
    name: 'Ananya Gupta',
    designation: 'Regional Head',
    college: 'MIT',
    dateJoined: '23/1/23',
    approvedBy: 'Sahil',
    status: 'available' as const,
    avatarUrl: '',
  },
  {
    id: '4',
    name: 'Very Long Name That Should Be Truncated Properly In The Table',
    designation: 'Very Long Designation That Might Cause Layout Issues',
    college: 'Very Long College Name That Could Break The Layout',
    dateJoined: '23/1/23',
    approvedBy: 'Sahil',
    status: 'available' as const,
    avatarUrl: '',
  },
];

// Simple search component that mimics the directory page behavior
function SearchableDirectory({ spartans }: { spartans: typeof MOCK_SPARTANS }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSpartans = useMemo(() => {
    if (!searchQuery.trim()) return spartans;
    const query = searchQuery.toLowerCase().trim();
    return spartans.filter(
      s =>
        s.name.toLowerCase().includes(query) ||
        s.designation.toLowerCase().includes(query) ||
        s.college.toLowerCase().includes(query)
    );
  }, [spartans, searchQuery]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        data-testid="search-input"
      />
      <table>
        <tbody>
          {filteredSpartans.map(spartan => (
            <tr key={spartan.id} data-testid="spartan-row">
              <td className="truncate">{spartan.name}</td>
              <td className="truncate">{spartan.designation}</td>
              <td className="truncate">{spartan.college}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div data-testid="result-count">{filteredSpartans.length} results</div>
    </div>
  );
}

// Wrapper with QueryClient for tests
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('Directory Search', () => {
  it('renders all spartans when search is empty', () => {
    render(
      <TestWrapper>
        <SearchableDirectory spartans={MOCK_SPARTANS} />
      </TestWrapper>
    );

    const rows = screen.getAllByTestId('spartan-row');
    expect(rows).toHaveLength(4);
    expect(screen.getByText('Priya Rai')).toBeInTheDocument();
    expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
    expect(screen.getByText('Ananya Gupta')).toBeInTheDocument();
  });

  it('filters spartans by name when typing in search', async () => {
    render(
      <TestWrapper>
        <SearchableDirectory spartans={MOCK_SPARTANS} />
      </TestWrapper>
    );

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Priya' } });

    await waitFor(() => {
      const rows = screen.getAllByTestId('spartan-row');
      expect(rows).toHaveLength(1);
    });

    expect(screen.getByText('Priya Rai')).toBeInTheDocument();
    expect(screen.queryByText('Rahul Sharma')).not.toBeInTheDocument();
    expect(screen.queryByText('Ananya Gupta')).not.toBeInTheDocument();
  });

  it('filters spartans by college when typing in search', async () => {
    render(
      <TestWrapper>
        <SearchableDirectory spartans={MOCK_SPARTANS} />
      </TestWrapper>
    );

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Christ' } });

    await waitFor(() => {
      const rows = screen.getAllByTestId('spartan-row');
      expect(rows).toHaveLength(1);
    });

    expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
    expect(screen.queryByText('Priya Rai')).not.toBeInTheDocument();
  });

  it('shows correct result count after filtering', async () => {
    render(
      <TestWrapper>
        <SearchableDirectory spartans={MOCK_SPARTANS} />
      </TestWrapper>
    );

    expect(screen.getByTestId('result-count')).toHaveTextContent('4 results');

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Admin' } });

    await waitFor(() => {
      expect(screen.getByTestId('result-count')).toHaveTextContent('1 results');
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('handles empty search query', async () => {
      render(
        <TestWrapper>
          <SearchableDirectory spartans={MOCK_SPARTANS} />
        </TestWrapper>
      );

      const searchInput = screen.getByTestId('search-input');

      // Type something
      fireEvent.change(searchInput, { target: { value: 'Test' } });

      // Clear it (empty string)
      fireEvent.change(searchInput, { target: { value: '' } });

      await waitFor(() => {
        const rows = screen.getAllByTestId('spartan-row');
        expect(rows).toHaveLength(4); // All spartans should be visible
      });
    });

    it('handles whitespace-only search query', async () => {
      render(
        <TestWrapper>
          <SearchableDirectory spartans={MOCK_SPARTANS} />
        </TestWrapper>
      );

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: '   ' } });

      await waitFor(() => {
        const rows = screen.getAllByTestId('spartan-row');
        expect(rows).toHaveLength(4); // Should show all (trimmed empty)
      });
    });

    it('handles special characters in search', async () => {
      render(
        <TestWrapper>
          <SearchableDirectory spartans={MOCK_SPARTANS} />
        </TestWrapper>
      );

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: "St. Xavier's" } });

      await waitFor(() => {
        expect(screen.getByText('Priya Rai')).toBeInTheDocument();
      });
    });

    it('handles case-insensitive search', async () => {
      render(
        <TestWrapper>
          <SearchableDirectory spartans={MOCK_SPARTANS} />
        </TestWrapper>
      );

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'PRIYA' } });

      await waitFor(() => {
        expect(screen.getByText('Priya Rai')).toBeInTheDocument();
      });

      fireEvent.change(searchInput, { target: { value: 'priya' } });

      await waitFor(() => {
        expect(screen.getByText('Priya Rai')).toBeInTheDocument();
      });
    });

    it('handles filter with no results', async () => {
      render(
        <TestWrapper>
          <SearchableDirectory spartans={MOCK_SPARTANS} />
        </TestWrapper>
      );

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'NonExistentName12345' } });

      await waitFor(() => {
        const rows = screen.queryAllByTestId('spartan-row');
        expect(rows).toHaveLength(0);
        expect(screen.getByTestId('result-count')).toHaveTextContent('0 results');
      });
    });

    it('handles very long names/designations (truncation)', () => {
      render(
        <TestWrapper>
          <SearchableDirectory spartans={MOCK_SPARTANS} />
        </TestWrapper>
      );

      const longNameRow = screen.getByText(/Very Long Name That Should Be Truncated/i);
      expect(longNameRow).toBeInTheDocument();
      expect(longNameRow.closest('td')).toHaveClass('truncate');
    });

    it('searches across multiple fields (name, designation, college)', async () => {
      render(
        <TestWrapper>
          <SearchableDirectory spartans={MOCK_SPARTANS} />
        </TestWrapper>
      );

      // Search by designation
      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'Field Executive' } });

      await waitFor(() => {
        expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
      });

      // Search by college
      fireEvent.change(searchInput, { target: { value: 'MIT' } });

      await waitFor(() => {
        expect(screen.getByText('Ananya Gupta')).toBeInTheDocument();
      });
    });

    it('handles partial matches', async () => {
      render(
        <TestWrapper>
          <SearchableDirectory spartans={MOCK_SPARTANS} />
        </TestWrapper>
      );

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'Rah' } });

      await waitFor(() => {
        expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
      });
    });
  });
});
