import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
}

export function PageContainer({ children, title }: PageContainerProps) {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {title && (
        <h1 className="text-3xl font-headline font-bold mb-8 text-foreground">
          {title}
        </h1>
      )}
      {children}
    </div>
  );
}
