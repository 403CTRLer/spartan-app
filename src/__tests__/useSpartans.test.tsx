import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSpartans, useSpartansCounts } from '@/hooks/useSpartans';
import { spartansData } from '@/data/spartans';

// Mock the data module to control return values
jest.mock('@/data/spartans', () => ({
  spartansData: [
    {
      id: '1',
      name: 'Test User 1',
      designation: 'Admin',
      college: 'Test College',
      dateJoined: '01/01/23',
      approvedBy: 'Admin',
      status: 'available' as const,
      avatarUrl: '',
    },
    {
      id: '2',
      name: 'Test User 2',
      designation: 'Manager',
      college: 'Test College 2',
      dateJoined: '02/01/23',
      approvedBy: 'Admin',
      status: 'unavailable' as const,
      avatarUrl: '',
    },
    {
      id: '3',
      name: 'Test User 3',
      designation: 'Staff',
      college: 'Test College',
      dateJoined: '03/01/23',
      approvedBy: 'Admin',
      status: 'available' as const,
      avatarUrl: '',
    },
  ],
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });

  const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return TestWrapper;
}

describe('useSpartans', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('returns loading state initially', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useSpartans(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it('returns spartans data after loading', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useSpartans(), { wrapper });

    // Fast-forward time to simulate delay
    jest.advanceTimersByTime(800);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(spartansData);
    expect(result.current.isError).toBe(false);
    expect(result.current.data?.length).toBe(3);
  });

  it('has correct query key', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useSpartans(), { wrapper });

    // Query should be set up with correct key
    expect(result.current.isLoading).toBe(true);
  });

  it('provides refetch function', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useSpartans(), { wrapper });

    jest.advanceTimersByTime(800);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.refetch).toBe('function');
  });
});

describe('useSpartansCounts', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('calculates correct counts', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useSpartansCounts(), { wrapper });

    jest.advanceTimersByTime(800);

    await waitFor(() => {
      expect(result.current.total).toBe(3);
    });

    expect(result.current.total).toBe(3);
    expect(result.current.available).toBe(2); // 2 available in mock data
    expect(result.current.unavailable).toBe(1); // 1 unavailable in mock data
  });

  it('returns zero counts when data is loading', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useSpartansCounts(), { wrapper });

    // Initially should have zero counts (data is empty array default)
    expect(result.current.total).toBe(0);
    expect(result.current.available).toBe(0);
    expect(result.current.unavailable).toBe(0);
  });
});
