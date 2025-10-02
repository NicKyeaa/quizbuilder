'use client';
import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider } from './ThemeContext';
import NavMenu from './components/NavMenu';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <HeroUIProvider>
        <NavMenu />
        {children}
      </HeroUIProvider>
    </ThemeProvider>
  );
}
