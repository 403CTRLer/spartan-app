'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import {
  NotificationIcon,
  CalendarIcon,
  ChatIcon,
  LocationIcon,
  MenuIcon,
  ChevronDownIcon,
  LogoutIcon,
  PlusIcon,
} from '@/components/icons';

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="h-16 bg-layout-header border-b border-layout-border px-4 lg:px-6 flex items-center justify-between shadow-header">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-text-secondary hover:text-text-main hover:bg-layout-bg rounded-lg transition-colors"
        >
          <MenuIcon size={20} />
        </button>

        {/* Organization info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary-light rounded-lg flex items-center justify-center">
            <span className="text-brand-primary font-bold text-sm">TEC</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold text-text-main">TEC Spartans</h1>
            <div className="flex items-center gap-1 text-xs text-text-muted">
              <LocationIcon size={12} />
              <span>Bangalore, India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Icon buttons - hidden on mobile */}
        <div className="hidden md:flex items-center gap-1">
          <button className="p-2 text-icon-default hover:text-text-main hover:bg-layout-bg rounded-lg transition-colors relative">
            <NotificationIcon size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-unavailable-text rounded-full" />
          </button>
          <button className="p-2 text-icon-default hover:text-text-main hover:bg-layout-bg rounded-lg transition-colors">
            <CalendarIcon size={20} />
          </button>
          <button className="p-2 text-icon-default hover:text-text-main hover:bg-layout-bg rounded-lg transition-colors">
            <ChatIcon size={20} />
          </button>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-layout-border" />

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1.5 hover:bg-layout-bg rounded-lg transition-colors"
          >
            <Avatar
              src={
                user?.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=7C3AED&color=fff&size=32`
              }
              alt={user?.name || 'User'}
              size="sm"
            />
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-text-main">{user?.name || 'User'}</p>
              <p className="text-xs text-text-muted">{user?.role || 'Admin'}</p>
            </div>
            <ChevronDownIcon size={16} className="hidden lg:block text-text-muted" />
          </button>

          {/* Dropdown menu */}
          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-lightGreyBorder z-50 py-2">
                <div className="px-4 py-2 border-b border-lightGreyBorder lg:hidden">
                  <p className="text-sm font-medium text-text-main">{user?.name}</p>
                  <p className="text-xs text-text-muted">{user?.role}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    logout();
                    router.push('/login');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-[#FAFAFA] hover:text-text-main transition-colors"
                >
                  <LogoutIcon size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Create Campaign button */}
        <Button className="hidden sm:flex items-center gap-2">
          <PlusIcon size={16} />
          <span className="hidden lg:inline">Create Campaign</span>
        </Button>
      </div>
    </header>
  );
}
