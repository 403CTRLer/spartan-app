'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DashboardIcon,
  FeedIcon,
  CampaignIcon,
  ApplicationsIcon,
  PaymentsIcon,
  UsersIcon,
  CollegeIcon,
  StoreIcon,
  ProductIcon,
  TrainingIcon,
  JobsIcon,
  TasksIcon,
  EscalationIcon,
  FeedbackIcon,
  CloseIcon,
} from '@/components/icons';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const sidebarSections = [
  {
    title: 'GENERAL',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
      { label: 'Feed', href: '/feed', icon: FeedIcon },
      { label: 'Campaigns', href: '/campaigns', icon: CampaignIcon },
      { label: 'Applications', href: '/applications', icon: ApplicationsIcon },
      { label: 'Payments', href: '/payments', icon: PaymentsIcon },
    ],
  },
  {
    title: 'DIRECTORIES',
    items: [
      { label: 'Spartans Directory', href: '/directory', icon: UsersIcon },
      { label: 'College Directory', href: '/colleges', icon: CollegeIcon },
    ],
  },
  {
    title: 'LISTS',
    items: [
      { label: 'Stores', href: '/stores', icon: StoreIcon },
      { label: 'Products', href: '/products', icon: ProductIcon },
      { label: 'Training Material', href: '/training', icon: TrainingIcon },
      { label: 'Jobs', href: '/jobs', icon: JobsIcon },
      { label: 'Tasks', href: '/tasks', icon: TasksIcon },
    ],
  },
  {
    title: 'OTHERS',
    items: [
      { label: 'Escalations', href: '/escalations', icon: EscalationIcon },
      { label: 'Feedback', href: '/feedback', icon: FeedbackIcon },
    ],
  },
];

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64
          bg-layout-sidebar text-text-sidebar
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo area */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-layout-sidebar-hover">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-white font-semibold text-lg">Spartan</span>
          </div>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-text-sidebar hover:text-white transition-colors"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto sidebar-scroll py-4 px-3">
          {sidebarSections.map((section, sectionIndex) => (
            <div key={section.title} className={sectionIndex > 0 ? 'mt-6' : ''}>
              <h3 className="px-3 text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-lg
                          text-sm font-medium transition-colors duration-150
                          ${
                            isActive
                              ? 'bg-brand-primary text-white'
                              : 'text-text-sidebar hover:bg-layout-sidebar-hover hover:text-white'
                          }
                        `}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
