import { motion, AnimatePresence } from 'framer-motion';
import { useLab } from '../../context/LabContext';
import { cn } from '../../lib/utils';
import { BrainCircuit, FlaskConical, Zap, Microscope, Radio, Database, Activity, Clock, TrendingUp, AlertCircle, Beaker, Star, FileText } from 'lucide-react';
import { useState } from 'react';

function AIStatusPanel() {
  const { aiStatus, isSynthesizing } = useLab();
  
  const statusHistory = [
    'System initialized...',
    'Loading quantum databases...',
    'Periodic table synced (118 elements)',
    'AI model FlowER-v3 loaded',
    'Reaction engine ready',
    aiStatus,
  ];

  return (
    <div className="glass-panel rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <BrainCircuit className="w-4 h-4 text-cyan-400" />
        AI Cortex Status
      </div>
      
      <div className="font-mono text-xs space-y-1 max-h-32 overflow-y-auto">
        {statusHistory.map((status, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              'flex items-center gap-2',
              i === statusHistory.length - 1 ? 'text-cyan-400' : 'text-slate-600'
            )}
          >
            <span className="text-[10px]">{new Date().toLocaleTimeString()}</span>
            <span>&gt; {status}</span>
            {i === statusHistory.length - 1 && isSynthesizing && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-cyan-400"
              >
                _
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <div className="flex-1 bg-slate-800/50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-cyan-400 font-mono">94.2%</div>
          <div className="text-[10px] text-slate-500">Model Accuracy</div>
        </div>
        <div className="flex-1 bg-slate-800/50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-green-400 font-mono">1.2M</div>
          <div className="text-[10px] text-slate-500">Reactions Learned</div>
        </div>
      </div>
    </div>
  );
}

function DiscoveryLog() {
  const { discoveries } = useLab();
  
  return (
    <div className="glass-panel rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Star className="w-4 h-4 text-yellow-400" />
          Discovery Log
        </div>
        <span className="text-[10px] text-slate-600 font-mono">{discoveries.length} entries</span>
      </div>
      
      <div className="space-y-2 max-h-48 overflow-y-auto">
        <AnimatePresence>
          {discoveries.map((discovery, index) => (
            <motion.div
              key={discovery.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2 }}
              className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/50 cursor-pointer hover:border-cyan-500/30 transition-colors"
              style={{ transformStyle: 'preserve-3d', perspective: 500 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">{discovery.title}</span>
                <span className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded font-mono',
                  discovery.confidence > 80 ? 'bg-green-500/20 text-green-400' :
                  discovery.confidence > 50 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                )}>
                  {discovery.confidence.toFixed(1)}%
                </span>
              </div>
              <div className="font-mono text-sm text-cyan-400 mb-1">{discovery.formula}</div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <Clock className="w-3 h-3" />
                {discovery.timestamp.toLocaleTimeString()}
                <span className="px-1.5 py-0.5 rounded bg-slate-700/50">{discovery.category}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function NewsFeed() {
  const { news } = useLab();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="glass-panel rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <Radio className="w-4 h-4 text-green-400" />
        Live Research Feed
      </div>
      
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {news.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-l-2 border-slate-700 pl-3 py-1 cursor-pointer hover:border-cyan-400 transition-colors"
            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
          >
            <div className="text-xs font-medium text-slate-300 hover:text-white transition-colors">
              {item.title}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
              <FileText className="w-3 h-3" />
              {item.source}
              <span>{item.date}</span>
            </div>
            <AnimatePresence>
              {expandedId === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="text-xs text-slate-400 mt-1 overflow-hidden"
                >
                  {item.summary}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function RightSidebar() {
  return (
    <motion.aside
      initial={{ x: 250, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-80 border-l border-slate-700/50 flex flex-col gap-4 p-4 overflow-y-auto"
      style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)' }}
    >
      <AIStatusPanel />
      <DiscoveryLog />
      <NewsFeed />
      
      <div className="glass-panel rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Activity className="w-4 h-4 text-magenta-400" />
          System Metrics
        </div>
        
        <div className="space-y-2">
          {[
            { label: 'CPU Load', value: 42, color: '#00f0ff' },
            { label: 'GPU Compute', value: 78, color: '#ff0055' },
            { label: 'Memory', value: 65, color: '#00ff9d' },
            { label: 'Network I/O', value: 23, color: '#ffe66d' },
          ].map((metric) => (
            <div key={metric.label} className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>{metric.label}</span>
                <span className="font-mono">{metric.value}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: metric.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
