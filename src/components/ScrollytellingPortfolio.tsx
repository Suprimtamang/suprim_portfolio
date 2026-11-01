import { useEffect, useRef, useState, type RefObject } from 'react';
import { RevealOnScroll } from './RevealOnScroll';
import { ScrollFillRule } from './ScrollFillRule';
import { WordReveal } from './WordReveal';
import { useScrollProgress } from '../hooks/useScrollProgress';
import './ScrollytellingPortfolio.css';

const MENU_LINKS = [
  { id: 'chapter-works', label: 'WORKS', number: '01' },
  { id: 'chapter-journey', label: 'TIMELINE', number: '02' },
  { id: 'chapter-personal', label: 'ABOUT ME', number: '03' },
  { id: 'chapter-contact', label: 'CONTACT', number: '04' },
] as const;

const PROJECTS = [
  {
    id: 'sajuro',
    name: 'Sajuro — AdSecOps Sandbox',
    year: '2025',
    role: 'Security systems engineer',
    scope: 'Graph API anomaly detection and token quarantine',
    stack: 'Java · Spring Boot · React',
    brief:
      'Hey Suprim, rogue Graph API tokens and unauthorized permission mutations are hitting enterprise ad accounts. Build us an automated AdSecOps sentinel that detects anomalies and quarantines tokens in real time...',
    description:
      'An interactive AdSecOps sandbox for inspecting suspicious Graph API activity and demonstrating how an anomalous token can be isolated.',
    architecture: [
      ['Perimeter Monitor', '@Scheduled 60s anomaly polling and webhook ingest for Meta Graph API v20.'],
      ['Meta API Service', 'Rate-limited Graph API access and token lifecycle coordination.'],
      ['Token Vault', 'AES-256-GCM encrypted token storage with automatic refresh.'],
      ['Auth / JWT', 'Authenticated requests carry tenant context through the application.'],
      ['PostgreSQL 16', 'Row-Level Security (RLS) scopes tenant data at the database layer.'],
    ],
  },
  {
    id: 'simplify',
    name: 'Simplify — Portugal Admission Guide',
    year: '2024–present',
    role: 'Founder',
    scope: 'A practical roadmap for international university applicants',
    stack: 'Product design · Web · Admissions',
    brief:
      "International students applying to Portuguese universities are getting lost in DGES equivalences, visas, and NIF paperwork. Let's turn our 10+ successful MVP student admissions into a step-by-step interactive roadmap...",
    description:
      'A clearer route through the Portuguese university application process, informed by more than ten successful MVP student admissions.',
    architecture: [
      ['Discover', 'Understand goals, application windows, and target programs.'],
      ['Prepare', 'Collect documents and map equivalence requirements.'],
      ['Apply', 'Track submissions and university-specific next steps.'],
      ['Arrive', 'Keep visa, NIF, and relocation actions in one roadmap.'],
    ],
  },
  {
    id: 'vfs',
    name: 'POSIX Virtual File System (C Kernel)',
    year: '2023',
    role: 'Systems engineer',
    scope: 'A low-level filesystem simulation built from first principles',
    stack: 'C · POSIX concepts · Inodes',
    brief:
      'Design a custom low-level file system simulation in C from scratch—managing superblocks, inode tables, block bitmaps, and fs_ls / fs_write syscalls...',
    description:
      'A compact virtual filesystem exploring the structures and operations beneath familiar file and directory commands.',
    architecture: [
      ['Superblock', 'Stores filesystem-wide capacity and layout information.'],
      ['Inodes', 'Track file metadata and references to allocated data blocks.'],
      ['Bitmaps', 'Represent available and allocated inode and data-block slots.'],
      ['Syscalls', 'Exercise the filesystem through fs_ls and fs_write operations.'],
    ],
  },
  {
    id: 'ocaml',
    name: 'OCaml Functional Interpreter',
    year: '2023',
    role: 'Language tooling engineer',
    scope: 'A functional interpreter with static type inference',
    stack: 'OCaml · AST · Hindley–Milner',
    brief:
      'Engineer a type-safe functional language interpreter and Hindley-Milner static type-checker from first principles in OCaml...',
    description:
      'A small language implementation that connects expression parsing, evaluation, and type inference into one readable pipeline.',
    architecture: [
      ['Syntax', 'Represent expressions as a compact abstract syntax tree.'],
      ['Evaluate', 'Interpret expressions in an environment of bound values.'],
      ['Infer', 'Unify type variables to derive Hindley–Milner type judgments.'],
    ],
  },
] as const;

type Project = (typeof PROJECTS)[number];
type ProjectId = Project['id'];

const MILESTONES = [
  {
    id: 'nepalese-in-tech',
    image: '/nepaleseintech.png',
    imageAlt: 'Nepalese in Tech Europe logo',
    date: '2026 – Present',
    organization: 'Nepalese in Tech Europe',
    role: 'Co-Founder & Community Builder',
    detail: 'Building practical programs and AI for Everyone.',
  },
  {
    image: '/Tp.png',
    imageAlt: 'Teleperformance logo',
    date: '2026 – Present',
    organization: 'Tier-2 Enterprise Technical Support',
    role: 'Top Performer',
    detail: 'Supporting Meta Ads infrastructure.',
  },
  {
    monogram: 'S',
    date: '2024 – Present',
    organization: 'Simplify',
    role: 'Founder',
    detail: 'Guided 10+ university admissions in the MVP.',
  },
  {
    date: '2024 – Present',
    organization: 'NOVA FCT',
    role: 'BSc Computer Science & Engineering',
    detail: 'Studying in Lisbon, Portugal.',
  },
  {
    image: '/quidgest.jpeg',
    imageAlt: 'Quidgest logo',
    date: '2023',
    organization: 'Quidgest',
    role: 'Software Engineer Apprentice',
    detail: 'Worked with the Genio low-code platform.',
  },
] as const;

