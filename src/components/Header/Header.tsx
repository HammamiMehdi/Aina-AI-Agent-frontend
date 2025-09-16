'use client'

import { useEffect, useRef, useState } from 'react'
import { Bars3Icon, CurrencyDollarIcon, DocumentTextIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import { Link } from 'react-router-dom'



interface NavItem {
  name: string
  href: string
  icon?: React.ReactNode
}

// Add icons for each nav item
const navigation: NavItem[] = [
  { name: 'Aïna DOC', href: '/chat/Aïna DOC', icon: <DocumentTextIcon className="h-5 w-5 mr-2 inline" /> },
  { name: 'Aïna Finance', href: '/chat/Aïna Finance', icon: <CurrencyDollarIcon className="h-5 w-5 mr-2 inline" /> },
  { name: 'Aïna Vision', href: '/chat/Aïna Vision', icon: <EyeIcon className="h-5 w-5 mr-2 inline" /> },
]



export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  

const logoRef = useRef<HTMLImageElement>(null);

useEffect(() => {
  const interval = setInterval(() => {
    if (logoRef.current) {
      logoRef.current.classList.remove("animate-logo");
      void logoRef.current.offsetWidth; // trigger reflow
      logoRef.current.classList.add("animate-logo");
    }
  }, 20000); // toutes les 30 secondes

  // lancer la première animation au montage si tu veux
  if (logoRef.current) logoRef.current.classList.add("animate-logo");

  return () => clearInterval(interval);
}, []);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between p-6 lg:px-8">
        
        {/* Logo */}
        {/* <div className="flex lg:flex-1 items-center space-x-2">
          <Link to="/" className="flex items-center -m-1.5 p-1.5">
            <span className="sr-only">Aïna AI Agent</span>
            <img
              alt="Aïna AI Agent Logo"
              src="/aina-clim-mag-v7.png"
              className="h-12 w-auto"
            /> 
            
          </Link>
        </div> */}
        <div className="flex lg:flex-1 items-center space-x-2">
          <Link to="/" className="flex items-center -m-1.5 p-1.5 space-x-4">
            <span className="sr-only">Aïna AI Agent</span>

            <img
              ref={logoRef}
              alt="Logo Aïna"
              src="/aina-clim-mag-v8.png"
              className="h-12 w-auto"
            />

            <img
              alt="Logo partenaire"
              src="/aina-clim-mag-v9.png"
              className="h-12 w-auto"
            />
            
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-gray-900 dark:text-white font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center"
            >
              {item.icon}
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
                className="flex items-center rounded-lg px-3 py-2 text-gray-900 dark:text-white font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}