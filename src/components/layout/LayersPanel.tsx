import { useAppStore } from '../../store/useAppStore';
import { Eye, EyeOff, Trash2, GripVertical } from 'lucide-react';
import FloatingPanel from '../ui/FloatingPanel';

export default function LayersPanel() {
  const { layers, selectedLayerId, setSelectedLayerId, updateLayer, removeLayer, isLayersPanelOpen, setIsLayersPanelOpen } = useAppStore();

  return (
    <FloatingPanel 
      title="Layers" 
      isOpen={isLayersPanelOpen} 
      onClose={() => setIsLayersPanelOpen(false)}
      defaultPosition={{ x: window.innerWidth - 320, y: 60 }}
      defaultSize={{ width: 300, height: 300 }}
    >
      <div className="flex flex-col gap-1 p-2">
        {layers.slice().reverse().map((layer) => (
          <div 
            key={layer.id}
            className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${selectedLayerId === layer.id ? 'bg-indigo-600/20 border border-indigo-500/50' : 'bg-zinc-900 border border-zinc-800 hover:bg-zinc-800'}`}
            onClick={() => setSelectedLayerId(layer.id)}
          >
            <button 
              className="text-zinc-500 hover:text-zinc-300"
              onClick={(e) => {
                e.stopPropagation();
                updateLayer(layer.id, { visible: !layer.visible });
              }}
            >
              {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <span className="flex-1 text-sm text-zinc-300 truncate">{layer.name || layer.type}</span>
            <button 
              className="text-zinc-500 hover:text-red-400"
              onClick={(e) => {
                e.stopPropagation();
                removeLayer(layer.id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {layers.length === 0 && (
          <div className="text-xs text-zinc-500 text-center py-4">No layers</div>
        )}
      </div>
    </FloatingPanel>
  );
}