const MILESTONE_QUIPS = [
  'Growing the community, one connection at a time.',
  'Calm under pressure; pixels in their place.',
  'Making the next step easier to find.',
  'Still learning, still shipping.',
  'First full-stack steps, built to last.',
] as const;

const PERSONAL_CARDS = [
  {
    title: 'Kathmandu (1,400m) ➔ Lisbon (0m)',
    caption: 'Nepali · English · Portuguese · Hindi',
    style: 'personal-card--portrait',
  },
  {
    title: 'Talent & Community',
    caption: 'Magma Studio @ NOVA FCT',
    style: 'personal-card--magma',
  },
  {
    title: 'Off-Screen Builder.',
    caption: 'Bought my first house at 22.',
    style: 'personal-card--terracotta',
  },
  {
    title: 'Pitching Simplify',
    caption: 'Fundação Aga Khan Portugal',
    style: 'personal-card--pitch',
  },
] as const;

const ENDORSEMENTS = [
  {
    name: 'Joana Bogalho',
    role: 'Operations Supervisor · Team Leader at Teleperformance',
    date: 'April 20, 2026',
    image: '/joana-bogalho.png',
    quote:
      'I had the pleasure of supervising Suprim for a significant period... He is a remarkably fast learner—curious, proactive, and always eager to refine his abilities... He developed strong expertise with Meta Pixel, Meta Ads, and the troubleshooting of complex advertising-related technical issues... calm problem-solving that makes him incredibly reliable in high-pressure situations.',
  },
  {
    name: 'Alexandre Batalha',
    role: 'Instructional Designer · Mentor at Quidgest',
    date: 'January 26, 2025',
    image: '/alexandre-batalha.png',
    quote:
      'Had the pleasure to deliver a Full-Stack Development training to Suprim... I was impressed by his enthusiasm and commitment to every task he undertook. Suprim is an exceptionally quick learner with a proactive, hands-on approach to problem-solving.',
  },
] as const;

const mapHeroWidth = (progress: number) => 92 - 10 * Math.sin(Math.PI * progress);

const SAJURO_VIEWS = [
  {
    id: 'identity',
    label: 'Identity Points of Compromise',
    detail: 'Investigate suspicious identities and the signals surrounding a compromise.',
  },
  {
    id: 'audit',
    label: 'Ad Infrastructure Audit',
    detail: 'Review advertising infrastructure, identify risk, and track containment.',
  },
  {
    id: 'appeals',
    label: 'Automated Client Communication & Appeals Pack',
    detail: 'Prepare a clear client update and supporting appeal materials.',
  },
] as const;

type SajuroViewId = (typeof SAJURO_VIEWS)[number]['id'];

function getVideoTime(progress: number) {
  const ranges = [
    { start: 0, end: 0.18, from: 0, to: 6.2 },
    { start: 0.18, end: 0.42, from: 6.2, to: 18.5 },
    { start: 0.42, end: 0.66, from: 18.5, to: 31 },
    { start: 0.66, end: 0.82, from: 31, to: 36.5 },
    { start: 0.82, end: 1, from: 36.5, to: 47.5 },
  ];
  const range = ranges.find((item) => progress <= item.end) ?? ranges[ranges.length - 1];
  const amount = Math.max(0, Math.min(1, (progress - range.start) / (range.end - range.start)));
  return range.from + (range.to - range.from) * amount;
}

function BriefNote({ project, onClose }: { project: Project; onClose: () => void }) {
  const [typedBrief, setTypedBrief] = useState('');

  useEffect(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTypedBrief(project.brief.slice(0, index));
      if (index >= project.brief.length) window.clearInterval(timer);
    }, 22);
    return () => window.clearInterval(timer);
  }, [project.brief]);

  return (
    <div className="portfolio-overlay portfolio-overlay--paper" onMouseDown={onClose}>
      <section
        aria-labelledby="brief-title"
        aria-modal="true"
        className="brief-note"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <button aria-label="Close brief" className="overlay-close" onClick={onClose} type="button">
          ×
        </button>
        <span className="brief-note__eyebrow">INCOMING BRIEF · {project.year}</span>
        <h2 id="brief-title">{project.name}</h2>
        <p className="brief-note__copy">
          {typedBrief}
          <span aria-hidden="true" className="typing-caret" />
        </p>
        <span className="brief-note__signature">— The brief</span>
      </section>
    </div>
  );
}

