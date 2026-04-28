import { motion, AnimatePresence } from 'framer-motion';
import { useLab } from '../../context/LabContext';
import { Bot, Play, Pause, Square, Zap, Target, Beaker, TrendingUp } from 'lucide-react';

export function AutoModePanel() {
  const { autoProgress, startAutoMode, pauseAutoMode, stopAutoMode, setAutoSpeed, setAutoStrategy, apiKey } = useLab();
  const { isRunning, isPaused, explored, total, discoveries, currentPair, speed, strategy } = autoProgress;

  const pct = total > 0 ? (explored / total) * 100 : 0;

  return (
    <div className="glass-panel rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Bot className="w-4 h-4 text-cyan-400" />
          Autonomous Exploration Mode
        </h2>
        {isRunning && (
          <motion.div
            className="flex items-center gap-1.5 text-[10px] text-yellow-400 font-mono"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            {isPaused ? 'PAUSED' : 'RUNNING'}
          </motion.div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-800/60 rounded-lg p-2 text-center">
          <div className="text-lg font-bold font-mono text-cyan-400">{explored.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500">Explored</div>
        </div>
        <div className="bg-slate-800/60 rounded-lg p-2 text-center">
          <div className="text-lg font-bold font-mono text-yellow-400">{total.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500">Total Pairs</div>
        </div>
        <div className="bg-slate-800/60 rounded-lg p-2 text-center">
          <div className="text-lg font-bold font-mono text-green-400">{discoveries}</div>
          <div className="text-[10px] text-slate-500">Discoveries</div>
        </div>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Progress</span>
            <span>{pct.toFixed(2)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
              style={{ width: `${pct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          {currentPair && (
            <div className="text-[10px] text-slate-500 font-mono truncate">
              Current: <span className="text-cyan-400">{currentPair}</span>
            </div>
          )}
        </div>
      )}

      {/* Config (only when not running) */}
      <AnimatePresence>
        {!isRunning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden"
          >
            {/* Strategy */}
            <div>
              <div className="text-[10px] text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                <Target className="w-3 h-3" /> Strategy
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {([
                  { v: 'metals-first', label: 'Metals First', icon: '⚙️' },
                  { v: 'all', label: 'All Pairs', icon: '🔬' },
                  { v: 'stable-only', label: 'Stable Focus', icon: '✅' },
                  { v: 'novel', label: 'Novel Only', icon: '⭐' },
                ] as const).map(opt => (
                  <button
                    key={opt.v}
                    onClick={() => setAutoStrategy(opt.v)}
                    className={`text-[11px] px-2 py-1.5 rounded-lg border transition-all text-left flex items-center gap-1.5 ${
                      strategy === opt.v
                        ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
                        : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <span>{opt.icon}</span> {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Speed */}
            <div>
              <div className="text-[10px] text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Speed (API calls/min)
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {([
                  { v: 'slow', label: 'Slow', sub: '~7/min' },
                  { v: 'normal', label: 'Normal', sub: '~15/min' },
                  { v: 'fast', label: 'Fast', sub: '~40/min' },
                ] as const).map(opt => (
                  <button
                    key={opt.v}
                    onClick={() => setAutoSpeed(opt.v)}
                    className={`text-[11px] px-2 py-1.5 rounded-lg border transition-all text-center ${
                      speed === opt.v
                        ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
                        : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[9px] opacity-60">{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {!apiKey && (
              <div className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                ⚠️ Enter your Anthropic API key in the top bar to start
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control buttons */}
      <div className="flex gap-2">
        {!isRunning ? (
          <button
            onClick={startAutoMode}
            disabled={!apiKey}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            <Play className="w-4 h-4" />
            Start Autonomous Exploration
          </button>
        ) : (
          <>
            <button
              onClick={pauseAutoMode}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs font-bold hover:bg-yellow-500/30 transition-colors"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={stopAutoMode}
              className="px-4 py-2.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-colors"
            >
              <Square className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
