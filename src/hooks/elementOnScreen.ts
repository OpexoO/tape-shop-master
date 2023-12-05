import { RefObject, useEffect, useRef, useState } from 'react';

export interface IntersectionObserverInit {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export default function useElementOnScreen<T extends HTMLElement>(
  options?: IntersectionObserverInit,
): [RefObject<T>, boolean] {
  const containerRef = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef?.current;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    if (el) {
      observer.observe(el);
    }
    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, [containerRef, options]);

  return [containerRef, isVisible];
}
