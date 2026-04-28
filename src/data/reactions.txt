import type { ReactionResult, NewsItem } from '../types';

export const reactionRules: Record<string, (a: string, b: string) => ReactionResult | null> = {
  'metal+nonmetal': (a, b) => ({
    formula: `${a}${b}`,
    name: `${a} ${b}ide`,
    yield: 85 + Math.random() * 14,
    stability: Math.random() > 0.3 ? 'Stable' : 'Unstable',
    phase: 'Solid',
    color: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3'][Math.floor(Math.random() * 4)],
    description: `Ionic compound formed by electron transfer from ${a} to ${b}. High lattice energy predicted.`,
    confidence: 78 + Math.random() * 20,
  }),
  'alkali+halogen': (a, b) => ({
    formula: `${a}${b}`,
    name: `${a} ${b}ide`,
    yield: 92 + Math.random() * 7,
    stability: 'Stable',
    phase: 'Solid',
    color: '#ffffff',
    description: `Classic ionic salt. Highly soluble in water. Strong electrolyte predicted.`,
    confidence: 95,
  }),
  'metal+acid': (a, b) => ({
    formula: `${a}H + ${b}`,
    name: `${a} Hydride / ${b} Salt`,
    yield: 60 + Math.random() * 30,
    stability: 'Unstable',
    phase: 'Gas',
    color: '#aaffaa',
    description: `Single replacement reaction. Hydrogen gas evolution detected.`,
    confidence: 65,
  }),
  'nonmetal+nonmetal': (a, b) => ({
    formula: `${a}${b}2`,
    name: `${a} ${b}ide`,
    yield: 40 + Math.random() * 40,
    stability: 'Highly Unstable',
    phase: 'Gas',
    color: '#ffaa00',
    description: `Covalent compound. Volatile and reactive under standard conditions.`,
    confidence: 45,
  }),
  'transition+halogen': (a, b) => ({
    formula: `${a}${b}2`,
    name: `${a}(II) ${b}ide`,
    yield: 75 + Math.random() * 20,
    stability: 'Stable',
    phase: 'Solid',
    color: ['#00ff00', '#0000ff', '#ff00ff'][Math.floor(Math.random() * 3)],
    description: `Colored transition metal complex. Variable oxidation states possible.`,
    confidence: 82,
  }),
};

export const getReactionType = (catA: string, catB: string): string => {
  const categories = [catA, catB].sort();
  if (categories.includes('alkali metal') && categories.includes('diatomic nonmetal')) return 'alkali+halogen';
  if (categories.includes('alkali metal') && categories.includes('polyatomic nonmetal')) return 'alkali+halogen';
  if (categories.includes('transition metal') && categories.includes('diatomic nonmetal')) return 'transition+halogen';
  if (categories.includes('transition metal') && categories.includes('polyatomic nonmetal')) return 'transition+halogen';
  if (categories.includes('metal') && categories.includes('nonmetal')) return 'metal+nonmetal';
  if (categories.every(c => c.includes('nonmetal'))) return 'nonmetal+nonmetal';
  return 'metal+nonmetal';
};

export const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'MIT FlowER Model Predicts Novel Reaction Pathways',
    source: 'MIT News',
    summary: 'New generative AI approach uses bond-electron matrices to predict chemical reactions with 95% accuracy on USPTO dataset.',
    date: '2026-04-21',
  },
  {
    id: '2',
    title: 'AI Discovers Catalyst for CO2 Electroreduction',
    source: 'Nature Chemistry',
    summary: 'Machine-learned interatomic potentials identify stable Cu-Co surface alloy with 40% efficiency improvement.',
    date: '2026-04-18',
  },
  {
    id: '3',
    title: 'Robotic Self-Driving Lab Synthesizes 1000 New Compounds',
    source: 'Science',
    summary: 'ANU SDL system achieves 3-week discovery cycle, compressing traditional 3-year timeline.',
    date: '2026-04-15',
  },
  {
    id: '4',
    title: 'Quantum Chemistry on NISQ Devices: First Atmospheric Reaction',
    source: 'Quantinuum',
    summary: 'InQuanto platform simulates NO2 formation on trapped-ion quantum computer.',
    date: '2026-04-10',
  },
  {
    id: '5',
    title: 'GPT-4 Extracts Structured Chemistry Data at Scale',
    source: 'J. Chem. Inf.',
    summary: 'LLM pipeline generates ML-ready datasets from 176 publications with 0.86 R² for titer prediction.',
    date: '2026-04-05',
  },
];
