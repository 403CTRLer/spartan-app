export type SpartanStatus = 'available' | 'unavailable';

export interface Spartan {
  id: string;
  avatarUrl: string;
  name: string;
  designation: string;
  college: string;
  dateJoined: string;
  approvedBy: string;
  status: SpartanStatus;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type FilterType = 'all' | 'available' | 'unavailable';

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface SidebarItem {
  label: string;
  href: string;
  icon: string;
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}
