import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import type { ChemicalElement, Reactant, ReactionResult, Discovery, NewsItem, AutoProgress } from '../types';
import { elements } from '../data/elements';
import { newsItems } from '../data/reactions';
import { predictReactionWithClaude } from '../services/claudeApi';
import { v4 as uuidv4 } from 'uuid';

// ── Speed delays ────────────────────────────────────────────────────────────
const SPEED_DELAY = { slow: 8000, normal: 4000, fast: 1500 };

// ── Build priority-ordered pair queue ────────────────────────────────────────
function buildQueue(strategy: AutoProgress['strategy']): [number, number][] {
  const all: [number, number][] = [];
  for (let i = 0; i < elements.length; i++) {
    for (let j = i + 1; j < elements.length; j++) {
      all.push([i, j]);
    }
  }
  if (strategy === 'metals-first') {
    const metalCats = new Set(['alkali metal','alkaline earth metal','transition metal','post-transition metal']);
    return [
      ...all.filter(([i,j]) => metalCats.has(elements[i].category) && metalCats.has(elements[j].category)),
      ...all.filter(([i,j]) => !(metalCats.has(elements[i].category) && metalCats.has(elements[j].category))),
    ];
  }
  return all;
}

// ── Context type ─────────────────────────────────────────────────────────────
interface LabContextType {
  apiKey: string;
  setApiKey: (k: string) => void;
  selectedElement: ChemicalElement | null;
  setSelectedElement: (el: ChemicalElement | null) => void;
  reactants: Reactant[];
  addReactant: (element: ChemicalElement) => void;
  removeReactant: (id: string) => void;
  clearReactants: () => void;
  reactionResult: ReactionResult | null;
  isSynthesizing: boolean;
  synthesize: (temp: number, pressure: number) => void;
  discoveries: Discovery[];
  aiStatus: string;
  activeCategory: string | null;
  setActiveCategory: (cat: string | null) => void;
  isFocusMode: boolean;
  setIsFocusMode: (mode: boolean) => void;
  news: NewsItem[];
  // Auto mode
  autoProgress: AutoProgress;
  startAutoMode: () => void;
  pauseAutoMode: () => void;
  stopAutoMode: () => void;
  setAutoSpeed: (s: AutoProgress['speed']) => void;
  setAutoStrategy: (s: AutoProgress['strategy']) => void;
}

const LabContext = createContext<LabContextType | undefined>(undefined);

