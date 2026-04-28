import { motion } from 'framer-motion';
import { useLab } from '../../context/LabContext';
import { cn } from '../../lib/utils';
import { elements } from '../../data/elements';
import { Atom, FlaskConical, Zap, Radio, Database, Beaker, CircleDot, Hexagon, Diamond, Square, Triangle, Star, Circle } from 'lucide-react';

const categories = [
  { name: 'alkali metal', label: 'Alkali Metals', color: '#ff6b6b', icon: Zap },
  { name: 'alkaline earth metal', label: 'Alkaline Earth', color: '#ff9f43', icon: Flame },
  { name: 'transition metal', label: 'Transition Metals', color: '#feca57', icon: Hexagon },
  { name: 'post-transition metal', label: 'Post-Transition', color: '#48dbfb', icon: Square },
  { name: 'metalloid', label: 'Metalloids', color: '#1dd1a1', icon: Diamond },
  { name: 'diatomic nonmetal', label: 'Diatomic Nonmetals', color: '#5f27cd', icon: CircleDot },
  { name: 'polyatomic nonmetal', label: 'Polyatomic Nonmetals', color: '#54a0ff', icon: Triangle },
  { name: 'noble gas', label: 'Noble Gases', color: '#00d2d3', icon: Circle },
  { name: 'lanthanide', label: 'Lanthanides', color: '#ff9ff3', icon: Star },
  { name: 'actinide', label: 'Actinides', color: '#f368e0', icon: Atom },
];

// Custom Flame icon since lucide might not have it
function Flame(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c0 0-7 4-7 11 0 3.86 3.14 7 7 7s7-3.14 7-7c0-7-7-11-7-11z"/>
      <path d="M12 14c-1.1 0-2-.9-2-2"/>
    </svg>
  );
}

export function LeftSidebar() {
  const { activeCategory, setActiveCategory } = useLab();

  return (
    <motion.aside
      initial={{ x: -250, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-64 border-r border-slate-700/50 flex flex-col"
      style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)' }}
    >
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Database className="w-4 h-4" />
          Element Groups
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveCategory(null)}
          className={cn(
            'w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-3',
            activeCategory === null
              ? 'bg-slate-700/80 text-white shadow-lg'
              : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
          )}
        >
          <Atom className="w-4 h-4" />
          All Elements
        </motion.button>
        
        {categories.map((cat) => {
          const Icon = cat.icon;
          const count = elements.filter(e => e.category === cat.name).length;
          return (
            <motion.button
              key={cat.name}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
              className={cn(
                'w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-3 border-l-2',
                activeCategory === cat.name
                  ? 'bg-slate-700/80 text-white shadow-lg border-l-4'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border-l-2 border-transparent'
              )}
              style={{
                borderLeftColor: activeCategory === cat.name ? cat.color : 'transparent',
              }}
            >
              <Icon className="w-4 h-4" style={{ color: cat.color }} />
              <span className="flex-1">{cat.label}</span>
              <span className="text-xs text-slate-600 font-mono">{count}</span>
            </motion.button>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-slate-700/50">
        <div className="text-[10px] text-slate-600 font-mono space-y-1">
          <div className="flex justify-between">
            <span>Total Elements</span>
            <span className="text-cyan-400">118</span>
          </div>
          <div className="flex justify-between">
            <span>Active Database</span>
            <span className="text-green-400">Reaxys API</span>
          </div>
          <div className="flex justify-between">
            <span>AI Model</span>
            <span className="text-magenta-400">FlowER-v3</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
