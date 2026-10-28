import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { useSystemStore } from '../../store/useSystemStore';
import { CvDownloadButton } from '../ui/CvDownloadButton';

const ANCHORS = [
  { y: '+70m', label: 'TOWER SUMMIT', section: 'summit' },
  { y: '+35m', label: 'ROAD DECK', section: 'architect' },
  { y: '+15m', label: 'PORTAGEM TRUSS', section: 'experience' },
  { y: '-40m', label: 'SUB-SURFACE TAGUS', section: 'contact' },
];

const EXPERIENCE = [
  ['2026 – NOW', 'Nepalese in Tech Europe', 'Co-Founder & Core Builder', 'Building practical community programs and AI-for-everyone conversations across Europe.'],
  ['2026 – NOW', 'Tier-2 Enterprise Technical Support', 'Top Performer · Meta Ads infrastructure', 'Investigating complex platform issues, improving resolution quality, and translating operational signals into clear action.'],
  ['2024 – NOW', 'Simplify — Portugal Admission Guide', 'Founder', 'A roadmap for international students. Guided 10+ university admissions during the earlier MVP and platform growth.'],
  ['2023', 'Quidgest', 'Software Engineer Apprentice — Genio Platform', 'Intensive frontend software externship working with low-code product systems.'],
];

const WORK = [
  ['Sajuro', 'AdSecOps Sandbox', 'Identity monitoring and token-quarantine simulation.', 'https://github.com/Suprimtamang'],
  ['Simplify', 'Admission Platform', 'A calmer route through Portugal university admissions.', 'https://portugal-admission-guide-app-production-y4byxb.laravel.cloud'],
  ['C Virtual File System', 'fs_ls · fs_write · inodes', 'Low-level systems work in C.', 'https://github.com/Suprimtamang'],
  ['OCaml Interpreter', 'Functional language tooling', 'Interpreters and type-checking from first principles.', 'https://github.com/Suprimtamang'],
];

function DepthGauge({ progress, onAnchor }: { progress: number; onAnchor?: (section: string) => void }) {
  const active = Math.min(3, Math.floor(progress * 4.01));
  return (
    <aside className="editorial-gauge" aria-label="Portfolio depth navigation">
      <div className="editorial-gauge-line"><span style={{ height: `${Math.max(4, progress * 100)}%` }} /></div>
      <div className="editorial-gauge-label">ALTITUDE / DEPTH</div>
      {ANCHORS.map((anchor, index) => (
        <button key={anchor.section} type="button" className={`editorial-anchor ${active === index ? 'is-active' : ''}`} onClick={() => onAnchor?.(anchor.section)}>
          <strong>{anchor.y}</strong><span>{anchor.label}</span>
        </button>
      ))}
    </aside>
  );
}

