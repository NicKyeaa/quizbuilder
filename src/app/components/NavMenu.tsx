'use client';
import Link from 'next/link';
import { Button } from '@heroui/react';
import { useTheme } from '../ThemeContext';

export default function NavMenu() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      style={{
        padding: '1rem',
        borderBottom: '1px solid #eee',
        position: 'relative',
      }}
    >
      <Button as={Link} href='/question-management'>
        Question Management
      </Button>
      <Button
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0',
          color: theme === 'dark' ? '#fff' : '#000',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer',
        }}
      >
        {theme === 'dark' ? 'Light' : 'Dark'}
      </Button>
    </nav>
  );
}
