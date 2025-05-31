import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
}

export function PageContainer({ children, title }: PageContainerProps) {
  return (
    <div className="container mx-auto max-w-screen-xl px-4 md:px-8 lg:px-12 py-6 md:py-8 lg:py-12">
      {title && (
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold mb-6 md:mb-8 text-foreground leading-tight md:leading-snug lg:leading-tight">
          {title}
        </h1>
      )}
      {children}
    </div>
  );
}
