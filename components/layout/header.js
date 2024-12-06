'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu } from '@headlessui/react';
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <header className="bg-black shadow-lg shadow-red-900/50 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/placeholder-logo.svg"
            alt="Logo"
            width={40}
            height={40}
            className="w-10 h-10"
          />
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900 border border-red-900 
                focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-900/50 
                text-red-400 placeholder-gray-500 transition-all duration-300
                selection:bg-red-900/50 selection:text-red-200"
              style={{
                caretColor: '#f87171'
              }}
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-red-500 
              transition-colors duration-300 group-focus-within:text-red-400" />
          </div>
        </div>

        {/* User Menu */}
        <Menu as="div" className="relative">
          <Menu.Button className="inline-flex items-center">
            <UserCircleIcon className="h-8 w-8 text-red-500 hover:text-red-400" />
          </Menu.Button>

          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-gray-900 rounded-md 
            shadow-lg ring-1 ring-red-900 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/account"
                    className={`${
                      active ? 'bg-gray-800 text-red-400' : 'text-gray-200'
                    } block px-4 py-2 text-sm`}
                  >
                    My Account
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/record"
                    className={`${
                      active ? 'bg-gray-800 text-red-400' : 'text-gray-200'
                    } block px-4 py-2 text-sm`}
                  >
                    Record Audio
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/library"
                    className={`${
                      active ? 'bg-gray-800 text-red-400' : 'text-gray-200'
                    } block px-4 py-2 text-sm`}
                  >
                    My Library
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-800 text-red-400' : 'text-gray-200'
                    } block w-full text-left px-4 py-2 text-sm`}
                  >
                    Sign Out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>
    </header>
  );
}