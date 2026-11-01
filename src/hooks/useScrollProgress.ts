import { useEffect, type RefObject } from 'react';

type UseScrollProgressOptions = {
  cssVariable?: `--${string}`;
  mapProgress?: (progress: number) => number;
  progressMode?: 'section' | 'viewport';
};

export function useScrollProgress<T extends HTMLElement>(
  elementRef: RefObject<T | null>,
  {
    cssVariable = '--scroll-progress',
    mapProgress,
    progressMode = 'viewport',
  }: UseScrollProgressOptions = {},
) {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const update = () => {
      frame = 0;
      if (reducedMotion.matches) {
        element.style.setProperty('--scroll-progress', '1');
        element.style.setProperty(cssVariable, String(mapProgress?.(1) ?? 1));
        return;
      }

      const bounds = element.getBoundingClientRect();
      const travelDistance = window.innerHeight + bounds.height;
      const progress = progressMode === 'section'
        ? Math.max(0, Math.min(1, -bounds.top / Math.max(1, bounds.height)))
        : travelDistance > 0
          ? Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / travelDistance))
          : 0;
      element.style.setProperty('--scroll-progress', String(progress));
      element.style.setProperty(cssVariable, String(mapProgress?.(progress) ?? progress));
    };

    const scheduleUpdate = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(element);
    resizeObserver.observe(document.documentElement);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    reducedMotion.addEventListener('change', scheduleUpdate);
    update();

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      reducedMotion.removeEventListener('change', scheduleUpdate);
      resizeObserver.disconnect();
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [cssVariable, elementRef, mapProgress, progressMode]);
}
