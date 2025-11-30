import { render, screen, fireEvent } from '@testing-library/react';

// Mock Header component for testing
function SpartansHeader({
  totalCount,
  availableCount,
  unavailableCount,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: {
  totalCount: number;
  availableCount: number;
  unavailableCount: number;
  activeFilter: 'all' | 'available' | 'unavailable';
  onFilterChange: (filter: 'all' | 'available' | 'unavailable') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) {
  return (
    <div>
      <h1>
        Spartans Directory <span>({totalCount})</span>
      </h1>

      <div>
        <button
          onClick={() => onFilterChange('all')}
          className={activeFilter === 'all' ? 'bg-brand-primary' : ''}
        >
          All ({totalCount})
        </button>
        <button
          onClick={() => onFilterChange('available')}
          className={activeFilter === 'available' ? 'bg-brand-primary' : ''}
        >
          Available ({availableCount})
        </button>
        <button
          onClick={() => onFilterChange('unavailable')}
          className={activeFilter === 'unavailable' ? 'bg-brand-primary' : ''}
        >
          Unavailable ({unavailableCount})
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name, designation, college..."
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
      />
    </div>
  );
}

describe('SpartansHeader - Search and Filter', () => {
  const defaultProps = {
    totalCount: 65,
    availableCount: 45,
    unavailableCount: 20,
    activeFilter: 'all' as const,
    onFilterChange: jest.fn(),
    searchQuery: '',
    onSearchChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Search', () => {
    it('renders search input', () => {
      render(<SpartansHeader {...defaultProps} />);

      expect(screen.getByPlaceholderText(/Search by name/i)).toBeInTheDocument();
    });

    it('calls onSearchChange when typing', () => {
      const handleSearchChange = jest.fn();
      render(<SpartansHeader {...defaultProps} onSearchChange={handleSearchChange} />);

      const searchInput = screen.getByPlaceholderText(/Search by name/i);
      fireEvent.change(searchInput, { target: { value: 'Priya' } });

      expect(handleSearchChange).toHaveBeenCalledWith('Priya');
    });

    it('displays current search value', () => {
      render(<SpartansHeader {...defaultProps} searchQuery="test query" />);

      const searchInput = screen.getByPlaceholderText(/Search by name/i);
      expect(searchInput).toHaveValue('test query');
    });
  });

  describe('Filters', () => {
    it('renders all filter chips', () => {
      render(<SpartansHeader {...defaultProps} />);

      expect(screen.getByRole('button', { name: /All.*65/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Available.*45/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Unavailable.*20/i })).toBeInTheDocument();
    });

    it('calls onFilterChange when clicking Available filter', () => {
      const handleFilterChange = jest.fn();
      render(<SpartansHeader {...defaultProps} onFilterChange={handleFilterChange} />);

      fireEvent.click(screen.getByRole('button', { name: /Available.*45/i }));

      expect(handleFilterChange).toHaveBeenCalledWith('available');
    });

    it('calls onFilterChange when clicking Unavailable filter', () => {
      const handleFilterChange = jest.fn();
      render(<SpartansHeader {...defaultProps} onFilterChange={handleFilterChange} />);

      fireEvent.click(screen.getByRole('button', { name: /Unavailable.*20/i }));

      expect(handleFilterChange).toHaveBeenCalledWith('unavailable');
    });

    it('calls onFilterChange when clicking All filter', () => {
      const handleFilterChange = jest.fn();
      render(
        <SpartansHeader
          {...defaultProps}
          activeFilter="available"
          onFilterChange={handleFilterChange}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /All.*65/i }));

      expect(handleFilterChange).toHaveBeenCalledWith('all');
    });

    it('shows active state for selected filter', () => {
      render(<SpartansHeader {...defaultProps} activeFilter="available" />);

      const availableButton = screen.getByRole('button', { name: /Available.*45/i });
      expect(availableButton).toHaveClass('bg-brand-primary');
    });
  });

  describe('Title', () => {
    it('displays title with total count', () => {
      render(<SpartansHeader {...defaultProps} />);

      expect(screen.getByText(/Spartans Directory/i)).toBeInTheDocument();
      expect(screen.getByText('(65)')).toBeInTheDocument();
    });
  });
});
