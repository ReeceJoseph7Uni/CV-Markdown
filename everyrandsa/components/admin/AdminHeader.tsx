'use client';

import { Bell, Search, RefreshCw } from 'lucide-react';
import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products Management',
  '/admin/products/new': 'New Product',
  '/admin/rates': 'Rates & Pricing',
  '/admin/calculators': 'Calculators Management',
  '/admin/sources': 'Data Sources & Refresh',
  '/admin/profiles': 'Comparison Profiles',
  '/admin/analytics': 'Analytics & Monitoring',
  '/admin/settings': 'Settings',
};

export function AdminHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || pageTitles['/admin'];

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 shrink-0">
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        <p className="text-xs text-gray-500">EveryRandSA Admin</p>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center relative">
        <Search className="absolute left-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Quick search..."
          className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
        />
      </div>

      {/* Sync button */}
      <button className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
        <RefreshCw className="h-4 w-4" />
        <span className="hidden sm:inline">Sync Now</span>
      </button>

      {/* Notifications */}
      <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
        <Bell className="h-5 w-5" />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
      </button>
    </header>
  );
}
