import { Leaf } from 'lucide-react';
import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
      <Leaf className="h-7 w-7 md:h-8 md:w-8 lg:h-10 lg:w-10" />
      <span className="text-xl md:text-2xl font-headline font-semibold">NutriSnap</span>
    </Link>
  );
}
