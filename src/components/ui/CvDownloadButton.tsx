const CV_HREF = `${import.meta.env.BASE_URL}Suprim_Tamang_CV.pdf`;

const BASE = 'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors';

const VARIANTS = {
  solid: 'bg-[var(--amber)] font-semibold text-[#1a1412] hover:brightness-110',
  outline: 'border border-[var(--line)] hover:border-[var(--amber)] hover:text-[var(--amber)]',
} as const;

interface CvDownloadButtonProps {
  variant?: keyof typeof VARIANTS;
}

export function CvDownloadButton({ variant = 'outline' }: CvDownloadButtonProps) {
  return (
    <a href={CV_HREF} download="Suprim_Tamang_CV.pdf" className={`${BASE} ${VARIANTS[variant]}`}>
      Download CV
      <span aria-hidden="true">↓</span>
      <span className="sr-only">(PDF)</span>
    </a>
  );
}

export default CvDownloadButton;
