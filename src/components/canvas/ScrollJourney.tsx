import { Scroll, ScrollControls, useScroll } from '@react-three/drei';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { ScrollCameraRig } from './ScrollCameraRig';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface ScrollJourneyProps {
  children?: ReactNode;
  pages?: number;
  damping?: number;
}

export function ScrollJourney({ children, pages = 5, damping = 0.25 }: ScrollJourneyProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <ScrollControls damping={prefersReducedMotion ? 0 : damping} pages={pages}>
      <ScrollCameraRig />
      <ScrollKeyboardAccess />
      <Scroll>{children}</Scroll>
    </ScrollControls>
  );
}

export function ScrollKeyboardAccess() {
  const scroll = useScroll();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const element = scroll.el;
    element.setAttribute('tabindex', '0');
    element.setAttribute('aria-label', 'Scroll through the cinematic bridge journey');

    const onKeyDown = (event: KeyboardEvent) => {
      const page = element.clientHeight * 0.85;
      const amount =
        event.key === 'ArrowDown' || event.key === 'PageDown'
          ? page
          : event.key === 'ArrowUp' || event.key === 'PageUp'
            ? -page
            : 0;

      if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        element.scrollTo({
          top: event.key === 'Home' ? 0 : element.scrollHeight,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      } else if (amount) {
        event.preventDefault();
        element.scrollBy({
          top: amount,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      }
    };

    element.addEventListener('keydown', onKeyDown);
    return () => element.removeEventListener('keydown', onKeyDown);
  }, [prefersReducedMotion, scroll.el]);

  return null;
}

export default ScrollJourney;
