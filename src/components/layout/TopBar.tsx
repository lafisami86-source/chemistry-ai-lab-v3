import { motion } from 'framer-motion';
import { useLab } from '../../context/LabContext';
import { BrainCircuit, Key, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export function TopBar() {
  const { aiStatus, apiKey, setApiKey, autoProgress } = useLab();
  const [showKey, setShowKey] = useState(false);

  const statusColor =
    aiStatus.startsWith('Error') ? 'text-red-400' :
    aiStatus.startsWith('[AUTO]') ? 'text-yellow-400' :
    autoProgress.isRunning ? 'text-yellow-400' :
    'text-green-400';

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="h-16 border-b border-slate-700/50 flex items-center justify-between px-6 relative z-50 gap-4"
      style={{ background: 'rgba(5, 11, 20, 0.9)', backdropFilter: 'blur(12px)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative">
          <BrainCircuit className="w-8 h-8 text-cyan-400" />
          <motion.div
            className="absolute inset-0 rounded-full bg-cyan-400/20"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            CHEMISTRY <span className="text-cyan-400">AI BRAIN</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
            Autonomous Laboratory v3.0
          </p>
        </div>
      </div>

      {/* API Key input */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <Key className="w-4 h-4 text-slate-500 shrink-0" />
        <div className="relative flex-1">
          <input
            type={showKey ? 'text' : 'password'}
            placeholder="Enter Anthropic API key (sk-ant-...)"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-300 placeholder:text-slate-600 outline-none focus:border-cyan-500/50 transition-colors pr-8"
          />
          <button
            onClick={() => setShowKey(s => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </button>
        </div>
        <div className={`w-2 h-2 rounded-full shrink-0 ${apiKey ? 'bg-green-400' : 'bg-red-500'}`} />
      </div>

      {/* AI Status */}
      <div className="flex items-center gap-2 shrink-0">
        <motion.div
          className="w-2 h-2 rounded-full bg-green-500"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className={`text-xs font-mono max-w-xs truncate ${statusColor}`}>
          {aiStatus}
        </span>
      </div>
    </motion.header>
  );
}
