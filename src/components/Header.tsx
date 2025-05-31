import { AppLogo } from './AppLogo';
import { Navbar } from './Navbar';
import { MobileMenu } from './MobileMenu';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-screen-xl px-4 md:px-8 lg:px-12 flex h-16 items-center justify-between">
        <AppLogo />
        <div className="md:hidden">
          <MobileMenu />
        </div>
        <div className="hidden md:block">
          <Navbar />
        </div>
      </div>
    </header>
  );
}