function ProjectCaseStudy({
  project,
  onClose,
  onVideoScroll,
}: {
  project: Project;
  onClose: () => void;
  onVideoScroll: (scrollTop: number) => void;
}) {
  const [quarantined, setQuarantined] = useState(false);
  const [admissionStage, setAdmissionStage] = useState(0);
  const [allocatedBlocks, setAllocatedBlocks] = useState<number[]>([]);
  const [showTyped, setShowTyped] = useState(false);
  const [sajuroView, setSajuroView] = useState<SajuroViewId>('identity');
  const stages = ['Discover', 'Prepare', 'Apply', 'Arrive'];
  const isSajuro = project.id === 'sajuro';
  const isSimplify = project.id === 'simplify';
  const isVfs = project.id === 'vfs';

  return (
    <div className="portfolio-overlay portfolio-overlay--case" onScroll={(event) => onVideoScroll(event.currentTarget.scrollTop)}>
      <main aria-labelledby="case-title" className="case-study">
        <div className="case-study__topline">
          <span>SELECTED WORK / {project.year}</span>
          <button aria-label="Close case study" className="overlay-close" onClick={onClose} type="button">
            ×
          </button>
        </div>
        <p className="eyebrow">CASE STUDY · {project.stack}</p>
        <h1 id="case-title">{project.name}</h1>
        <p className="case-study__intro">{project.description}</p>

        <div className="case-meta">
          <div><span>ROLE</span><strong>{project.role}</strong></div>
          <div><span>SCOPE</span><strong>{project.scope}</strong></div>
          <div><span>YEAR</span><strong>{project.year}</strong></div>
        </div>

        <section className="case-section">
          <p className="eyebrow">{isSajuro ? 'SYSTEM ARCHITECTURE' : 'HOW IT WORKS'}</p>
          {isSajuro && (
            <figure className="sajuro-architecture">
              <img alt="Sajuro architecture: React dashboard connected to Spring Boot 3.3 sajuro-core, Meta Graph API v20, and PostgreSQL 16 with row-level security." src="/sajuro-architecture.png" />
              <figcaption>SAJURO-CORE · SPRING BOOT 3.3 · TENANT-AWARE DEFENSE IN DEPTH</figcaption>
            </figure>
          )}
          <div className="architecture-list">
            {project.architecture.map(([label, detail], index) => (
              <article className="architecture-step" key={label}>
                <span>0{index + 1}</span>
                <div><h2>{label}</h2><p>{detail}</p></div>
              </article>
            ))}
          </div>
        </section>

        {isSajuro && (
          <section aria-label="Sajuro dashboard views" className="sajuro-dashboard">
            <div className="project-preview__heading">
              <div>
                <p className="eyebrow">SAJURO INCIDENT RESPONSE PORTAL</p>
                <span>Dashboard preview · illustrative interface</span>
              </div>
            </div>
            <div aria-label="Dashboard preview sections" className="sajuro-dashboard__tabs" role="tablist">
              {SAJURO_VIEWS.map((view) => (
                <button
                  aria-selected={sajuroView === view.id}
                  className={sajuroView === view.id ? 'is-active' : ''}
                  key={view.id}
                  onClick={() => setSajuroView(view.id)}
                  role="tab"
                  type="button"
                >
                  {view.label}
                </button>
              ))}
            </div>
            <p className="sajuro-dashboard__detail">
              {SAJURO_VIEWS.find((view) => view.id === sajuroView)?.detail}
            </p>
            <img
              alt={`Sajuro Incident Response Portal dashboard preview — ${SAJURO_VIEWS.find((view) => view.id === sajuroView)?.label}`}
              className="sajuro-dashboard__image"
              src="/sajuro-dashboard-portal.png"
            />
            <p className="sajuro-dashboard__caption">The supplied portal screenshot includes all three response workspaces.</p>
          </section>
        )}

        {isSimplify && (
          <section aria-label="Simplify website screenshots and live app" className="simplify-showcase">
            <div className="project-preview__heading">
              <div>
                <p className="eyebrow">SIMPLIFY · PORTUGAL ADMISSION GUIDE</p>
                <span>Product screenshots</span>
              </div>
              <a
                className="simplify-showcase__link"
                href="https://portugal-admission-guide-app-production-y4byxb.laravel.cloud"
                rel="noopener noreferrer"
                target="_blank"
              >
                Visit the live app ↗
              </a>
            </div>
            <div className="simplify-showcase__gallery">
              <figure>
                <img alt="Simplify Portugal Admission Guide page presenting its student guidance features." src="/simplify.png" />
                <figcaption>Portugal Admission Guide</figcaption>
              </figure>
              <figure>
                <img alt="Simplify applicant roadmap interface with route eligibility guidance and application steps." src="/simplify1.png" />
                <figcaption>Applicant roadmap</figcaption>
              </figure>
            </div>
          </section>
        )}

        <section aria-label="Interactive project preview" className="project-preview">
          <div className="project-preview__heading">
            <p className="eyebrow">INTERACTIVE PREVIEW</p>
            <span>Illustrative demo · no live data</span>
          </div>
          {isSajuro && (
            <div className="simulator simulator--security">
              <div><span className="status-dot" /> GRAPH API TOKEN <b>{quarantined ? 'QUARANTINED' : 'ANOMALY DETECTED'}</b></div>
              <pre>{`Scope:     ads_management\nSource IP: unauthorized\nMutation:  permission change`}</pre>
              <button className="pill-button pill-button--dark" onClick={() => setQuarantined((value) => !value)} type="button">
                {quarantined ? 'Restore demo token' : 'Quarantine demo token'}
              </button>
            </div>
          )}
          {isSimplify && (
            <div className="simulator simulator--admission">
              <div className="admission-track">
                {stages.map((stage, index) => (
                  <button
                    aria-current={index === admissionStage ? 'step' : undefined}
                    className={index <= admissionStage ? 'is-complete' : ''}
                    key={stage}
                    onClick={() => setAdmissionStage(index)}
                    type="button"
                  >
                    <span>0{index + 1}</span>{stage}
                  </button>
                ))}
              </div>
              <p><strong>{stages[admissionStage]}.</strong> Your next step is clearer when every requirement has a place.</p>
              <button className="pill-button" onClick={() => setAdmissionStage((stage) => (stage + 1) % stages.length)} type="button">
                Next stage →
              </button>
              <p className="simulator__note">Impulso Local pitch: make Portugal’s admissions journey easier to understand and act on.</p>
            </div>
          )}
          {isVfs && (
            <div className="simulator simulator--allocator">
              <div className="inode-grid" aria-label="Inode block allocator">
                {Array.from({ length: 20 }, (_, index) => (
                  <button
                    aria-label={`Block ${index + 1}${allocatedBlocks.includes(index) ? ', allocated' : ', free'}`}
                    aria-pressed={allocatedBlocks.includes(index)}
                    className={allocatedBlocks.includes(index) ? 'is-allocated' : ''}
                    key={index}
                    onClick={() => setAllocatedBlocks((blocks) => (
                      blocks.includes(index) ? blocks.filter((block) => block !== index) : [...blocks, index]
                    ))}
                    type="button"
                  />
                ))}
              </div>
              <p>{allocatedBlocks.length} / 20 data blocks allocated · click a block to toggle it</p>
            </div>
          )}
          {!isSajuro && !isSimplify && !isVfs && (
            <div className="simulator simulator--interpreter">
              <pre>{`let compose f g x = f (g x)\ncompose : ('b -> 'c) -> ('a -> 'b) -> 'a -> 'c`}</pre>
              <button className="pill-button" onClick={() => setShowTyped((value) => !value)} type="button">
                {showTyped ? 'Hide type inference' : 'Infer expression type'}
              </button>
              {showTyped && <p className="inferred-type">Type inferred: <code>(&apos;b → &apos;c) → (&apos;a → &apos;b) → &apos;a → &apos;c</code></p>}
            </div>
          )}
        </section>
      </main>
      <button className="back-to-works" onClick={onClose} type="button">← Back to Works</button>
    </div>
  );
}

