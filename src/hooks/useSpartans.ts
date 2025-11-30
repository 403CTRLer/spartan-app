import { useQuery } from '@tanstack/react-query';
import { spartansData } from '@/data/spartans';
import { Spartan } from '@/types';

// Simulated API delay (ms)
const SIMULATED_DELAY = 800;

/**
 * Simulates fetching spartans data from an API
 * In a real app, this would be an actual fetch call
 */
async function fetchSpartans(): Promise<Spartan[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));

  // Return mock data (in production, this would be a fetch call)
  return spartansData;
}

/**
 * Hook to fetch and manage Spartans data using TanStack Query
 */
export function useSpartans() {
  return useQuery({
    queryKey: ['spartans'],
    queryFn: fetchSpartans,
  });
}

/**
 * Get counts by status from spartans data
 */
export function useSpartansCounts() {
  const { data: spartans = [] } = useSpartans();

  return {
    total: spartans.length,
    available: spartans.filter(s => s.status === 'available').length,
    unavailable: spartans.filter(s => s.status === 'unavailable').length,
  };
}
