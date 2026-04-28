import { motion, AnimatePresence } from 'framer-motion';
import { useLab } from '../../context/LabContext';
import { cn } from '../../lib/utils';
import { FlaskConical, Zap, Beaker, X, RotateCcw, Thermometer, Gauge, TrendingUp, TrendingDown, AlertTriangle, Shield } from 'lucide-react';
import { useState } from 'react';

function ReactionFlask({ reactant, position, onRemove }: { reactant: any; position: 'left' | 'right'; onRemove: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, scale: 0.8 }} className="relative">
      <div className={cn('w-32 h-40 relative flex flex-col items-center justify-end pb-4 rounded-xl border-2',
        position === 'left' ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-pink-500/50 bg-pink-500/5'
      )}>
        <motion.div
          animate={{ height: ['60%','65%','60%'], opacity: [0.4,0.7,0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
          className={cn('absolute bottom-0 left-0 right-0 rounded-b-xl', position === 'left' ? 'bg-cyan-500/30' : 'bg-pink-500/30')}
        />
        <div className="relative z-10 text-center">
          <div className="text-3xl font-bold text-white">{reactant.element.symbol}</div>
          <div className="text-[10px] text-slate-300">{reactant.element.name}</div>
          <div className="text-[8px] text-slate-500 font-mono mt-1">EN: {reactant.element.electronegativity ?? 'N/A'}</div>
          <div className="text-[8px] text-slate-500 font-mono">{reactant.element.phase}</div>
        </div>
        <button onClick={onRemove} className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-800/80 flex items-center justify-center hover:bg-red-500/80 transition-colors">
          <X className="w-3 h-3 text-white" />
        </button>
      </div>
      <div className="text-center mt-2">
        <span className="text-[10px] text-slate-500 font-mono uppercase">Reactant {position === 'left' ? 'A' : 'B'}</span>
      </div>
    </motion.div>
  );
}

function EmptyFlask({ position }: { position: 'left' | 'right' }) {
  return (
    <div className={cn('w-32 h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center',
      position === 'left' ? 'border-cyan-500/20' : 'border-pink-500/20')}>
      <FlaskConical className={cn('w-8 h-8 mb-2', position === 'left' ? 'text-cyan-500/30' : 'text-pink-500/30')} />
      <span className="text-[10px] text-slate-600 font-mono">Click Element</span>
    </div>
  );
}

function ThermodynamicCard({ result }: { result: any }) {
  const isExothermic = result.deltaH < 0;
  const isSpontaneous = result.deltaG < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/60 rounded-xl p-3 space-y-2 border border-slate-700/50"
    >
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
        <TrendingUp className="w-3 h-3" /> Thermodynamic Data
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-slate-900/60 rounded-lg p-1.5">
          <div className={cn('text-sm font-bold font-mono', isExothermic ? 'text-blue-400' : 'text-red-400')}>
            {result.deltaH > 0 ? '+' : ''}{result.deltaH.toFixed(1)}
          </div>
          <div className="text-[9px] text-slate-500">ΔH kJ/mol</div>
        </div>
        <div className="bg-slate-900/60 rounded-lg p-1.5">
          <div className="text-sm font-bold font-mono text-purple-400">
            {result.deltaS > 0 ? '+' : ''}{result.deltaS.toFixed(1)}
          </div>
          <div className="text-[9px] text-slate-500">ΔS J/mol·K</div>
        </div>
        <div className="bg-slate-900/60 rounded-lg p-1.5">
          <div className={cn('text-sm font-bold font-mono', isSpontaneous ? 'text-green-400' : 'text-orange-400')}>
            {result.deltaG > 0 ? '+' : ''}{result.deltaG.toFixed(1)}
          </div>
          <div className="text-[9px] text-slate-500">ΔG kJ/mol</div>
        </div>
      </div>

      <div className="flex gap-2">
        <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-mono',
          isExothermic ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400')}>
          {isExothermic ? '❄️ Exothermic' : '🔥 Endothermic'}
        </span>
        <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-mono',
          isSpontaneous ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400')}>
          {isSpontaneous ? '✅ Spontaneous' : '⚡ Non-spontaneous'}
        </span>
      </div>

      <div className="text-[9px] text-slate-500 font-mono flex justify-between">
        <span>Bond: <span className="text-cyan-400">{result.bondType}</span></span>
        <span>Opt. Temp: <span className="text-yellow-400">{result.optimalTemp}°C</span></span>
      </div>

      {result.balancedEquation && (
        <div className="bg-slate-900/60 rounded-lg p-2 font-mono text-[10px] text-slate-300 break-all">
          {result.balancedEquation}
        </div>
      )}

      {result.safetyWarning && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
          <AlertTriangle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
          <span className="text-[10px] text-red-400">{result.safetyWarning}</span>
        </div>
      )}
    </motion.div>
  );
}