interface MattedVideoProps {
  ariaLabel: string;
  autoPlay?: boolean;
  canvasRef?: RefObject<HTMLCanvasElement | null>;
  className: string;
  loop?: boolean;
  matteRef: RefObject<HTMLVideoElement | null>;
  matteSrc: string;
  sourceRef: RefObject<HTMLVideoElement | null>;
  sourceSrc: string;
}

function MattedVideo({
  ariaLabel,
  autoPlay = false,
  canvasRef: externalCanvasRef,
  className,
  loop = false,
  matteRef,
  matteSrc,
  sourceRef,
  sourceSrc,
}: MattedVideoProps) {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = externalCanvasRef ?? internalCanvasRef;

  useEffect(() => {
    const source = sourceRef.current;
    const matte = matteRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { willReadFrequently: true });
    const matteCanvas = document.createElement('canvas');
    const matteContext = matteCanvas.getContext('2d', { willReadFrequently: true });

    if (!source || !matte || !canvas || !context || !matteContext) {
      console.error('Unable to initialize the transparent clay video canvas.');
      return;
    }

    let frame = 0;
    let visible = false;
    let lastRenderedTime = -1;

    const draw = () => {
      frame = 0;
      if (!visible) return;

      if (
        source.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
        && matte.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
        && !source.seeking
        && !matte.seeking
        && Math.abs(source.currentTime - lastRenderedTime) > 0.001
      ) {
        const width = matte.videoWidth;
        const height = matte.videoHeight;
        if (width > 0 && height > 0) {
          if (canvas.width !== width || canvas.height !== height) {
            canvas.width = matteCanvas.width = width;
            canvas.height = matteCanvas.height = height;
          }

          context.drawImage(source, 0, 0, width, height);
          const image = context.getImageData(0, 0, width, height);
          matteContext.drawImage(matte, 0, 0, width, height);
          const alpha = matteContext.getImageData(0, 0, width, height).data;
          for (let pixel = 0; pixel < image.data.length; pixel += 4) {
            image.data[pixel + 3] = alpha[pixel];
          }
          context.putImageData(image, 0, 0);
          lastRenderedTime = source.currentTime;
        }
      }

      frame = window.requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && frame === 0) {
        frame = window.requestAnimationFrame(draw);
      } else if (!visible && frame !== 0) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [canvasRef, matteRef, sourceRef]);

  return (
    <>
      <canvas aria-label={ariaLabel} className={className} ref={canvasRef} role="img" />
      <video
        aria-hidden="true"
        autoPlay={autoPlay}
        className="journey-media-source"
        loop={loop}
        muted
        playsInline
        preload="auto"
        ref={sourceRef}
        src={sourceSrc}
      />
      <video
        aria-hidden="true"
        autoPlay={autoPlay}
        className="journey-media-source"
        loop={loop}
        muted
        playsInline
        preload="auto"
        ref={matteRef}
        src={matteSrc}
      />
    </>
  );
}

