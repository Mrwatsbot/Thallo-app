'use client';

import { useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface MobilePageNavigatorProps {
  children: React.ReactNode;
  pages: Array<{ path: string; name: string }>;
}

export function MobilePageNavigator({ children, pages }: MobilePageNavigatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isHorizontalSwipe = useRef<boolean | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentIndex = pages.findIndex(p => p.path === pathname);

  // Prefetch adjacent pages for instant loading
  useEffect(() => {
    if (currentIndex > 0) {
      router.prefetch(pages[currentIndex - 1].path);
    }
    if (currentIndex < pages.length - 1) {
      router.prefetch(pages[currentIndex + 1].path);
    }
  }, [currentIndex, pages, router]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const diffX = e.touches[0].clientX - touchStartX.current;
    const diffY = e.touches[0].clientY - touchStartY.current;
    
    // Determine if this is a horizontal swipe
    if (isHorizontalSwipe.current === null && (Math.abs(diffX) > 10 || Math.abs(diffY) > 10)) {
      isHorizontalSwipe.current = Math.abs(diffX) > Math.abs(diffY);
    }
    
    // Prevent default scrolling if horizontal swipe
    if (isHorizontalSwipe.current) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isHorizontalSwipe.current) {
      isHorizontalSwipe.current = null;
      return;
    }
    
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 60;

    let targetPath: string | null = null;

    if (diffX > threshold && currentIndex < pages.length - 1) {
      // Swipe left - go to next page
      targetPath = pages[currentIndex + 1].path;
    } else if (diffX < -threshold && currentIndex > 0) {
      // Swipe right - go to previous page
      targetPath = pages[currentIndex - 1].path;
    }

    if (targetPath) {
      // Use View Transition API if available, otherwise just navigate
      if ('startViewTransition' in document) {
        (document as any).startViewTransition(() => {
          router.push(targetPath!);
        });
      } else {
        router.push(targetPath);
      }
    }
    
    isHorizontalSwipe.current = null;
  };

  // Hidden prefetch links for all pages
  const prefetchLinks = pages.map(page => (
    <Link key={page.path} href={page.path} prefetch={true} style={{ display: 'none' }} aria-hidden="true">
      {page.name}
    </Link>
  ));

  return (
    <>
      {prefetchLinks}
      <div
        ref={contentRef}
        className="page-transition-content"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </>
  );
}