export function ClassicView() {
  const mode = useSystemStore((s) => s.mode);
  const setMode = useSystemStore((s) => s.setMode);
  const [warm, setWarm] = useState(true);
  const [openExperience, setOpenExperience] = useState(0);
  const [progress, setProgress] = useState(0);
  const [portraitTilt, setPortraitTilt] = useState({ x: 0, y: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const update = () => setProgress(element.scrollTop / Math.max(1, element.scrollHeight - element.clientHeight));
    element.addEventListener('scroll', update, { passive: true });
    update();
    return () => element.removeEventListener('scroll', update);
  }, []);

  if (mode !== 'classic') return null;

  const jumpTo = (section: string) => {
    scrollRef.current?.querySelector(`#${section}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`${data.get('need')} · ${data.get('timeline')}`);
    const body = encodeURIComponent(`Hi Suprim,\n\nI'm interested in: ${data.get('need')}\nTimeline: ${data.get('timeline')}\n\n`);
    window.location.href = `mailto:s.tamang@campus.fct.unl.pt?subject=${subject}&body=${body}`;
  };

  return (
    <div className={`editorial-view ${warm ? 'editorial-warm' : 'editorial-dark'}`}>
      <div className="editorial-flags" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <DepthGauge progress={progress} onAnchor={jumpTo} />
      <div ref={scrollRef} className="editorial-scroll">
        <header className="editorial-header">
          <span>SUprim TAMANG / LISBON × KATHMANDU</span>
          <div className="flex items-center gap-3">
            <button type="button" className="editorial-text-button" onClick={() => setWarm((value) => !value)}>{warm ? 'Dark palette' : 'Warm palette'}</button>
            <button type="button" className="editorial-text-button" onClick={() => setMode('scroll')}>▶ Back to 3D</button>
          </div>
        </header>

        <main className="editorial-main">
          <section id="summit" className="editorial-hero editorial-section">
            <div className="editorial-hero-copy">
              <p className="editorial-kicker">NAMASTE & OLÁ, I&apos;M</p>
              <h1>Suprim<br /><em>Tamang</em></h1>
              <p className="editorial-lede">Computer Science & Engineering at NOVA FCT · Full-Stack, AdSecOps & Low-Level Systems.</p>
              <div className="editorial-stats">
                <span><b>10+</b> Admissions guided<br /><small>via Simplify MVP</small></span>
                <span><b>Top Performer</b> Tier-2 support<br /><small>enterprise platforms</small></span>
                <span><b>4 Layers</b> Full-stack architecture<br /><small>from kernel to cloud</small></span>
              </div>
              <div className="editorial-actions">
                <button type="button" className="editorial-button editorial-button-primary" onClick={() => setMode('scroll')}>▶ Play the Bridge 3D</button>
                <a className="editorial-button" href="#contact">Start a Project / Chat</a>
                <CvDownloadButton variant="outline" />
              </div>
            </div>
            <div
              className="editorial-avatar"
              style={{
                '--portrait-tilt-x': `${portraitTilt.x}deg`,
                '--portrait-tilt-y': `${portraitTilt.y}deg`,
              } as CSSProperties}
              onPointerMove={(event) => {
                const bounds = event.currentTarget.getBoundingClientRect();
                setPortraitTilt({
                  x: ((event.clientY - bounds.top) / bounds.height - 0.5) * -3,
                  y: ((event.clientX - bounds.left) / bounds.width - 0.5) * 4,
                });
              }}
              onPointerLeave={() => setPortraitTilt({ x: 0, y: 0 })}
            >
              <img src="/suprim-portrait.png" alt="Suprim Tamang in Lisbon" />
              <div className="editorial-avatar-gradient" aria-hidden="true" />
              <span className="editorial-avatar-badge">📍 LISBON, PORTUGAL · NOVA FCT</span>
            </div>
          </section>

          <button type="button" className="editorial-preview" onClick={() => setMode('scroll')}>
            <span>Live Ponte 25 de Abril preview</span><strong>Click to Enter Full 3D World ↗</strong>
          </button>

          <section id="architect" className="editorial-section">
            <p className="editorial-kicker">WHAT I ARCHITECT</p>
            <div className="editorial-rows">
              {[
                ['01', 'Systems & Kernel Engineering', 'C filesystems, OCaml interpreters, Java data structures, and the discipline of making invisible machinery dependable.'],
                ['02', 'AdSecOps & Cloud Security', 'Security simulations, Graph API token flows, incident thinking, and practical cloud security foundations.'],
                ['03', 'Full-Stack Platforms', 'Product interfaces that make complicated journeys—admissions, operations, and technical workflows—feel human.'],
              ].map(([number, title, detail]) => <article key={number}><span>{number}</span><h2>{title}</h2><p>{detail}</p></article>)}
            </div>
          </section>

          <section className="editorial-section">
            <p className="editorial-kicker">SKILLS & TOOLS / FIELD NOTES</p>
            <div className="editorial-bento">
              {[
                ['BUILD / SYSTEMS', 'C · OCaml · Java · Linux VFS'],
                ['SECURE / CLOUD', 'AdSecOps · Meta Graph API · GCP Cybersecurity · Cloudflare'],
                ['FULL-STACK', 'Spring Boot · React · Tailwind · SQL · Three.js · Quidgest Genio'],
                ['COMMUNITY', 'Nepalese in Tech Europe · Technical mentorship'],
              ].map(([title, detail]) => <article key={title}><span>{title}</span><p>{detail}</p></article>)}
            </div>
          </section>

          <section id="experience" className="editorial-section">
            <p className="editorial-kicker">EXPERIENCE & MILESTONES</p>
            <div className="editorial-accordion">
              {EXPERIENCE.map(([date, company, role, detail], index) => <article key={company}>
                <button type="button" onClick={() => setOpenExperience(openExperience === index ? -1 : index)}><span>{date}</span><strong>{company}</strong><em>{openExperience === index ? '−' : '+'}</em></button>
                {openExperience === index && <div><b>{role}</b><p>{detail}</p></div>}
              </article>)}
            </div>
          </section>

          <section className="editorial-section">
            <p className="editorial-kicker">FEATURED WORK</p>
            <div className="editorial-work">
              {WORK.map(([name, tag, detail, href]) => <a key={name} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}><span>{tag}</span><strong>{name} ↗</strong><p>{detail}</p></a>)}
            </div>
          </section>

          <section id="contact" className="editorial-section editorial-contact">
            <div><p className="editorial-kicker">LET&apos;S BUILD USEFUL SYSTEMS</p><h2>People should be able to trust the things we build.</h2><p>Tell me where the bridge needs to go next.</p></div>
            <form onSubmit={submitContact}><label>What do you need?<select name="need" defaultValue="Full-Stack Build"><option>Engineering Role / Internship</option><option>Full-Stack Build</option><option>Security Audit / AdSecOps</option><option>Community Event</option></select></label><label>Timeline<select name="timeline" defaultValue="This month"><option>This month</option><option>Next quarter</option><option>Exploring</option></select></label><button className="editorial-button editorial-button-primary" type="submit">Open a conversation ↗</button></form>
          </section>
        </main>
        <footer className="editorial-footer">Built between Lisbon and Kathmandu · <a href="https://github.com/Suprimtamang" target="_blank" rel="noreferrer">GitHub ↗</a> · <a href="mailto:s.tamang@campus.fct.unl.pt">Email ↗</a></footer>
      </div>
    </div>
  );
}

export default ClassicView;