export function ScrollytellingPortfolio() {
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroGreetingRef = useRef<HTMLParagraphElement>(null);
  const worksSectionRef = useRef<HTMLElement>(null);
  const journeySectionRef = useRef<HTMLElement>(null);
  const personalSectionRef = useRef<HTMLElement>(null);
  const contactSectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const smoothedTimeRef = useRef(0);
  const journeyStageRef = useRef<HTMLDivElement>(null);
  const journeyListRef = useRef<HTMLDivElement>(null);
  const journeyPathRef = useRef<SVGPathElement>(null);
  const runnerRef = useRef<HTMLDivElement>(null);
  const runnerVideoRef = useRef<HTMLVideoElement>(null);
  const runnerMatteRef = useRef<HTMLVideoElement>(null);
  const parachuteRef = useRef<HTMLVideoElement>(null);
  const parachuteMatteRef = useRef<HTMLVideoElement>(null);
  const parachuteCanvasRef = useRef<HTMLCanvasElement>(null);
  const credentialsRef = useRef<HTMLDivElement>(null);
  const runnerPositionRef = useRef({ x: 0, y: 0 });
  const hoveredMilestoneRef = useRef<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [videoPastHero, setVideoPastHero] = useState(false);
  const [greetingVisible, setGreetingVisible] = useState(true);
  const [hoveredMilestone, setHoveredMilestone] = useState<number | null>(null);
  const [runnerFacing, setRunnerFacing] = useState<'left' | 'right'>('right');
  const [expandedFolders, setExpandedFolders] = useState<Record<ProjectId, boolean>>({
    sajuro: false,
    simplify: false,
    vfs: false,
    ocaml: false,
  });
  const [briefProject, setBriefProject] = useState<Project | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [selectedEndorsement, setSelectedEndorsement] = useState<(typeof ENDORSEMENTS)[number] | null>(null);
  const [frontCard, setFrontCard] = useState(0);
  const [origin, setOrigin] = useState<'nepal' | 'portugal'>('nepal');

  useScrollProgress(heroSectionRef, {
    cssVariable: '--hero-width',
    mapProgress: mapHeroWidth,
    progressMode: 'section',
  });
  useScrollProgress(worksSectionRef);
  useScrollProgress(journeySectionRef);
  useScrollProgress(personalSectionRef);
  useScrollProgress(contactSectionRef);

  useEffect(() => {
    const greeting = heroGreetingRef.current;
    if (!greeting || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      greeting.classList.toggle('is-in-view', entry.isIntersecting);
    }, { threshold: 0.1 });

    observer.observe(greeting);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const updateTarget = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      const heroBounds = heroSectionRef.current?.getBoundingClientRect();
      if (!reducedMotion) {
        targetTimeRef.current = getVideoTime(Math.max(0, Math.min(1, progress)));
      }
      setVideoPastHero(progress >= 0.18);
      setGreetingVisible(Boolean(heroBounds && heroBounds.bottom > 0));
    };

    let frame = 0;
    let initialized = false;
    const scrub = () => {
      const video = videoRef.current;
      if (!reducedMotion && video && video.readyState >= HTMLMediaElement.HAVE_METADATA) {
        const availableTime = Math.max(0, video.duration - 0.01);
        const desiredTime = Math.min(targetTimeRef.current, availableTime);
        if (!initialized) {
          smoothedTimeRef.current = video.currentTime;
          initialized = true;
        }
        smoothedTimeRef.current += (desiredTime - smoothedTimeRef.current) * 0.12;
        if (!video.seeking && Math.abs(smoothedTimeRef.current - video.currentTime) > 0.04) {
          video.currentTime = smoothedTimeRef.current;
        }
      }
      if (!reducedMotion) frame = window.requestAnimationFrame(scrub);
    };
    updateTarget();
    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', updateTarget);
    if (!reducedMotion) frame = window.requestAnimationFrame(scrub);
    return () => {
      window.removeEventListener('scroll', updateTarget);
      window.removeEventListener('resize', updateTarget);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const journeyStage = journeyStageRef.current;
    const journeyList = journeyListRef.current;
    const path = journeyPathRef.current;
    const runner = runnerRef.current;
    const parachute = parachuteRef.current;
    const parachuteMatte = parachuteMatteRef.current;
    const parachuteCanvas = parachuteCanvasRef.current;
    const credentials = credentialsRef.current;
    if (!journeyStage || !journeyList || !path || !runner || !parachute || !parachuteMatte || !parachuteCanvas || !credentials) return;

    const pathLength = path.getTotalLength();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let progress = 0;
    let velocity = 0;
    let previousTime = 0;
    let frame = 0;

    const getScrollProgress = () => {
      const bounds = journeyList.getBoundingClientRect();
      const readingPosition = window.innerHeight * 0.52;
      return Math.max(0, Math.min(1, (readingPosition - bounds.top) / bounds.height));
    };

    const updateCharacters = () => {
      const stageBounds = journeyStage.getBoundingClientRect();
      const pathBounds = path.ownerSVGElement?.getBoundingClientRect();
      const credentialsBounds = credentials.getBoundingClientRect();
      if (!pathBounds || pathBounds.width === 0 || pathBounds.height === 0 || stageBounds.width === 0) return;

      const point = path.getPointAtLength(progress * pathLength);
      const x = pathBounds.left - stageBounds.left + (point.x / 100) * pathBounds.width;
      const y = pathBounds.top - stageBounds.top + (point.y / 100) * pathBounds.height;
      runnerPositionRef.current = { x, y };
      runner.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

      if (reducedMotion) {
        runner.style.opacity = '1';
        parachuteCanvas.style.opacity = '0';
        return;
      }

      const pathEnd = path.getPointAtLength(pathLength);
      const pathEndY = pathBounds.top - stageBounds.top + (pathEnd.y / 100) * pathBounds.height;
      const credentialsLineY = credentialsBounds.top - stageBounds.top;
      const parachuteStartY = pathEndY + 18;
      const parachuteEndY = credentialsLineY - parachuteCanvas.getBoundingClientRect().height / 2;
      const readingPosition = window.innerHeight * 0.52;
      const absoluteStartY = stageBounds.top + parachuteStartY;
      const absoluteEndY = stageBounds.top + parachuteEndY;
      const distance = Math.max(1, absoluteEndY - absoluteStartY);
      const rawParachuteProgress = (readingPosition - absoluteStartY) / distance;
      const parachuteProgress = Math.max(0, Math.min(1, rawParachuteProgress));
      const parachuteY = parachuteStartY + (parachuteEndY - parachuteStartY) * parachuteProgress;

      parachuteCanvas.style.transform = `translate3d(${x}px, ${parachuteY}px, 0) translate(-50%, -50%)`;
      parachuteCanvas.style.opacity = rawParachuteProgress >= 0 && rawParachuteProgress <= 1 ? '1' : '0';
      runner.style.opacity = rawParachuteProgress >= 0 ? '0' : '1';

      if (parachute.readyState >= HTMLMediaElement.HAVE_METADATA) {
        const targetTime = Math.max(0, parachute.duration - 0.01) * parachuteProgress;
        if (!parachute.seeking && Math.abs(parachute.currentTime - targetTime) > 0.08) {
          parachute.currentTime = targetTime;
        }
        if (
          parachuteMatte.readyState >= HTMLMediaElement.HAVE_METADATA
          && !parachuteMatte.seeking
          && Math.abs(parachuteMatte.currentTime - targetTime) > 0.08
        ) {
          parachuteMatte.currentTime = targetTime;
        }
      }
    };

    const followScroll = (time: number) => {
      const delta = previousTime === 0 ? 1 : Math.min(2, (time - previousTime) / 16.67);
      previousTime = time;

      if (hoveredMilestoneRef.current === null) {
        const target = getScrollProgress();
        if (reducedMotion) {
          progress = target;
          velocity = 0;
        } else {
          const springForce = (target - progress) * 0.14;
          velocity = (velocity + springForce * delta) * Math.pow(0.76, delta);
          progress = Math.max(0, Math.min(1, progress + velocity * delta));
        }
      }
      updateCharacters();

      frame = window.requestAnimationFrame(followScroll);
    };

    const onResize = () => updateCharacters();
    window.addEventListener('resize', onResize);
    frame = window.requestAnimationFrame(followScroll);
    return () => {
      window.removeEventListener('resize', onResize);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen && !briefProject && !activeProject && !selectedEndorsement) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setBriefProject(null);
        setActiveProject(null);
        setSelectedEndorsement(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, briefProject, activeProject, selectedEndorsement]);

  const goToChapter = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const closeProject = () => {
    setActiveProject(null);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    targetTimeRef.current = getVideoTime(Math.max(0, Math.min(1, progress)));
  };

  const syncVideoToProjectScroll = (scrollTop: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (window.scrollY + scrollTop) / maxScroll : 0;
    targetTimeRef.current = getVideoTime(Math.max(0, Math.min(1, progress)));
  };

  const engageMilestone = (index: number, element: HTMLElement) => {
    hoveredMilestoneRef.current = index;
    setHoveredMilestone(index);
    const stageBounds = journeyStageRef.current?.getBoundingClientRect();
    if (!stageBounds) return;
    const milestoneBounds = element.getBoundingClientRect();
    const milestoneCenter = milestoneBounds.left + milestoneBounds.width / 2;
    const runnerCenter = stageBounds.left + runnerPositionRef.current.x;
    setRunnerFacing(milestoneCenter < runnerCenter ? 'left' : 'right');
  };

  const releaseMilestone = () => {
    hoveredMilestoneRef.current = null;
    setHoveredMilestone(null);
  };

  useEffect(() => {
    const video = runnerVideoRef.current;
    const matte = runnerMatteRef.current;
    if (!video || !matte) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
      matte.pause();
      return;
    }
    if (hoveredMilestone !== null) {
      video.pause();
      matte.pause();
      return;
    }

    void video.play().catch((error: unknown) => {
      console.error('Unable to play the running clay animation in the journey tracker.', error);
    });
    if (matte.readyState >= HTMLMediaElement.HAVE_METADATA) {
      matte.currentTime = video.currentTime;
    }
    void matte.play().catch((error: unknown) => {
      console.error('Unable to play the running clay animation matte.', error);
    });
  }, [hoveredMilestone]);

  return (
    <div className="portfolio-shell">
      <aside aria-label="Claymation video" className={`video-stage ${videoPastHero ? 'is-scrolled' : ''} ${greetingVisible ? '' : 'is-greeting-hidden'}`}>
        <p aria-label="Hi, Namaste, Olá" className="hero-greeting video-stage__greeting" ref={heroGreetingRef}>
          <span>Hi</span>
          <span>Namaste</span>
          <span>Olá</span>
        </p>
        <video
          aria-label="Clay animation of Suprim"
          className="video-stage__video"
          muted
          playsInline
          preload="auto"
          ref={videoRef}
          src="/suprim-clay.mp4"
        />
        <span className="video-stage__caption">A SMALL CLAY SELF-PORTRAIT <i /> LISBON, PT</span>
      </aside>

      <main className="portfolio-story">
        <section className="story-section story-hero" id="chapter-hero" ref={heroSectionRef}>
          <div className="section-index"><strong className="hero-wordmark hero-section-wordmark">Suprim Tamang</strong><span>SCROLL TO EXPLORE ↓</span></div>
          <div className="hero-copy">
            <div className="hero-introduction">
              <div className="hero-main-copy">
                <h1><span>I <em>engineer.</em></span><span><em>Scale</em> systems &amp;</span><span>bridge gaps with</span><span><em>technology.</em></span></h1>
                <ScrollFillRule />
              </div>
            </div>
          </div>
        </section>

        <section className="story-section story-works" id="chapter-works" ref={worksSectionRef}>
          <WordReveal className="section-title" text="Works" suffix="." />
          <ScrollFillRule />
          <p className="section-intro">A few systems, ideas, and useful things built from the ground up.</p>
          <div className="section-index"><span>02 / SELECTED WORK</span><span>OPEN A FILE ↗</span></div>
          <div aria-label="Project file tree" className="file-tree">
            {PROJECTS.map((project, index) => (
              <RevealOnScroll
                className={`file-tree__folder ${expandedFolders[project.id] ? 'is-open' : ''}`}
                delay={index * 60}
                key={project.id}
              >
                <button
                  aria-expanded={expandedFolders[project.id]}
                  className="file-tree__folder-button"
                  onClick={() => setExpandedFolders((folders) => ({ ...folders, [project.id]: !folders[project.id] }))}
                  type="button"
                >
                  <span className="file-tree__icon" aria-hidden="true">📁</span>
                  <span className="file-tree__folder-name">{project.name}</span>
                  <span className="file-tree__number">0{index + 1}</span>
                  <span aria-hidden="true" className="file-tree__chevron">↗</span>
                </button>
                {expandedFolders[project.id] && (
                  <div className="file-tree__children">
                    <button onClick={() => setBriefProject(project)} type="button">
                      <span className="file-tree__icon" aria-hidden="true">📄</span> brief
                    </button>
                    <button onClick={() => setActiveProject(project)} type="button">
                      <span className="file-tree__icon" aria-hidden="true">📄</span> Project
                    </button>
                  </div>
                )}
              </RevealOnScroll>
            ))}
          </div>
          <p className="file-tree__hint">CLICK ANY FOLDER TO EXPLORE ITS FILES</p>
        </section>

        <section className="story-section story-journey" id="chapter-journey" ref={journeySectionRef}>
          <div className="section-index"><span>03 / THE LONG WAY ROUND</span><span>NEPAL ↔ PORTUGAL</span></div>
          <WordReveal className="section-title" text={'The Engineering\nJourney'} suffix="." />
          <ScrollFillRule />
          <div className="journey-stage" ref={journeyStageRef}>
            <div className="journey-list" ref={journeyListRef}>
              <div aria-hidden="true" className="journey-rail">
                <svg className="journey-list__path" fill="none" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M50 0 C50 6 38 8 38 10 S62 24 62 30 S38 44 38 50 S62 64 62 70 S50 84 50 90 S50 96 50 100" pathLength="1" ref={journeyPathRef} />
                </svg>
              </div>
              <div
                className={`journey-runner journey-runner--${runnerFacing} ${hoveredMilestone !== null ? 'is-paused' : ''}`}
                ref={runnerRef}
              >
                <MattedVideo
                  ariaLabel="Suprim running along the engineering journey"
                  autoPlay
                  className="journey-runner__video"
                  loop
                  matteRef={runnerMatteRef}
                  matteSrc="/Suprim_running-matte.mp4"
                  sourceRef={runnerVideoRef}
                  sourceSrc="/Suprim_running.mp4"
                />
              </div>
              {MILESTONES.map((milestone, index) => (
                <RevealOnScroll
                  as="article"
                  className={`milestone milestone--${index + 1}`}
                  delay={index * 60}
                  id={'id' in milestone ? milestone.id : undefined}
                  key={milestone.organization}
                  onBlur={releaseMilestone}
                  onFocus={(event) => engageMilestone(index, event.currentTarget)}
                  onMouseEnter={(event) => engageMilestone(index, event.currentTarget)}
                  onMouseLeave={releaseMilestone}
                  tabIndex={0}
                >
                  <span className="milestone__node">
                    <span className="milestone__dot">
                      {'image' in milestone
                        ? <img alt="" src={milestone.image} />
                        : 'monogram' in milestone
                          ? <span className="milestone__monogram">{milestone.monogram}</span>
                          : String(index + 1).padStart(2, '0')}
                    </span>
                  </span>
                  <div className="milestone__content">
                    <span className="milestone__date">{milestone.date}</span>
                    <h3>{milestone.organization}</h3>
                    <p className="milestone__role">{milestone.role}</p>
                    <p>{milestone.detail}</p>
                    {hoveredMilestone === index && (
                      <span className="milestone__quip" role="status">
                        {MILESTONE_QUIPS[index]}
                      </span>
                    )}
                  </div>
                </RevealOnScroll>
              ))}
            </div>
            <div aria-hidden="true" className="journey-parachute-runway" />
            <MattedVideo
              ariaLabel="Clay Suprim floating by parachute from the journey curve to the credentials divider"
              className="journey-parachute"
              canvasRef={parachuteCanvasRef}
              matteRef={parachuteMatteRef}
              matteSrc="/suprim-parachute-matte.mp4"
              sourceRef={parachuteRef}
              sourceSrc="/suprim-parachute.mp4"
            />
            <div className="credentials" ref={credentialsRef}>
              <span>CREDENTIALS &amp; STACK</span>
              <div className="credentials__badges">
                {['Google Cloud Cybersecurity', 'NOVA FCT', 'Quidgest Genio', 'Le Wagon SQL', 'Spring Boot', 'C / OCaml'].map((badge) => (
                  <span key={badge}>{badge}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="story-section story-personal" id="chapter-personal" ref={personalSectionRef}>
          <div className="section-index"><span>04 / OUTSIDE THE TERMINAL</span><span>THE HUMAN BIT</span></div>
          <WordReveal className="section-title" text={'This Is Where It\nGets Personal'} suffix="." />
          <ScrollFillRule />
          <div aria-label="Personal cards; activate a card to bring it to the front" className="personal-deck">
            {PERSONAL_CARDS.map((card, index) => {
              const offset = (index - frontCard + PERSONAL_CARDS.length) % PERSONAL_CARDS.length;
              const isFront = offset === 0;
              return (
                <article
                  aria-label={card.title}
                  className={`personal-card ${card.style} ${isFront ? 'is-front' : ''}`}
                  data-offset={offset}
                  key={card.title}
                  onClick={() => {
                    if (!isFront) setFrontCard(index);
                  }}
                  onKeyDown={(event) => {
                    if (!isFront && (event.key === 'Enter' || event.key === ' ')) {
                      event.preventDefault();
                      setFrontCard(index);
                    }
                  }}
                  role={isFront ? undefined : 'button'}
                  style={{
                    zIndex: PERSONAL_CARDS.length - offset,
                  }}
                  tabIndex={isFront ? undefined : 0}
                >
                  {index === 0 && <img alt="" src="/suprim-portrait.png" />}
                  {index === 1 && <img alt="" src="/magma%20event.png" />}
                  {index === 2 && <img alt="" src="/home.JPG" />}
                  {index === 3 && <img alt="" src="/impulso%20pitch.JPG" />}
                  {!isFront && (
                    <span className="personal-card__activate">
                      0{index + 1} / 04<br /><span>BRING FORWARD ↗</span>
                    </span>
                  )}
                  {isFront && (
                    <div className={`personal-card__content ${index === 2 ? 'personal-card__content--home' : ''}`}>
                      {index !== 2 && <span className="personal-card__number">0{index + 1} / 04</span>}
                      {index === 0 && (
                        <div className="personal-experience personal-experience--passport">
                          <span className="experience-kicker">SAME BUILDER, TWO HOMES</span>
                          <button
                            aria-label="Toggle between Nepal and Portugal"
                            aria-pressed={origin === 'portugal'}
                            className="passport-toggle"
                            onClick={() => setOrigin((place) => (place === 'nepal' ? 'portugal' : 'nepal'))}
                            type="button"
                          >
                            {origin === 'nepal' ? '🇳🇵 Dhading / Kathmandu' : '🇵🇹 Amadora / Lisbon'}
                          </button>
                          <span className="passport-languages">NEPALI · ENGLISH<br />PORTUGUESE · HINDI</span>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="personal-experience personal-experience--magma">
                          <span className="experience-kicker">TALENT &amp; COMMUNITY</span>
                          <span className="magma-card-label">Magma Studio<br />NOVA FCT</span>
                        </div>
                      )}
                      {index === 2 && (
                        <div className="personal-card__copy--home">
                          <span className="personal-card__pill">PHYSICAL CRAFTSMANSHIP</span>
                          <span className="personal-card__title">{card.title}</span>
                          <span className="personal-card__caption">{card.caption}</span>
                        </div>
                      )}
                      {index !== 2 && (
                        <>
                          <span className="personal-card__title">{card.title}</span>
                          <span className="personal-card__caption">{card.caption}</span>
                        </>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
          <p className="deck-hint">TAP A CARD TO BRING IT FORWARD ↗</p>
        </section>

        <section className="story-section story-contact" id="chapter-contact" ref={contactSectionRef}>
          <div className="section-index"><span>05 / YOUR TURN</span><span>THE NEXT CHAPTER</span></div>
          <div className="contact-heading">
            <p className="eyebrow">That’s the short version.</p>
            <WordReveal as="h2" className="contact-heading__title" text={"You've Reached\nThe End"} suffix="." />
            <ScrollFillRule />
            <p className="contact-heading__aside">Or The Beginning.</p>
          </div>
          <section aria-labelledby="endorsements-title" className="endorsements">
            <div className="endorsements__heading">
              <p className="eyebrow">WORDS FROM PEOPLE I’VE WORKED WITH</p>
              <WordReveal as="h3" className="endorsements__title" id="endorsements-title" text="Endorsements & Leadership" suffix="." />
            </div>
            <div className="endorsement-grid">
              {ENDORSEMENTS.map((endorsement) => (
                <article
                  aria-label={`Read full recommendation from ${endorsement.name}`}
                  className="endorsement-card"
                  key={endorsement.name}
                  onClick={() => setSelectedEndorsement(endorsement)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedEndorsement(endorsement);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <header className="endorsement-card__header">
                    <div className={`endorsement-card__avatar endorsement-card__avatar--${endorsement.name === 'Joana Bogalho' ? 'joana' : 'alexandre'}`}>
                      <img alt="" src={endorsement.image} />
                    </div>
                    <div>
                      <h4>{endorsement.name}</h4>
                      <p>{endorsement.role}</p>
                      <time>{endorsement.date}</time>
                    </div>
                    <span aria-hidden="true" className="endorsement-card__quote-mark">“</span>
                  </header>
                  <blockquote>{endorsement.quote}</blockquote>
                  <span className="endorsement-card__prompt">OPEN FULL RECOMMENDATION ↗</span>
                </article>
              ))}
            </div>
          </section>
          <div className="contact-panel">
            <div className="contact-links">
              <a className="contact-link" href="mailto:s.tamang@campus.fct.unl.pt">
                <span>MAIL ME</span><strong>s.tamang@campus.fct.unl.pt</strong><i>↗</i>
              </a>
              <div className="contact-link">
                <span>MEET ME IN</span><strong>Lisbon, Portugal</strong><i>⌖</i>
              </div>
            </div>
            <div className="social-block">
              <span>OR STALK MY PROFILES</span>
              <div className="social-buttons">
                <a aria-label="LinkedIn" href="https://www.linkedin.com/in/suprim-tamang-b864a9242" rel="noreferrer" target="_blank"><b>in</b></a>
                <a aria-label="GitHub" href="https://github.com/Suprimtamang" rel="noreferrer" target="_blank"><b>GH</b></a>
                <a aria-label="Email" href="mailto:s.tamang@campus.fct.unl.pt"><b>@</b></a>
                <button aria-label="Nepalese in Tech Europe timeline" onClick={() => goToChapter('nepalese-in-tech')} type="button"><b>NT</b></button>
              </div>
            </div>
            <a className="resume-button" download href="/Suprim_Tamang_CV.pdf">⬇&nbsp; Download Resume</a>
          </div>
          <footer className="contact-footer">
            <span>BUILT BETWEEN LISBON &amp; KATHMANDU</span>
            <span className="contact-colophon">
              Layout &amp; scrollytelling format inspired by{' '}
              Anurag Bandyopadhyay
              {' '}· Claymation stop-motion &amp; engineering widgets crafted by Suprim Tamang with Google Flow.
            </span>
            <span>© Suprim Tamang 2026</span>
          </footer>
        </section>
      </main>

      <button
        aria-expanded={menuOpen}
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        className={`menu-toggle ${menuOpen ? 'is-open' : ''}`}
        onClick={() => setMenuOpen((open) => !open)}
        type="button"
      >
        <span /><span />
      </button>

      {menuOpen && (
        <div className="menu-overlay">
          <span className="menu-overlay__brand">SUPRIM TAMANG <i>®</i></span>
          <nav aria-label="Main navigation">
            {MENU_LINKS.map((chapter) => (
              <button key={chapter.id} onClick={() => goToChapter(chapter.id)} type="button">
                <span>{chapter.number}</span>{chapter.label}<i>↗</i>
              </button>
            ))}
          </nav>
          <span className="menu-overlay__footer">COMPUTER SCIENCE &amp; SYSTEMS ENGINEER · LISBON, PT</span>
        </div>
      )}

      {briefProject && <BriefNote key={briefProject.id} onClose={() => setBriefProject(null)} project={briefProject} />}
      {selectedEndorsement && (
        <div className="portfolio-overlay portfolio-overlay--endorsement" onMouseDown={() => setSelectedEndorsement(null)}>
          <section
            aria-labelledby="endorsement-dialog-title"
            aria-modal="true"
            className="endorsement-dialog"
            onMouseDown={(event) => event.stopPropagation()}
            role="dialog"
          >
            <button aria-label="Close recommendation" className="overlay-close" onClick={() => setSelectedEndorsement(null)} type="button">×</button>
            <p className="eyebrow">FULL RECOMMENDATION · {selectedEndorsement.date}</p>
            <h2 id="endorsement-dialog-title">{selectedEndorsement.name}</h2>
            <p className="endorsement-dialog__role">{selectedEndorsement.role}</p>
            <img alt={`Uncropped recommendation from ${selectedEndorsement.name}`} src={selectedEndorsement.image} />
            <blockquote>{selectedEndorsement.quote}</blockquote>
          </section>
        </div>
      )}
      {activeProject && (
        <ProjectCaseStudy
          onClose={closeProject}
          onVideoScroll={syncVideoToProjectScroll}
          project={activeProject}
        />
      )}
    </div>
  );
}
