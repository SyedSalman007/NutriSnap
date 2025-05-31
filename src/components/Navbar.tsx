"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Home, ScanLine, UserCircle, BookOpenText } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/log-meal', label: 'Log Meal', icon: ScanLine },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-2 lg:space-x-4">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          asChild
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Link href={item.href} className="flex items-center gap-2">
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
