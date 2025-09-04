'use client';
import Link from 'next/link';
import { Button } from '@heroui/react';

export default function NavMenu() {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
      <Button as={Link} href='/question-management'>
        Question Management
      </Button>
    </nav>
  );
}
