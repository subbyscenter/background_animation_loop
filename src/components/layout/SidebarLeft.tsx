import { useAppStore, LayerType } from '../../store/useAppStore';
import { Circle, Square, Activity, CloudRain } from 'lucide-react';
import { t } from '../../i18n';

const getPatterns = () => [
  { type: 'PolkaDots' as LayerType, label: t.sidebarLeft.patterns.PolkaDots, icon: Circle },
  { type: 'DiagonalStripes' as LayerType, label: t.sidebarLeft.patterns.DiagonalStripes, icon: Square },
  { type: 'BouncingColorBar' as LayerType, label: t.sidebarLeft.patterns.BouncingColorBar, icon: Activity },
  { type: 'ParticleRain' as LayerType, label: t.sidebarLeft.patterns.ParticleRain, icon: CloudRain },
];

export default function SidebarLeft() {
  const addLayer = useAppStore((state) => state.addLayer);
  const patterns = getPatterns();

  const handleAddPattern = (type: LayerType) => {
    addLayer({
      type,
      name: type,
      visible: true,
      x: 0, // Center of the workspace
      y: 0,
      width: 3000, // Large enough to cover any aspect ratio rotation
      height: 3000,
      rotation: 0,
      speed: 1,
      colors: ['#ffffff', '#000000'],
      patternSize: 100,
    });
  };

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col shrink-0">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t.sidebarLeft.title}</h2>
      </div>
      <div className="p-4 flex flex-col gap-2 overflow-y-auto">
        {patterns.map((pattern) => {
          const Icon = pattern.icon;
          return (
            <button
              key={pattern.type}
              onClick={() => handleAddPattern(pattern.type)}
              className="flex items-center gap-3 p-3 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-700 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-colors">
                <Icon className="w-4 h-4 text-zinc-300" />
              </div>
              <span className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100">{pattern.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}


