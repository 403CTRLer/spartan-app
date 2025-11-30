'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSpartans } from '@/hooks';
import { useAuth } from '@/context/AuthContext';
import { FilterType, Spartan } from '@/types';
import Image from 'next/image';
import { StatusPill } from '@/components/ui/StatusPill';
import { DirectoryFilterChip } from '@/components/ui/DirectoryFilterChip';
import { PaginationChip } from '@/components/ui/PaginationChip';
import { MenuIcon, LogoutIcon } from '@/components/icons';

// ============================================
// MAIN PAGE COMPONENT
// ============================================
type SortKey = 'name' | 'designation' | 'college' | 'dateJoined' | 'approvedBy' | 'status' | null;
type SortOrder = 'asc' | 'desc' | null;

export default function DirectoryPage() {
  const { data: spartans = [], isLoading, isError, refetch } = useSpartans();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const filteredSpartans = useMemo(() => {
    let result = spartans;
    if (activeFilter !== 'all') {
      result = result.filter(s => s.status === activeFilter);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        s =>
          s.name.toLowerCase().includes(query) ||
          s.designation.toLowerCase().includes(query) ||
          s.college.toLowerCase().includes(query)
      );
    }
    return result;
  }, [spartans, activeFilter, searchQuery]);

  // Sorting function
  const sortedSpartans = useMemo(() => {
    if (!sortKey || !sortOrder) {
      return filteredSpartans;
    }

    const sorted = [...filteredSpartans].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortKey) {
        case 'name':
        case 'designation':
        case 'college':
        case 'approvedBy':
          aValue = a[sortKey].toLowerCase();
          bValue = b[sortKey].toLowerCase();
          break;
        case 'dateJoined':
          // Parse dd/mm/yy format to Date
          const parseDate = (dateStr: string): Date => {
            const [day, month, year] = dateStr.split('/').map(Number);
            // Convert 2-digit year to 4-digit (assuming 2000s)
            const fullYear = year < 50 ? 2000 + year : 1900 + year;
            return new Date(fullYear, month - 1, day);
          };
          aValue = parseDate(a.dateJoined).getTime();
          bValue = parseDate(b.dateJoined).getTime();
          break;
        case 'status':
          // available = 1, unavailable = 0
          aValue = a.status === 'available' ? 1 : 0;
          bValue = b.status === 'available' ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredSpartans, sortKey, sortOrder]);

  // Pagination
  const PAGE_SIZE = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(sortedSpartans.length / PAGE_SIZE);
  const paginatedSpartans = sortedSpartans.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Handle column header click
  const handleSort = (key: SortKey) => {
    if (sortKey !== key) {
      // New column: start with ascending
      setSortKey(key);
      setSortOrder('asc');
      setCurrentPage(1);
    } else {
      // Same column: cycle through asc → desc → null
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortKey(null);
        setSortOrder(null);
      }
      setCurrentPage(1);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Responsive Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Content Row: Sidebar + Main Card */}
        <div className="flex gap-4 lg:gap-6 mt-4 lg:mt-5">
          {/* Sidebar - Hidden on mobile, slide-in drawer */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main Content Card */}
          <main className="flex-1 bg-white rounded-lg lg:rounded-[8px] flex flex-col min-h-[600px] lg:min-h-[774px] min-w-0">
            {/* Title Row - Responsive Layout */}
            <div className="px-4 sm:px-6 lg:px-6 pt-4 sm:pt-6 lg:pt-6 pb-3 sm:pb-4 lg:pb-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 lg:gap-6">
              {/* Title */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-inter font-medium text-[10px] sm:text-[11px] lg:text-[12px] leading-[12px] sm:leading-[14px] lg:leading-[15px] uppercase tracking-wide text-[#3C3D3E]">
                  spartans directory
                </span>
                <span className="font-inter font-medium text-[12px] sm:text-[13px] lg:text-[14px] leading-[15px] sm:leading-[16px] lg:leading-[17px] text-purpleCTA">
                  ({spartans.length})
                </span>
              </div>

              {/* Filter Chips - Wrap on tablet */}
              <div className="flex items-center gap-2 flex-wrap">
                <DirectoryFilterChip
                  label="All"
                  active={activeFilter === 'all'}
                  onClick={() => {
                    setActiveFilter('all');
                    setCurrentPage(1);
                  }}
                />
                <DirectoryFilterChip
                  label="Available"
                  active={activeFilter === 'available'}
                  onClick={() => {
                    setActiveFilter('available');
                    setCurrentPage(1);
                  }}
                />
                <DirectoryFilterChip
                  label="Unavailable"
                  active={activeFilter === 'unavailable'}
                  onClick={() => {
                    setActiveFilter('unavailable');
                    setCurrentPage(1);
                  }}
                />
              </div>

              {/* Search - Full width on mobile, auto on larger */}
              <div className="w-full sm:w-auto sm:ml-auto">
                <SearchInput
                  value={searchQuery}
                  onChange={v => {
                    setSearchQuery(v);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {/* Table - Horizontal scroll on smaller screens */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              {/* Table Container with horizontal scroll - only this scrolls */}
              <div className="w-full overflow-x-auto min-w-0">
                {/* Table wrapper with min-width constraint */}
                <div className="min-w-[1000px] md:min-w-full">
                  {/* Table Header - Sticky on vertical scroll */}
                  <div className="sticky top-0 z-10 h-8 bg-[#F9F9F9] grid grid-cols-[minmax(140px,1fr)_minmax(100px,0.8fr)_minmax(90px,0.7fr)_minmax(70px,0.5fr)_minmax(150px,1fr)_90px] items-center px-4 sm:px-6 lg:px-6 gap-2.5">
                    <SortableHeader
                      label="Name"
                      sortKey="name"
                      currentSortKey={sortKey}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Designation"
                      sortKey="designation"
                      currentSortKey={sortKey}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="College"
                      sortKey="college"
                      currentSortKey={sortKey}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Date Joined"
                      sortKey="dateJoined"
                      currentSortKey={sortKey}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Approved By"
                      sortKey="approvedBy"
                      currentSortKey={sortKey}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Status"
                      sortKey="status"
                      currentSortKey={sortKey}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                    />
                  </div>

                  {/* Table Body */}
                  <div>
                    {isLoading ? (
                      <LoadingSkeleton />
                    ) : isError ? (
                      <ErrorState onRetry={() => refetch()} />
                    ) : paginatedSpartans.length > 0 ? (
                      paginatedSpartans.map(spartan => (
                        <TableRow key={spartan.id} spartan={spartan} />
                      ))
                    ) : (
                      <EmptyState />
                    )}
                  </div>
                </div>
              </div>

              {/* Pagination - Responsive layout */}
              {!isLoading && !isError && totalPages > 1 && (
                <div className="px-4 sm:px-6 lg:px-6 py-3 sm:py-4 lg:py-4 border-t border-[#F9F9F9] flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-4">
                  <span className="font-inter text-[11px] sm:text-[12px] text-[#808182] text-center sm:text-left">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1} to{' '}
                    {Math.min(currentPage * PAGE_SIZE, sortedSpartans.length)} of{' '}
                    {sortedSpartans.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 sm:px-3 lg:px-3 py-1.5 sm:py-1.5 lg:py-1.5 rounded-xl lg:rounded-[12px] bg-white border border-lightGreyBorder text-[11px] sm:text-[12px] font-medium font-inter text-[#3C3D3E] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FAFAFA] transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1 sm:gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(
                        page => (
                          <PaginationChip
                            key={page}
                            page={page}
                            isActive={currentPage === page}
                            onClick={() => setCurrentPage(page)}
                          />
                        )
                      )}
                    </div>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 sm:px-3 lg:px-3 py-1.5 sm:py-1.5 lg:py-1.5 rounded-xl lg:rounded-[12px] bg-white border border-lightGreyBorder text-[11px] sm:text-[12px] font-medium font-inter text-[#3C3D3E] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FAFAFA] transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SORTABLE HEADER COMPONENT
// ============================================
function SortableHeader({
  label,
  sortKey,
  currentSortKey,
  currentSortOrder,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  currentSortKey: SortKey;
  currentSortOrder: SortOrder;
  onSort: (key: SortKey) => void;
}) {
  const isActive = currentSortKey === sortKey;
  const showAsc = isActive && currentSortOrder === 'asc';
  const showDesc = isActive && currentSortOrder === 'desc';

  return (
    <button
      onClick={() => onSort(sortKey)}
      className="flex items-center gap-1 font-inter font-medium text-[10px] leading-[12px] uppercase text-[#808182] whitespace-nowrap hover:text-[#3C3D3E] transition-colors cursor-pointer"
    >
      <span>{label}</span>
      {showAsc && (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="flex-shrink-0">
          <path d="M4 0L7 4H1L4 0Z" fill="#808182" />
        </svg>
      )}
      {showDesc && (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="flex-shrink-0">
          <path d="M4 8L1 4H7L4 8Z" fill="#808182" />
        </svg>
      )}
    </button>
  );
}

// ============================================
// LOADING SKELETON COMPONENT
// ============================================
function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-12 lg:h-[48px] grid grid-cols-[minmax(140px,1fr)_minmax(100px,0.8fr)_minmax(90px,0.7fr)_minmax(70px,0.5fr)_minmax(150px,1fr)_90px] items-center px-4 sm:px-6 lg:px-6 gap-2.5 border-b border-[#F9F9F9]"
        >
          <div className="flex items-center gap-1.5 sm:gap-1.5">
            <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-[24px] lg:h-[24px] rounded-full bg-[#E2E2E2]" />
            <div className="h-3 sm:h-3 lg:h-3 w-16 sm:w-20 lg:w-[80px] bg-[#E2E2E2] rounded" />
          </div>
          <div className="h-3 sm:h-3 lg:h-3 w-12 sm:w-14 lg:w-[60px] bg-[#E2E2E2] rounded" />
          <div className="h-3 sm:h-3 lg:h-3 w-10 sm:w-12 lg:w-[50px] bg-[#E2E2E2] rounded" />
          <div className="h-3 sm:h-3 lg:h-3 w-9 sm:w-10 lg:w-[45px] bg-[#E2E2E2] rounded" />
          <div className="h-3 sm:h-3 lg:h-3 w-16 sm:w-20 lg:w-[90px] bg-[#E2E2E2] rounded" />
          <div className="h-5 sm:h-5 lg:h-[22px] w-16 sm:w-20 lg:w-[90px] bg-[#E2E2E2] rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ============================================
// ERROR STATE COMPONENT
// ============================================
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] gap-[16px]">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="20" stroke="#FCA19C" strokeWidth="2" />
        <path d="M24 16V28" stroke="#FCA19C" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="34" r="2" fill="#FCA19C" />
      </svg>
      <p className="font-inter text-[14px] text-[#808182]">Failed to load spartans data</p>
      <button
        onClick={onRetry}
        className="px-[16px] py-[8px] bg-purpleCTA text-white rounded-[8px] font-inter text-[14px] font-medium hover:bg-[#4A3ED8] transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

// ============================================
// EMPTY STATE COMPONENT
// ============================================
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] gap-[12px]">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="20" stroke="#A7A8A8" strokeWidth="2" />
        <path d="M18 18L30 30M30 18L18 30" stroke="#A7A8A8" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <p className="font-inter text-[14px] text-[#808182]">No spartans found</p>
      <p className="font-inter text-[12px] text-midGreyBorder">
        Try adjusting your search or filter
      </p>
    </div>
  );
}

// ============================================
// HEADER COMPONENT
// ============================================
function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="bg-white rounded-lg lg:rounded-[8px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 lg:px-7 py-3 sm:py-4 lg:py-0 lg:h-[95px]">
      {/* Left: Hamburger (mobile) + Logo + Company Info */}
      <div className="flex items-center gap-2 sm:gap-2 lg:gap-2">
        {/* Hamburger Menu Button - Mobile/Tablet only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-[#3C3D3E] hover:bg-[#F9F9F9] rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <MenuIcon size={20} />
        </button>

        {/* Logo */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-[60px] lg:h-[60px] rounded-full border border-[#F6F6F6] overflow-hidden flex-shrink-0">
          <Image
            src="/logo.png"
            alt="TEC Logo"
            width={60}
            height={60}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>

        {/* Company Name & Location */}
        <div className="flex flex-col gap-0.5 sm:gap-1">
          <span className="font-inter font-medium text-base sm:text-[17px] lg:text-[18px] leading-[20px] sm:leading-[21px] lg:leading-[22px] text-[#3C3D3E]">
            TEC Spartans
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-inter font-normal text-xs sm:text-[13px] lg:text-[14px] leading-[15px] sm:leading-[16px] lg:leading-[17px] text-[#808182]">
              Bangalore, India
            </span>
            <ChevronDown className="text-[#808182] hidden sm:block" />
          </div>
        </div>
      </div>

      {/* Right: Create Campaign + Icons + Profile */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-wrap sm:flex-nowrap">
        {/* Create Campaign Button */}
        <button className="h-9 sm:h-10 lg:h-[43px] px-3 sm:px-4 lg:px-[18px] bg-purpleCTA rounded-full lg:rounded-[28px] flex items-center justify-center hover:bg-[#4A3ED8] transition-colors whitespace-nowrap">
          <span className="font-inter font-semibold text-sm sm:text-[15px] lg:text-[16px] leading-[17px] sm:leading-[18px] lg:leading-[19px] text-white">
            + Create Campaign
          </span>
        </button>

        {/* Calendar - Visible on all screens */}
        <div className="flex flex-col items-center gap-1 px-2 sm:px-2.5">
          <CalendarIcon />
          <span className="font-inter font-normal text-[9px] sm:text-[10px] leading-[11px] sm:leading-[12px] text-[#808182]">
            Calendar
          </span>
        </div>

        {/* Divider - Visible on all screens */}
        <div className="block w-px h-5 sm:h-[21px] bg-[#E2E2E2]" />

        {/* Chat - Visible on all screens */}
        <div className="flex flex-col items-center gap-1">
          <ChatIcon />
          <span className="font-inter font-normal text-[9px] sm:text-[10px] leading-[11px] sm:leading-[12px] text-[#808182]">
            Chat
          </span>
        </div>

        {/* Profile with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-[42px] lg:h-[42px] rounded-full border border-[#F6F6F6] overflow-hidden flex-shrink-0">
              <Image
                src={user?.avatarUrl || '/user_icon.png'}
                alt={user?.name || 'Profile'}
                width={42}
                height={42}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div className="flex flex-col gap-0 hidden sm:flex text-left">
              <span className="font-inter font-medium text-sm sm:text-[15px] lg:text-[16px] leading-[17px] sm:leading-[18px] lg:leading-[19px] text-[#3C3D3E]">
                {user?.name || 'User'}
              </span>
              <span className="font-inter font-normal text-[11px] sm:text-[12px] leading-[13px] sm:leading-[15px] text-[#808182]">
                {user?.role || 'Admin'}
              </span>
            </div>
            <ChevronDown className="text-[#808182] hidden lg:block" />
          </button>

          {/* Dropdown menu */}
          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-lightGreyBorder z-50 py-2">
                <div className="px-4 py-2 border-b border-lightGreyBorder sm:hidden">
                  <p className="text-sm font-medium text-[#3C3D3E] font-inter">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-[#808182] font-inter">{user?.role || 'Admin'}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    logout();
                    router.push('/login');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#808182] hover:bg-[#FAFAFA] hover:text-[#3C3D3E] transition-colors font-inter"
                >
                  <LogoutIcon size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// ============================================
// SIDEBAR COMPONENT
// ============================================
function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      {/* Mobile/Tablet Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto lg:w-[234px]
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          rounded-r-lg lg:rounded-lg lg:rounded-[8px]
          flex-shrink-0 py-6 lg:py-6
          shadow-xl lg:shadow-none
        `}
      >
        {/* Close button for mobile/tablet */}
        <div className="lg:hidden flex items-center justify-between px-5 pb-4 border-b border-[#F9F9F9]">
          <span className="font-inter font-semibold text-base text-[#3C3D3E]">Menu</span>
          <button
            onClick={onClose}
            className="p-2 text-[#808182] hover:text-[#3C3D3E] hover:bg-[#F9F9F9] rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto h-full lg:h-auto pb-6">
          {/* GENERAL Section */}
          <SidebarSection title="General">
            <SidebarItem icon="dashboard" label="Dashboard" onClick={onClose} />
            <SidebarItem icon="feed" label="Feed" disabled />
            <SidebarItem icon="campaigns" label="Campaigns" onClick={onClose} />
            <SidebarItem icon="applications" label="Applications" disabled />
            <SidebarItem icon="payments" label="Payments" onClick={onClose} />
          </SidebarSection>

          {/* DIRECTORIES Section */}
          <SidebarSection title="Directories">
            <SidebarItem icon="spartans" label="Spartans Directory" active onClick={onClose} />
            <SidebarItem icon="college" label="College Directory" onClick={onClose} />
          </SidebarSection>

          {/* LISTS Section */}
          <SidebarSection title="Lists">
            <SidebarItem icon="stores" label="Stores" onClick={onClose} />
            <SidebarItem icon="products" label="Products" disabled />
            <SidebarItem icon="training" label="Training Material" disabled />
            <SidebarItem icon="jobs" label="Jobs" onClick={onClose} />
            <SidebarItem icon="tasks" label="Tasks" onClick={onClose} />
          </SidebarSection>

          {/* OTHERS Section */}
          <SidebarSection title="Others">
            <SidebarItem icon="escalations" label="Escalations" badge onClick={onClose} />
            <SidebarItem icon="feedback" label="Feedback" onClick={onClose} />
          </SidebarSection>
        </div>
      </aside>
    </>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 sm:px-5 lg:px-5 mb-5 sm:mb-6 lg:mb-6">
      <span className="font-inter font-light text-[10px] leading-[12px] uppercase text-[#808182] tracking-wide">
        {title}
      </span>
      <div className="mt-4 lg:mt-4 flex flex-col gap-5 lg:gap-[22px]">{children}</div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active = false,
  disabled = false,
  badge = false,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
  badge?: boolean;
  onClick?: () => void;
}) {
  const color = active ? '#5B4FE9' : disabled ? '#A7A8A8' : '#808182';

  return (
    <div className="flex items-center gap-2 cursor-pointer group" onClick={onClick}>
      <div className="relative w-3.5 h-3.5 flex items-center justify-center flex-shrink-0">
        <SidebarIcon name={icon} color={color} />
        {badge && (
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#EB4055] rounded-full" />
        )}
      </div>
      <span
        className="flex-1 font-inter font-normal text-sm leading-[17px] transition-colors"
        style={{ color }}
      >
        {label}
      </span>
      <svg width="7" height="12" viewBox="0 0 7 12" fill="none" className="flex-shrink-0">
        <path
          d="M1 1L6 6L1 11"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ============================================
// TABLE ROW COMPONENT
// ============================================
function TableRow({ spartan }: { spartan: Spartan }) {
  return (
    <div className="h-12 lg:h-[48px] grid grid-cols-[minmax(140px,1fr)_minmax(100px,0.8fr)_minmax(90px,0.7fr)_minmax(70px,0.5fr)_minmax(150px,1fr)_90px] items-center px-4 sm:px-6 lg:px-6 gap-2.5 border-b border-[#F9F9F9] hover:bg-[#FAFAFA] transition-colors">
      {/* Name + Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-1.5">
        <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-[24px] lg:h-[24px] rounded-full overflow-hidden bg-lightGreyBorder flex-shrink-0">
          <Image
            src={spartan.avatarUrl}
            alt={spartan.name}
            width={24}
            height={24}
            unoptimized
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-inter font-semibold text-[11px] sm:text-[12px] leading-[14px] sm:leading-[15px] text-[#3C3D3E] whitespace-nowrap">
          {spartan.name}
        </span>
      </div>

      {/* Designation */}
      <span className="font-inter font-normal text-[11px] sm:text-[12px] leading-[14px] sm:leading-[15px] text-[#3C3D3E] whitespace-nowrap">
        {spartan.designation}
      </span>

      {/* College */}
      <span className="font-inter font-normal text-[11px] sm:text-[12px] leading-[14px] sm:leading-[15px] text-[#3C3D3E] whitespace-nowrap">
        {spartan.college}
      </span>

      {/* Date Joined */}
      <span className="font-inter font-normal text-[11px] sm:text-[12px] leading-[14px] sm:leading-[15px] text-[#3C3D3E] whitespace-nowrap">
        {spartan.dateJoined}
      </span>

      {/* Approved By */}
      <span className="font-inter font-normal text-[11px] sm:text-[12px] leading-[14px] sm:leading-[15px] text-[#3C3D3E] whitespace-nowrap">
        {spartan.approvedBy}
      </span>

      {/* Status Badge */}
      <div className="flex justify-start">
        <StatusPill status={spartan.status} />
      </div>
    </div>
  );
}

// ============================================
// SEARCH INPUT COMPONENT
// ============================================
function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="w-full sm:w-[240px] lg:w-[260px] h-8 lg:h-[32px] relative flex items-center border border-lightGreyBorder rounded-full lg:rounded-[16px] bg-white">
      <div className="absolute left-3 lg:left-3 flex items-center justify-center">
        <SearchIcon />
      </div>
      <input
        type="text"
        placeholder="Search"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-full pl-9 lg:pl-9 pr-3 lg:pr-3 bg-transparent font-inter font-normal text-[11px] sm:text-[12px] leading-[14px] sm:leading-[15px] text-[#3C3D3E] placeholder:text-midGreyBorder outline-none rounded-full lg:rounded-[16px]"
      />
    </div>
  );
}

// ============================================
// ICONS
// ============================================
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" className={className}>
      <path
        d="M1 1L4 4L7 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="21" height="19" viewBox="0 0 21 19" fill="none">
      <rect
        x="0.75"
        y="2.75"
        width="19.5"
        height="15.5"
        rx="1.75"
        stroke="#3C3D3E"
        strokeWidth="1.5"
      />
      <line x1="0.75" y1="7.75" x2="20.25" y2="7.75" stroke="#3C3D3E" strokeWidth="1.5" />
      <line x1="5.75" y1="0.75" x2="5.75" y2="4.25" stroke="#3C3D3E" strokeWidth="1.5" />
      <line x1="15.25" y1="0.75" x2="15.25" y2="4.25" stroke="#3C3D3E" strokeWidth="1.5" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M20.25 1.75V14.25H7L3.5 17.75V14.25H1.75V1.75H20.25Z"
        stroke="#3C3D3E"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="8" r="1" fill="#3C3D3E" />
      <circle cx="11" cy="8" r="1" fill="#3C3D3E" />
      <circle cx="16" cy="8" r="1" fill="#3C3D3E" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="7.5" cy="7.5" r="5.75" stroke="#A7A8A8" strokeWidth="1.5" />
      <line
        x1="12"
        y1="12"
        x2="16.25"
        y2="16.25"
        stroke="#A7A8A8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SidebarIcon({ name, color }: { name: string; color: string }) {
  const icons: Record<string, React.ReactNode> = {
    dashboard: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="1" width="5" height="5" rx="1" stroke={color} />
        <rect x="8" y="1" width="5" height="5" rx="1" stroke={color} />
        <rect x="1" y="8" width="5" height="5" rx="1" stroke={color} />
        <rect x="8" y="8" width="5" height="5" rx="1" stroke={color} />
      </svg>
    ),
    feed: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="1" width="5" height="5" rx="1" stroke={color} />
        <line x1="8" y1="2" x2="13" y2="2" stroke={color} />
        <line x1="8" y1="4" x2="13" y2="4" stroke={color} />
        <line x1="8" y1="6" x2="13" y2="6" stroke={color} />
        <rect x="1" y="8" width="5" height="5" rx="1" stroke={color} />
        <line x1="8" y1="10" x2="13" y2="10" stroke={color} />
        <line x1="8" y1="12" x2="13" y2="12" stroke={color} />
      </svg>
    ),
    campaigns: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M1 5L7 2L13 5V7L7 10L1 7V5Z" stroke={color} />
        <path d="M1 10L7 13L13 10" stroke={color} />
      </svg>
    ),
    applications: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="2" y="1" width="10" height="12" rx="1" stroke={color} />
        <circle cx="5" cy="4" r="1.5" stroke={color} />
        <path d="M4 7C4.5 6 5.5 6 6 7" stroke={color} />
        <line x1="4" y1="9" x2="10" y2="9" stroke={color} />
        <line x1="4" y1="11" x2="8" y2="11" stroke={color} />
      </svg>
    ),
    payments: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" stroke={color} />
        <path d="M7 4V10" stroke={color} />
        <path
          d="M5 5.5H8.5C9 5.5 9.5 6 9.5 6.5C9.5 7 9 7.5 8.5 7.5H5.5C5 7.5 4.5 8 4.5 8.5C4.5 9 5 9.5 5.5 9.5H9"
          stroke={color}
        />
      </svg>
    ),
    spartans: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="4" cy="3.5" r="2" stroke={color} />
        <path d="M1 9C1 7.5 2.5 6.5 4 6.5C5.5 6.5 7 7.5 7 9" stroke={color} />
        <circle cx="10" cy="3.5" r="2" stroke={color} />
        <path d="M7 9C7 7.5 8.5 6.5 10 6.5C11.5 6.5 13 7.5 13 9" stroke={color} />
      </svg>
    ),
    college: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M1 5L7 2L13 5L7 8L1 5Z" stroke={color} />
        <path d="M3 6V10C3 10 5 12 7 12C9 12 11 10 11 10V6" stroke={color} />
        <line x1="13" y1="5" x2="13" y2="9" stroke={color} />
      </svg>
    ),
    stores: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M1 1H13V4C13 4 12 5 11.5 5C11 5 10.5 4 10 4C9.5 4 9 5 8.5 5C8 5 7.5 4 7 4C6.5 4 6 5 5.5 5C5 5 4.5 4 4 4C3.5 4 3 5 2.5 5C2 5 1 4 1 4V1Z"
          stroke={color}
        />
        <rect x="1" y="5" width="12" height="8" stroke={color} />
        <rect x="5" y="9" width="4" height="4" stroke={color} />
      </svg>
    ),
    products: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="2" width="12" height="8" rx="1" stroke={color} />
        <line x1="4" y1="13" x2="10" y2="13" stroke={color} />
      </svg>
    ),
    training: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="1" width="9" height="12" rx="1" stroke={color} />
        <path d="M10 1L13 4V13H10" stroke={color} />
        <line x1="1" y1="10" x2="10" y2="10" stroke={color} />
        <line x1="4" y1="4" x2="7" y2="4" stroke={color} />
        <line x1="4" y1="6" x2="5" y2="6" stroke={color} />
      </svg>
    ),
    jobs: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1V4M7 1L5 3M7 1L9 3" stroke={color} strokeLinecap="round" />
        <path d="M7 13V10M7 13L5 11M7 13L9 11" stroke={color} strokeLinecap="round" />
      </svg>
    ),
    tasks: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="1" width="9" height="12" stroke={color} />
        <line x1="3" y1="4" x2="4" y2="4" stroke={color} />
        <line x1="5" y1="4" x2="8" y2="4" stroke={color} />
        <line x1="3" y1="7" x2="4" y2="7" stroke={color} />
        <line x1="5" y1="7" x2="8" y2="7" stroke={color} />
        <line x1="3" y1="10" x2="4" y2="10" stroke={color} />
        <line x1="5" y1="10" x2="8" y2="10" stroke={color} />
        <path d="M8 10L13 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    escalations: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1L1 12H13L7 1Z" stroke={color} strokeLinejoin="round" />
        <line x1="7" y1="5" x2="7" y2="8" stroke={color} />
        <circle cx="7" cy="10" r="0.5" fill={color} />
      </svg>
    ),
    feedback: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M1 1H13V10H5L2 13V10H1V1Z" stroke={color} strokeLinejoin="round" />
      </svg>
    ),
  };

  return icons[name] || <div className="w-[14px] h-[14px]" />;
}