export function LabProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState('');
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null);
  const [reactants, setReactants] = useState<Reactant[]>([]);
  const [reactionResult, setReactionResult] = useState<ReactionResult | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [aiStatus, setAiStatus] = useState('System Ready — Add API Key to Enable Claude');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([
    { id: uuidv4(), title: 'Novel Perovskite Solar Cell Material', formula: 'Cs2AgBiBr6', confidence: 94, timestamp: new Date(Date.now()-86400000), category: 'Material' },
    { id: uuidv4(), title: 'AI-Designed CO2 Reduction Catalyst', formula: 'Cu3N/Cu2O', confidence: 87, timestamp: new Date(Date.now()-172800000), category: 'Catalyst' },
    { id: uuidv4(), title: 'High-Temperature Superconductor Candidate', formula: 'LaH10', confidence: 71, timestamp: new Date(Date.now()-259200000), category: 'Compound' },
  ]);

  // ── Auto mode state ─────────────────────────────────────────────────────
  const [autoProgress, setAutoProgress] = useState<AutoProgress>({
    explored: 0, total: 0, discoveries: 0, currentPair: '',
    isRunning: false, isPaused: false, speed: 'normal', strategy: 'metals-first',
  });

  const autoRef = useRef<{ running: boolean; paused: boolean; queue: [number,number][]; idx: number }>({
    running: false, paused: false, queue: [], idx: 0,
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Manual synthesize ──────────────────────────────────────────────────
  const addReactant = useCallback((element: ChemicalElement) => {
    setReactants(prev => {
      if (prev.length >= 2) return prev;
      setAiStatus(`Loaded ${element.symbol} into reaction chamber`);
      return [...prev, { id: uuidv4(), element, quantity: 1 }];
    });
  }, []);

  const removeReactant = useCallback((id: string) => {
    setReactants(prev => prev.filter(r => r.id !== id));
  }, []);

  const clearReactants = useCallback(() => {
    setReactants([]);
    setReactionResult(null);
    setAiStatus('Reaction chamber cleared');
  }, []);

  const synthesize = useCallback(async (temp: number, pressure: number) => {
    if (reactants.length < 2) { setAiStatus('Error: Need 2 reactants'); return; }
    if (!apiKey) { setAiStatus('Error: Please enter your Anthropic API key'); return; }

    setIsSynthesizing(true);
    setReactionResult(null);
    setAiStatus(`Claude analyzing ${reactants[0].element.symbol} + ${reactants[1].element.symbol}...`);

    try {
      const result = await predictReactionWithClaude(
        reactants[0].element, reactants[1].element, temp, pressure, apiKey
      );
      setReactionResult(result);
      setAiStatus(`Synthesis complete: ${result.formula} (${result.confidence.toFixed(0)}% confidence)`);

      if (result.confidence > 60) {
        const disc: Discovery = {
          id: uuidv4(),
          title: result.isAlloy ? `${result.name} Alloy` : result.name,
          formula: result.formula,
          confidence: result.confidence,
          timestamp: new Date(),
          category: result.isAlloy ? 'Alloy' : result.stability === 'Stable' ? 'Compound' : 'Reaction',
          deltaG: result.deltaG,
          stability: result.stability,
          elementA: reactants[0].element.symbol,
          elementB: reactants[1].element.symbol,
        };
        setDiscoveries(prev => [disc, ...prev].slice(0, 50));
      }
    } catch (err: any) {
      setAiStatus(`Error: ${err.message}`);
    } finally {
      setIsSynthesizing(false);
    }
  }, [reactants, apiKey]);

  // ── Auto mode engine ───────────────────────────────────────────────────
  const runNextPair = useCallback(async () => {
    const ref = autoRef.current;
    if (!ref.running || ref.paused) return;
    if (ref.idx >= ref.queue.length) {
      autoRef.current.running = false;
      setAutoProgress(p => ({ ...p, isRunning: false, currentPair: 'Exploration complete!' }));
      setAiStatus('Auto exploration complete!');
      return;
    }

    const [i, j] = ref.queue[ref.idx];
    const elA = elements[i];
    const elB = elements[j];
    const pairLabel = `${elA.symbol} + ${elB.symbol}`;

    setAutoProgress(p => ({ ...p, currentPair: pairLabel, explored: ref.idx + 1 }));
    setAiStatus(`[AUTO] Analyzing ${pairLabel}...`);

    // Show reactants visually
    setReactants([
      { id: uuidv4(), element: elA, quantity: 1 },
      { id: uuidv4(), element: elB, quantity: 1 },
    ]);
    setReactionResult(null);

    try {
      const key = autoRef.current.running ? apiKey : '';
      if (!key) throw new Error('No API key');

      const result = await predictReactionWithClaude(elA, elB, 25, 1, key);
      setReactionResult(result);
      setAiStatus(`[AUTO] ${pairLabel} → ${result.formula} (${result.confidence.toFixed(0)}%)`);

      if (result.confidence > 60) {
        const disc: Discovery = {
          id: uuidv4(),
          title: result.isAlloy ? `${result.name} Alloy` : result.name,
          formula: result.formula,
          confidence: result.confidence,
          timestamp: new Date(),
          category: result.isAlloy ? 'Alloy' : result.stability === 'Stable' ? 'Compound' : 'Reaction',
          deltaG: result.deltaG,
          stability: result.stability,
          elementA: elA.symbol,
          elementB: elB.symbol,
        };
        setDiscoveries(prev => [disc, ...prev].slice(0, 50));
        setAutoProgress(p => ({ ...p, discoveries: p.discoveries + 1 }));
      }
    } catch (err: any) {
      setAiStatus(`[AUTO] Error on ${pairLabel}: ${err.message}`);
    }

    autoRef.current.idx++;
    const delay = SPEED_DELAY[autoProgress.speed] || 4000;
    if (autoRef.current.running && !autoRef.current.paused) {
      timerRef.current = setTimeout(runNextPair, delay);
    }
  }, [apiKey, autoProgress.speed]);

  const startAutoMode = useCallback(() => {
    if (!apiKey) { setAiStatus('Error: Please enter your Anthropic API key first'); return; }
    const queue = buildQueue(autoProgress.strategy);
    autoRef.current = { running: true, paused: false, queue, idx: 0 };
    setAutoProgress(p => ({
      ...p, isRunning: true, isPaused: false,
      explored: 0, discoveries: 0, total: queue.length, currentPair: 'Starting...',
    }));
    setAiStatus('Autonomous mode started!');
    timerRef.current = setTimeout(runNextPair, 500);
  }, [apiKey, autoProgress.strategy, runNextPair]);

  const pauseAutoMode = useCallback(() => {
    autoRef.current.paused = !autoRef.current.paused;
    if (timerRef.current) clearTimeout(timerRef.current);
    setAutoProgress(p => ({ ...p, isPaused: autoRef.current.paused }));
    setAiStatus(autoRef.current.paused ? 'Auto mode paused' : 'Auto mode resumed');
    if (!autoRef.current.paused) timerRef.current = setTimeout(runNextPair, 500);
  }, [runNextPair]);

  const stopAutoMode = useCallback(() => {
    autoRef.current.running = false;
    autoRef.current.paused = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    setAutoProgress(p => ({ ...p, isRunning: false, isPaused: false, currentPair: '' }));
    setReactants([]);
    setReactionResult(null);
    setAiStatus('Auto mode stopped');
  }, []);

  const setAutoSpeed = useCallback((s: AutoProgress['speed']) => {
    setAutoProgress(p => ({ ...p, speed: s }));
  }, []);

  const setAutoStrategy = useCallback((s: AutoProgress['strategy']) => {
    setAutoProgress(p => ({ ...p, strategy: s }));
  }, []);

  // Cleanup on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <LabContext.Provider value={{
      apiKey, setApiKey,
      selectedElement, setSelectedElement,
      reactants, addReactant, removeReactant, clearReactants,
      reactionResult, isSynthesizing, synthesize,
      discoveries, aiStatus,
      activeCategory, setActiveCategory,
      isFocusMode, setIsFocusMode,
      news: newsItems,
      autoProgress, startAutoMode, pauseAutoMode, stopAutoMode,
      setAutoSpeed, setAutoStrategy,
    }}>
      {children}
    </LabContext.Provider>
  );
}

export function useLab() {
  const context = useContext(LabContext);
  if (!context) throw new Error('useLab must be used within a LabProvider');
  return context;
}
