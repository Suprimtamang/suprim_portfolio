import { create } from 'zustand';

export type ViewMode = 'scroll' | 'classic';
export type LayerIndex = -1 | 0 | 1 | 2 | 3;
export type TokenAnomalyStatus = 'active' | 'inspecting' | 'quarantined';
export type ThemeMode = 'day' | 'night';

export interface LayerData {
  id: LayerIndex;
  tag: string;
  title: string;
  subtitle: string;
  bullets: string[];
  hint: string;
}

export const INTRO_LAYER: LayerData = {
  id: -1,
  tag: 'Overview',
  title: 'Ponte 25 de Abril',
  subtitle: 'Drag to orbit · scroll or pinch to zoom',
  bullets: [
    'Four layers, one vertical system stack',
    'From the Tagus riverbed to the signal beacon',
  ],
  hint: 'Start the tour to climb it layer by layer.',
};

export const LAYERS_DATA: LayerData[] = [
  {
    id: 0,
    tag: 'Layer 0',
    title: 'Kernel & Memory',
    subtitle: 'Sub-surface Tagus · NOVA FCT',
    bullets: [
      'C Unix file system — fs_ls, fs_unlink & inode allocation',
      'OCaml functional interpreters & type checkers',
      'Java self-balancing AVL trees & data structures',
    ],
    hint: 'Toggle sonar to see the raw mesh beneath the surface.',
  },
  {
    id: 1,
    tag: 'Layer 1',
    title: 'Data Pipeline & Security',
    subtitle: 'Fertagus truss · AdSecOps & Enterprise Support',
    bullets: [
      'Sajuro — Automated AdSecOps & Graph API token-quarantine simulator',
      'Top Performer in Tier-2 Enterprise Technical Support (Meta Ads infrastructure)',
      'Meta Whitehat vulnerability disclosure & resolution quality',
    ],
    hint: 'Click the pulsing red train car.',
  },
  {
    id: 2,
    tag: 'Layer 2',
    title: 'Application & UX',
    subtitle: 'Upper road deck · Full-stack platforms',
    bullets: [
      'Simplify (Portugal Admission Guide) — Interactive roadmap for international students',
      '10+ university admissions guided during earlier MVP and platform growth',
      'Quidgest Genio — intensive one-week frontend software externship',
    ],
    hint: 'Hover the gantry signs above the road.',
  },
  {
    id: 3,
    tag: 'Layer 3',
    title: 'Cloud & Signal',
    subtitle: 'Tower summit · Community',
    bullets: [
      'Google Cloud Cybersecurity Certificate (Completed May 2026)',
      'Co-founder & contributor at Nepalese in Tech Europe (AI for Everyone webinars)',
    ],
    hint: 'A kite is drifting near the beacon.',
  },
];

export const GANTRIES_DATA = [
  { code: '01', title: 'Visa & NIF', description: 'Arrival paperwork: the visa and Portuguese tax number (NIF).' },
  { code: '02', title: 'DGES / Admissions', description: 'Mapping the DGES application route into a university place.' },
  { code: '03', title: 'Campus Integration', description: 'From the first day in Lisbon to settled in Caparica.' },
];

interface SystemState {
  mode: ViewMode;
  activeLayer: LayerIndex;
  elevation: number;
  sonarMode: boolean;
  tokenAnomalyStatus: TokenAnomalyStatus;
  hoveredGantry: number | null;
  toastMessage: string | null;
  theme: ThemeMode;

  setMode: (mode: ViewMode) => void;
  setActiveLayer: (layer: LayerIndex) => void;
  setElevation: (y: number) => void;
  toggleSonar: () => void;
  openQuarantineModal: () => void;
  closeQuarantineModal: () => void;
  quarantineToken: () => void;
  setHoveredGantry: (index: number | null) => void;
  triggerToast: (msg: string) => void;
  toggleTheme: () => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useSystemStore = create<SystemState>((set) => ({
  mode: 'scroll',
  activeLayer: -1,
  elevation: 90,
  sonarMode: false,
  tokenAnomalyStatus: 'active',
  hoveredGantry: null,
  toastMessage: null,
  theme: 'day',

  setMode: (mode) =>
    set((state) => {
      return {
        mode,
        activeLayer: state.activeLayer === -1 ? 0 : state.activeLayer,
      };
    }),

  setActiveLayer: (activeLayer) => set({ activeLayer }),
  setElevation: (elevation) => set({ elevation }),

  toggleSonar: () =>
    set((state) => {
      const next = !state.sonarMode;
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => set({ toastMessage: null }), 2600);
      return {
        sonarMode: next,
        toastMessage: next ? 'Sonar on — raw geometry' : 'Sonar off',
      };
    }),

  openQuarantineModal: () => set({ tokenAnomalyStatus: 'inspecting' }),
  closeQuarantineModal: () => set({ tokenAnomalyStatus: 'active' }),

  quarantineToken: () => {
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set({ toastMessage: null }), 2600);
    set({
      tokenAnomalyStatus: 'quarantined',
      toastMessage: 'Token quarantined — traffic resumed',
    });
  },

  setHoveredGantry: (hoveredGantry) => set({ hoveredGantry }),

  triggerToast: (msg) => {
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set({ toastMessage: null }), 2600);
    set({ toastMessage: msg });
  },

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'day' ? 'night' : 'day',
    })),
}));