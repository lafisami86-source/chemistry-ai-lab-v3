import { motion, AnimatePresence } from 'framer-motion';
import { useLab } from '../../context/LabContext';
import { cn } from '../../lib/utils';
import { Atom, Zap, Eye, Database, Layers, CircleDot, ArrowRight } from 'lucide-react';

const categoryColors: Record<string, string> = {
  'alkali metal': '#ff6b6b',
  'alkaline earth metal': '#ff9f43',
  'transition metal': '#feca57',
  'post-transition metal': '#48dbfb',
  'metalloid': '#1dd1a1',
  'diatomic nonmetal': '#5f27cd',
  'polyatomic nonmetal': '#54a0ff',
  'noble gas': '#00d2d3',
  'lanthanide': '#ff9ff3',
  'actinide': '#f368e0',
  'unknown': '#95a5a6',
};

export function ElementPropertiesPanel() {
  const { selectedElement, setSelectedElement, addReactant } = useLab();

  return (
    <AnimatePresence>
      {selectedElement && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25 }}
          className="glass-panel rounded-xl p-4"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold text-white"
                style={{ 
                  backgroundColor: categoryColors[selectedElement.category] + '40',
                  border: `2px solid ${categoryColors[selectedElement.category]}`,
                  boxShadow: `0 0 15px ${categoryColors[selectedElement.category]}40`
                }}
              >
                {selectedElement.symbol}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{selectedElement.name}</h3>
                <p className="text-[10px] text-slate-400 capitalize">{selectedElement.category}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedElement(null)}
              className="p-1 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <ArrowRight className="w-4 h-4 text-slate-400 rotate-45" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-slate-800/50 rounded-lg p-2">
              <div className="text-[10px] text-slate-500 uppercase">Atomic Number</div>
              <div className="text-lg font-mono text-cyan-400">{selectedElement.atomicNumber}</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2">
              <div className="text-[10px] text-slate-500 uppercase">Atomic Mass</div>
              <div className="text-lg font-mono text-cyan-400">{selectedElement.atomicMass}</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2">
              <div className="text-[10px] text-slate-500 uppercase">Electronegativity</div>
              <div className="text-lg font-mono text-cyan-400">
                {selectedElement.electronegativity || 'N/A'}
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2">
              <div className="text-[10px] text-slate-500 uppercase">Phase at STP</div>
              <div className={cn(
                'text-lg font-mono',
                selectedElement.phase === 'Gas' ? 'text-blue-400' :
                selectedElement.phase === 'Liquid' ? 'text-green-400' :
                selectedElement.phase === 'Solid' ? 'text-yellow-400' :
                'text-slate-400'
              )}>
                {selectedElement.phase}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-2 mb-3">
            <div className="text-[10px] text-slate-500 uppercase mb-1">Electron Configuration</div>
            <div className="text-sm font-mono text-cyan-400">{selectedElement.electronConfiguration}</div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => addReactant(selectedElement)}
              className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg py-2 text-xs text-cyan-400 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Zap className="w-3 h-3" />
              Add to Reaction
            </button>
            <button
              onClick={() => setSelectedElement(null)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-400 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
