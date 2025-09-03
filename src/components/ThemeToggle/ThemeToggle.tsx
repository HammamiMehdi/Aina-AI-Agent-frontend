// src/components/ThemeToggle.tsx
'use client'
import { useEffect, useState } from 'react';




export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.classList.remove(theme === 'dark' ? 'light' : 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <button
  onClick={toggleTheme}
  className="px-3 py-1 rounded-md bg-transparent text-gray-900 dark:text-gray-100 font-semibold hover:bg-white/10 dark:hover:bg-white/10 transition"
>
  {theme === 'light' ? '🌙' : '☀️'}
</button>
  );
}