function ReactionOutput() {
  const { reactionResult, isSynthesizing } = useLab();

  return (
    <AnimatePresence>
      {reactionResult && !isSynthesizing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20 }}
          className="glass-panel rounded-xl p-4 w-full space-y-3"
        >
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Beaker className="w-4 h-4 text-green-400" />
            Synthesis Result
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-normal">AI PREDICTED</span>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg,#00f0ff,#5f27cd)', boxShadow: '0 0 20px rgba(0,240,255,0.3)' }}
            >
              {reactionResult.formula.length > 6 ? reactionResult.formula.slice(0,5)+'…' : reactionResult.formula}
            </div>
            <div>
              <div className="text-sm font-bold text-white">{reactionResult.name}</div>
              <div className="text-[11px] text-slate-400">{reactionResult.phase} at STP</div>
              {reactionResult.isAlloy && <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400">Alloy</span>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex flex-col">
              <span className="text-slate-500">Yield</span>
              <div className="h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${reactionResult.yield}%` }} />
              </div>
              <span className="font-mono text-cyan-400 text-[11px]">{reactionResult.yield.toFixed(1)}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500">Stability</span>
              <span className={cn('font-mono mt-1', reactionResult.stability === 'Stable' ? 'text-green-400' : reactionResult.stability === 'Unstable' ? 'text-yellow-400' : 'text-red-400')}>
                ● {reactionResult.stability}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500">AI Confidence</span>
              <span className="font-mono text-cyan-400 mt-1">{reactionResult.confidence.toFixed(1)}%</span>
            </div>
          </div>

          <ThermodynamicCard result={reactionResult} />

          <p className="text-[11px] text-slate-400 leading-relaxed">{reactionResult.description}</p>
        </motion.div>
      )}

      {isSynthesizing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel rounded-xl flex flex-col items-center justify-center py-8 w-full">
          <motion.div animate={{ rotate: 360, scale: [1,1.2,1] }} transition={{ duration: 2, repeat: Infinity }}>
            <FlaskConical className="w-12 h-12 text-cyan-400" />
          </motion.div>
          <motion.p animate={{ opacity: [0.5,1,0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-xs text-cyan-400 mt-3 font-mono">
            Claude is analyzing the reaction...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ReactionChamber() {
  const { reactants, clearReactants, removeReactant, synthesize } = useLab();
  const [temperature, setTemperature] = useState(25);
  const [pressure, setPressure] = useState(1);
  const canSynthesize = reactants.length === 2;

  return (
    <div className="glass-panel rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-pink-400" />
          Reaction Chamber
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <Thermometer className="w-3 h-3" />
            <input type="range" min="-273" max="2000" value={temperature} onChange={e => setTemperature(Number(e.target.value))} className="w-16 accent-cyan-400" />
            <span className="font-mono w-14">{temperature}°C</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <Gauge className="w-3 h-3" />
            <input type="range" min="0" max="100" value={pressure} onChange={e => setPressure(Number(e.target.value))} className="w-16 accent-cyan-400" />
            <span className="font-mono w-10">{pressure}atm</span>
          </div>
          <button onClick={clearReactants} className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors">
            <RotateCcw className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6">
        <AnimatePresence mode="wait">
          {reactants[0] ? <ReactionFlask key={reactants[0].id} reactant={reactants[0]} position="left" onRemove={() => removeReactant(reactants[0].id)} /> : <EmptyFlask position="left" />}
        </AnimatePresence>

        <div className="flex flex-col items-center gap-2">
          <motion.button
            whileHover={{ scale: canSynthesize ? 1.1 : 1 }}
            whileTap={{ scale: canSynthesize ? 0.9 : 1 }}
            onClick={() => synthesize(temperature, pressure)}
            disabled={!canSynthesize}
            className={cn('w-16 h-16 rounded-full flex items-center justify-center relative transition-all duration-300',
              canSynthesize ? 'bg-gradient-to-r from-cyan-500 to-blue-600 cursor-pointer' : 'bg-slate-800 cursor-not-allowed opacity-50')}
          >
            <Zap className="w-7 h-7 text-white" />
            {canSynthesize && (
              <motion.div className="absolute inset-0 rounded-full border-2 border-cyan-400"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
            )}
          </motion.button>
          <span className="text-[9px] text-slate-600 font-mono">SYNTHESIZE</span>
        </div>

        <AnimatePresence mode="wait">
          {reactants[1] ? <ReactionFlask key={reactants[1].id} reactant={reactants[1]} position="right" onRemove={() => removeReactant(reactants[1].id)} /> : <EmptyFlask position="right" />}
        </AnimatePresence>
      </div>

      <ReactionOutput />

      {!reactants.length && (
        <div className="text-center text-[10px] text-slate-600 font-mono">
          Click on any element in the periodic table to add it as a reactant
        </div>
      )}
    </div>
  );
}
