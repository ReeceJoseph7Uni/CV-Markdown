'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { name: 'Products', href: '/admin/products', icon: '🏦' },
  { name: 'Rates & Pricing', href: '/admin/rates', icon: '📈' },
  { name: 'Calculators', href: '/admin/calculators', icon: '🧮' },
  { name: 'Data Sources', href: '/admin/data-sources', icon: '🔄' },
  { name: 'Comparison Profiles', href: '/admin/comparison-profiles', icon: '⚖️' },
  { name: 'Analytics', href: '/admin/analytics', icon: '📉' },
  { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  { name: 'Users', href: '/admin/users', icon: '👥' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              ER
            </div>
            <div>
              <div className="font-bold text-white">EveryRandSA</div>
              <div className="text-xs text-gray-400">Admin Dashboard</div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  )}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 py-4 border-t border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                R
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Reece Josephs</p>
                <p className="text-xs text-gray-400 truncate">Admin</p>
              </div>
              <Link href="/admin/login" className="text-gray-400 hover:text-white text-xs">
                Logout
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
