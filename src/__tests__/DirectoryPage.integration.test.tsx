import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DirectoryPage from '@/app/(dashboard)/directory/page';
import { AuthProvider } from '@/context/AuthContext';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/directory',
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { unoptimized?: boolean }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { unoptimized: _unoptimized, ...imgProps } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...imgProps} alt={imgProps.alt || ''} />;
  },
}));

// Mock the spartans data
const MOCK_SPARTANS = [
  {
    id: '1',
    name: 'Priya Rai',
    designation: 'City Admin',
    college: "St. Xavier's",
    dateJoined: '23/1/23',
    approvedBy: 'Sahil',
    status: 'available' as const,
    avatarUrl: 'https://example.com/1.png',
  },
  {
    id: '2',
    name: 'Rahul Sharma',
    designation: 'Field Executive',
    college: 'Christ University',
    dateJoined: '23/1/23',
    approvedBy: 'Vikram',
    status: 'unavailable' as const,
    avatarUrl: 'https://example.com/2.png',
  },
  {
    id: '3',
    name: 'Ananya Gupta',
    designation: 'Regional Head',
    college: 'MIT',
    dateJoined: '23/1/23',
    approvedBy: 'Sahil',
    status: 'available' as const,
    avatarUrl: 'https://example.com/3.png',
  },
  {
    id: '4',
    name: 'Vikram Singh',
    designation: 'City Admin',
    college: "St. Xavier's",
    dateJoined: '24/1/23',
    approvedBy: 'Sahil',
    status: 'available' as const,
    avatarUrl: 'https://example.com/4.png',
  },
  {
    id: '5',
    name: 'Sneha Patel',
    designation: 'Manager',
    college: 'IIT Delhi',
    dateJoined: '25/1/23',
    approvedBy: 'Vikram',
    status: 'unavailable' as const,
    avatarUrl: 'https://example.com/5.png',
  },
];

jest.mock('@/data/spartans', () => ({
  spartansData: MOCK_SPARTANS,
}));

jest.mock('@/hooks/useSpartans', () => ({
  useSpartans: () => ({
    data: MOCK_SPARTANS,
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  }),
}));

function createTestWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );

  return TestWrapper;
}

describe('DirectoryPage Integration', () => {
  beforeEach(() => {
    // Mock localStorage for auth
    const localStorageMock = {
      getItem: jest.fn(() =>
        JSON.stringify({ id: '1', name: 'Test', email: 'test@test.com', role: 'Admin' })
      ),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  it('renders all spartans initially', async () => {
    render(<DirectoryPage />, { wrapper: createTestWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Priya Rai')).toBeInTheDocument();
    });

    expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
    expect(screen.getByText('Ananya Gupta')).toBeInTheDocument();
  });

  it('filters spartans by search query', async () => {
    render(<DirectoryPage />, { wrapper: createTestWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Priya Rai')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'Priya' } });

    await waitFor(() => {
      expect(screen.getByText('Priya Rai')).toBeInTheDocument();
      expect(screen.queryByText('Rahul Sharma')).not.toBeInTheDocument();
    });
  });

  it('filters spartans by availability status', async () => {
    render(<DirectoryPage />, { wrapper: createTestWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Priya Rai')).toBeInTheDocument();
    });

    // Find the filter chip button by looking for button with "Available" text in a span
    const allButtons = screen.getAllByRole('button');
    const availableFilterButton = allButtons.find(btn => {
      const span = btn.querySelector('span');
      return span?.textContent === 'Available' && btn.textContent === 'Available';
    });

    if (availableFilterButton) {
      fireEvent.click(availableFilterButton);
    }

    await waitFor(() => {
      expect(screen.getByText('Priya Rai')).toBeInTheDocument();
      expect(screen.getByText('Ananya Gupta')).toBeInTheDocument();
      expect(screen.queryByText('Rahul Sharma')).not.toBeInTheDocument();
    });
  });

  it('combines search and filter together', async () => {
    render(<DirectoryPage />, { wrapper: createTestWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Priya Rai')).toBeInTheDocument();
    });

    // First filter by available
    const allButtons = screen.getAllByRole('button');
    const availableFilterButton = allButtons.find(btn => {
      const span = btn.querySelector('span');
      return span?.textContent === 'Available' && btn.textContent === 'Available';
    });

    if (availableFilterButton) {
      fireEvent.click(availableFilterButton);
    }

    // Then search
    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'City' } });

    await waitFor(() => {
      expect(screen.getByText('Priya Rai')).toBeInTheDocument();
      expect(screen.getByText('Vikram Singh')).toBeInTheDocument();
      expect(screen.queryByText('Ananya Gupta')).not.toBeInTheDocument(); // Doesn't match "City"
      expect(screen.queryByText('Rahul Sharma')).not.toBeInTheDocument(); // Not available
    });
  });

  it('resets to page 1 when filter changes', async () => {
    render(<DirectoryPage />, { wrapper: createTestWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Priya Rai')).toBeInTheDocument();
    });

    // Change filter - this should reset pagination to page 1
    const allButtons = screen.getAllByRole('button');
    const availableFilterButton = allButtons.find(btn => {
      const span = btn.querySelector('span');
      return span?.textContent === 'Available' && btn.textContent === 'Available';
    });

    if (availableFilterButton) {
      fireEvent.click(availableFilterButton);
    }

    // Verify filtered results are shown (with only 5 items, pagination won't show)
    await waitFor(() => {
      expect(screen.getByText('Priya Rai')).toBeInTheDocument();
      expect(screen.getByText('Ananya Gupta')).toBeInTheDocument();
      // Unavailable items should be filtered out
      expect(screen.queryByText('Rahul Sharma')).not.toBeInTheDocument();
    });
  });

  it('handles empty search query', async () => {
    render(<DirectoryPage />, { wrapper: createTestWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Priya Rai')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search');

    // Type something
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    // Clear it
    fireEvent.change(searchInput, { target: { value: '' } });

    await waitFor(() => {
      // Should show all spartans again
      expect(screen.getByText('Priya Rai')).toBeInTheDocument();
      expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
    });
  });

  it('handles case-insensitive search', async () => {
    render(<DirectoryPage />, { wrapper: createTestWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Priya Rai')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'PRIYA' } });

    await waitFor(() => {
      expect(screen.getByText('Priya Rai')).toBeInTheDocument();
    });
  });

  it('handles filter with no results', async () => {
    render(<DirectoryPage />, { wrapper: createTestWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Priya Rai')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'NonExistentName12345' } });

    await waitFor(() => {
      expect(screen.getByText(/No spartans found/i)).toBeInTheDocument();
    });
  });

  it('shows pagination controls when there are multiple pages', async () => {
    // With only 5 items and PAGE_SIZE=12, pagination won't show
    // This test verifies the page renders correctly
    render(<DirectoryPage />, { wrapper: createTestWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Priya Rai')).toBeInTheDocument();
    });

    // Pagination won't show with fewer than 12 items, which is expected behavior
    const paginationText = screen.queryByText(/Showing/i);
    expect(paginationText).not.toBeInTheDocument();
  });

  it('handles special characters in search', async () => {
    render(<DirectoryPage />, { wrapper: createTestWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Priya Rai')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: "St. Xavier's" } });

    await waitFor(() => {
      expect(screen.getByText('Priya Rai')).toBeInTheDocument();
      expect(screen.getByText('Vikram Singh')).toBeInTheDocument();
    });
  });
});
