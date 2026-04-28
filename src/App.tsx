import { LabProvider, useLab } from './context/LabContext';
import { NeuralCanvas } from './components/canvas/NeuralCanvas';
import { TopBar } from './components/layout/TopBar';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { RightSidebar } from './components/layout/RightSidebar';
import { PeriodicTable } from './components/ui/PeriodicTable';
import { ReactionChamber } from './components/ui/ReactionChamber';
import { AutoModePanel } from './components/ui/AutoModePanel';
import { ElementPropertiesPanel } from './components/data-display/ElementPropertiesPanel';

function MainContent() {
  const { selectedElement, discoveries } = useLab();

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Periodic table + Reaction chamber */}
        <div className="lg:col-span-2 space-y-4">
          <PeriodicTable />
          <ReactionChamber />
        </div>

        {/* Right: Info panels */}
        <div className="space-y-4">
          <AutoModePanel />
          <ElementPropertiesPanel />

          {/* Quick stats */}
          <div className="glass-panel rounded-xl p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Stats</h3>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Elements Selected', value: selectedElement ? selectedElement.symbol : '—', color: 'text-cyan-400' },
                { label: 'Total Discoveries', value: String(discoveries.length), color: 'text-green-400' },
                { label: 'High Confidence (>80%)', value: String(discoveries.filter(d => d.confidence > 80).length), color: 'text-yellow-400' },
                { label: 'Stable Compounds', value: String(discoveries.filter(d => d.stability === 'Stable').length), color: 'text-purple-400' },
              ].map(item => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-slate-500">{item.label}</span>
                  <span className={`font-mono ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <LabProvider>
      <div className="h-screen w-screen flex flex-col relative overflow-hidden" style={{ background: '#050b14' }}>
        <NeuralCanvas />
        <TopBar />
        <div className="flex-1 flex overflow-hidden relative z-10">
          <LeftSidebar />
          <MainContent />
          <RightSidebar />
        </div>
      </div>
    </LabProvider>
  );
}

export default App;
