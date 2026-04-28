import { motion } from 'framer-motion';
import { useLab } from '../../context/LabContext';
import { cn } from '../../lib/utils';
import { elements } from '../../data/elements';
import type { ChemicalElement } from '../../types';

const categoryColors: Record<string, { bg: string; border: string; glow: string }> = {
  'alkali metal': { bg: 'bg-red-900/30', border: 'border-red-500/50', glow: 'shadow-red-500/50' },
  'alkaline earth metal': { bg: 'bg-orange-900/30', border: 'border-orange-500/50', glow: 'shadow-orange-500/50' },
  'transition metal': { bg: 'bg-yellow-900/30', border: 'border-yellow-500/50', glow: 'shadow-yellow-500/50' },
  'post-transition metal': { bg: 'bg-cyan-900/30', border: 'border-cyan-500/50', glow: 'shadow-cyan-500/50' },
  'metalloid': { bg: 'bg-green-900/30', border: 'border-green-500/50', glow: 'shadow-green-500/50' },
  'diatomic nonmetal': { bg: 'bg-blue-900/30', border: 'border-blue-500/50', glow: 'shadow-blue-500/50' },
  'polyatomic nonmetal': { bg: 'bg-indigo-900/30', border: 'border-indigo-500/50', glow: 'shadow-indigo-500/50' },
  'noble gas': { bg: 'bg-teal-900/30', border: 'border-teal-500/50', glow: 'shadow-teal-500/50' },
  'lanthanide': { bg: 'bg-pink-900/30', border: 'border-pink-500/50', glow: 'shadow-pink-500/50' },
  'actinide': { bg: 'bg-fuchsia-900/30', border: 'border-fuchsia-500/50', glow: 'shadow-fuchsia-500/50' },
  'unknown': { bg: 'bg-slate-800/30', border: 'border-slate-500/50', glow: 'shadow-slate-500/50' },
};

function ElementTile({ element, index }: { element: ChemicalElement; index: number }) {
  const { selectedElement, setSelectedElement, addReactant, activeCategory } = useLab();
  const isSelected = selectedElement?.atomicNumber === element.atomicNumber;
  const isFiltered = activeCategory && element.category !== activeCategory;
  const colors = categoryColors[element.category] || categoryColors['unknown'];

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: isFiltered ? 0.2 : 1, 
        scale: 1,
        filter: isFiltered ? 'blur(2px)' : 'blur(0px)'
      }}
      transition={{ delay: index * 0.005, duration: 0.3 }}
      whileHover={{ 
        scale: 1.15, 
        zIndex: 50,
        boxShadow: `0 0 20px ${colors.glow.replace('shadow-', '').replace('/50', '/0.6')}`,
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        setSelectedElement(element);
        addReactant(element);
      }}
      className={cn(
        'relative w-full aspect-square rounded-lg border flex flex-col items-center justify-center p-1 transition-all duration-200 cursor-pointer',
        colors.bg,
        colors.border,
        isSelected ? 'ring-2 ring-cyan-400 bg-slate-700/80 scale-110 z-10' : 'hover:bg-slate-700/50'
      )}
      style={{
        gridColumn: element.xpos,
        gridRow: element.ypos > 7 ? element.ypos - 2 : element.ypos,
      }}
    >
      <span className="text-[8px] text-slate-500 font-mono absolute top-0.5 left-1">{element.atomicNumber}</span>
      <span className="text-sm font-bold text-white">{element.symbol}</span>
      <span className="text-[7px] text-slate-400 truncate w-full text-center px-0.5">{element.name}</span>
      <span className="text-[6px] text-slate-500 font-mono">{element.atomicMass.toFixed(1)}</span>
    </motion.button>
  );
}

export function PeriodicTable() {
  return (
    <div className="glass-panel rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)"/>
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)"/>
          </svg>
          Periodic Table of Elements
        </h2>
        <span className="text-[10px] text-slate-600 font-mono">118 Elements | 7 Periods</span>
      </div>
      
      <div 
        className="grid gap-1"
        style={{ 
          gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(7, minmax(0, 1fr))'
        }}
      >
        {elements.map((element, index) => (
          <ElementTile key={element.atomicNumber} element={element} index={index} />
        ))}
      </div>
    </div>
  );
}
