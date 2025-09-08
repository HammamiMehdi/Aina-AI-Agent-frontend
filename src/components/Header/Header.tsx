'use client'

import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import { Link } from 'react-router-dom'

interface NavItem {
  name: string
  href: string
}

const navigation: NavItem[] = [
  { name: 'Aïna DOC', href: '/chat/Aïna DOC' },
  { name: 'Aïna Finance', href: '/chat/Aïna Finance' },
  { name: 'Aïna Vision', href: '/chat/Aïna Vision' },
  { name: 'Aïna OCR', href: '/chat/Aïna OCR' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between p-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex lg:flex-1 items-center space-x-2">
          <Link to="/" className="flex items-center -m-1.5 p-1.5">
            <span className="sr-only">Aïna AI Agent</span>
            <img
              alt="Aïna AI Agent Logo"
              src="/logo-blue.png" // ← Replace with your logo path
              className="h-12 w-auto"
            /> 
            <span className="text-2xl font-bold text-gray-900 dark:text-white ml-4">
              aïna
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-gray-900 dark:text-white font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right side: theme toggle + mobile menu button */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 p-6 lg:hidden">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <img
                alt="Aïna AI Agent Logo"
                src="/logo-blue.png"
                className="h-10 w-auto"
              />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md p-2.5 text-gray-700 dark:text-gray-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-gray-900 dark:text-white font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}