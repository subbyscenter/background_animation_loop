import { Rnd } from 'react-rnd';
import { X } from 'lucide-react';

interface FloatingPanelProps {
  title: string;
  children: React.ReactNode;
  defaultPosition?: { x: number, y: number };
  defaultSize?: { width: number, height: number };
  onClose?: () => void;
  isOpen: boolean;
}

export default function FloatingPanel({ title, children, defaultPosition, defaultSize, onClose, isOpen }: FloatingPanelProps) {
  if (!isOpen) return null;
  
  return (
    <Rnd
      default={{
        x: defaultPosition?.x || 0,
        y: defaultPosition?.y || 0,
        width: defaultSize?.width || 300,
        height: defaultSize?.height || 400,
      }}
      bounds="parent"
      dragHandleClassName="panel-header"
      className="bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden z-50 absolute"
      style={{ display: 'flex', flexDirection: 'column' }}
      minWidth={250}
      minHeight={200}
      enableResizing={{
        top: false, right: false, bottom: true, left: true, topRight: false, bottomRight: false, bottomLeft: true, topLeft: false
      }}
    >
      <div className="panel-header bg-zinc-900 border-b border-zinc-800 p-2 flex items-center justify-between cursor-grab active:cursor-grabbing">
        <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider select-none">{title}</h3>
        {onClose && (
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-0 flex flex-col">
        {children}
      </div>
    </Rnd>
  );
}
