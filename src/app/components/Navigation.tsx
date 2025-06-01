'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDaysIcon, ClipboardIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import LogoutButton from './LogoutButton';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Clean Home</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/calendar"
                className={`${
                  isActive('/calendar')
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <CalendarDaysIcon className="h-5 w-5 mr-1" />
                Calendrier
              </Link>
              <Link
                href="/tasks"
                className={`${
                  isActive('/tasks')
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <ClipboardIcon className="h-5 w-5 mr-1" />
                Tâches
              </Link>
              <Link
                href="/history"
                className={`${
                  isActive('/history')
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <ChartBarIcon className="h-5 w-5 mr-1" />
                Historique
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
} 