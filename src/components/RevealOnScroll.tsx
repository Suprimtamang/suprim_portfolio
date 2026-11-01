import { useEffect, useRef, type CSSProperties, type HTMLAttributes } from 'react';

interface RevealOnScrollProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'article';
  delay?: number;
}

export function RevealOnScroll({
  as: Element = 'div',
  children,
  className = '',
  delay = 0,
  style,
  ...props
}: RevealOnScrollProps) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    element.classList.add('is-reveal-pending');
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.classList.add('is-revealed');
      element.classList.remove('is-reveal-pending');
      observer.unobserve(element);
    }, { threshold: 0.15 });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Element
      {...props}
      className={`reveal-on-scroll ${className}`.trim()}
      ref={(element: HTMLElement | null) => {
        elementRef.current = element;
      }}
      style={{ ...style, '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Element>
  );
}
