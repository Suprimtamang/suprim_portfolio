import { useEffect, useRef, type CSSProperties } from 'react';

interface WordRevealProps {
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  id?: string;
  suffix?: string;
  text: string;
}

export function WordReveal({ as: Heading = 'h2', className, id, suffix = '', text }: WordRevealProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const accessibleText = `${text.replace(/\s+/g, ' ').trim()}${suffix}`;
  const lines = text.split('\n');
  let wordIndex = 0;

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    heading.classList.add('is-word-reveal-ready');

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      heading.classList.add('is-revealed');
      observer.unobserve(heading);
    }, { threshold: 0.3 });

    observer.observe(heading);
    return () => observer.disconnect();
  }, []);

  return (
    <Heading aria-label={accessibleText} className={className} id={id} ref={headingRef}>
      {lines.map((line, lineIndex) => (
        <span aria-hidden="true" className="word-reveal__line" key={`${lineIndex}-${line}`}>
          {line.trim().split(/\s+/).filter(Boolean).map((word) => {
            const index = wordIndex++;
            return (
              <span className="word-reveal__word" key={`${index}-${word}`} style={{ '--word-index': index } as CSSProperties}>
                {word}
              </span>
            );
          })}
        </span>
      ))}
      {suffix && <span aria-hidden="true" className="word-reveal__suffix">{suffix}</span>}
    </Heading>
  );
}
