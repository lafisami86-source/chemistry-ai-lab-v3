export interface ChemicalElement {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number;
  category: ElementCategory;
  electronConfiguration: string;
  electronegativity?: number;
  phase: 'Solid' | 'Liquid' | 'Gas' | 'Unknown';
  xpos: number;
  ypos: number;
  cpkHex?: string;
}

export type ElementCategory =
  | 'alkali metal'
  | 'alkaline earth metal'
  | 'lanthanide'
  | 'actinide'
  | 'transition metal'
  | 'post-transition metal'
  | 'metalloid'
  | 'diatomic nonmetal'
  | 'polyatomic nonmetal'
  | 'noble gas'
  | 'unknown';

export interface Reactant {
  id: string;
  element: ChemicalElement;
  quantity: number;
}

export interface ReactionResult {
  formula: string;
  name: string;
  bondType?: string;
  balancedEquation?: string;
  yield: number;
  stability: 'Stable' | 'Unstable' | 'Highly Unstable';
  phase: string;
  color: string;
  description: string;
  confidence: number;
  deltaH?: number;
  deltaS?: number;
  deltaG?: number;
  optimalTemp?: number;
  safetyWarning?: string | null;
  isNobleGasReaction?: boolean;
  isAlloy?: boolean;
}

export interface Discovery {
  id: string;
  title: string;
  formula: string;
  confidence: number;
  timestamp: Date;
  category: 'Catalyst' | 'Material' | 'Compound' | 'Reaction' | 'Alloy';
  deltaG?: number;
  stability?: string;
  elementA?: string;
  elementB?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  summary: string;
  date: string;
}

export interface AutoProgress {
  explored: number;
  total: number;
  discoveries: number;
  currentPair: string;
  isRunning: boolean;
  isPaused: boolean;
  speed: 'slow' | 'normal' | 'fast';
  strategy: 'all' | 'metals-first' | 'stable-only' | 'novel';
}
