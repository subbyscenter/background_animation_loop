import { useAppStore } from '../../store/useAppStore';
import FloatingPanel from '../ui/FloatingPanel';
import { Upload, Trash2 } from 'lucide-react';
import { useRef } from 'react';
import { builtinParticles } from '../../utils/builtinParticles';

export default function ParticleLibraryPanel() {
  const { customParticles, addCustomParticle, removeCustomParticle, isParticleLibraryOpen, setIsParticleLibraryOpen } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    addCustomParticle({
      id: crypto.randomUUID(),
      name: file.name,
      url
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <FloatingPanel 
      title="Particle Library" 
      isOpen={isParticleLibraryOpen} 
      onClose={() => setIsParticleLibraryOpen(false)}
      defaultPosition={{ x: 300, y: 60 }}
      defaultSize={{ width: 300, height: 500 }}
    >
      <div className="p-4 flex flex-col gap-4">
        <div className="text-xs text-zinc-400 bg-zinc-900 p-3 rounded border border-zinc-800">
          <p>이 앱은 웹 브라우저에서 실행되므로, 컴퓨터의 특정 폴더에 이미지를 저장해서 자동으로 불러올 수 없습니다.</p>
          <p className="mt-2">대신 아래 버튼을 눌러 PNG 이미지를 직접 업로드하면 파티클로 사용할 수 있습니다.</p>
        </div>

        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium transition-colors"
        >
          <Upload className="w-4 h-4" />
          PNG 이미지 업로드
        </button>
        <input 
          type="file" 
          accept="image/png" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileUpload}
        />

        <div className="flex flex-col gap-2 mt-2">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase">src/assets/particles 폴더 (자동 로드)</h4>
          {builtinParticles.length === 0 ? (
            <div className="text-xs text-zinc-600 py-2">폴더에 PNG 파일이 없습니다.</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {builtinParticles.map(particle => (
                <div key={particle.id} className="relative group aspect-square bg-zinc-900 border border-zinc-800 rounded overflow-hidden flex items-center justify-center p-2">
                  <img src={particle.url} alt={particle.name} className="max-w-full max-h-full object-contain" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] text-zinc-300 truncate px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-center">
                    {particle.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase">업로드된 파티클</h4>
          {customParticles.length === 0 ? (
            <div className="text-xs text-zinc-600 py-2">업로드된 이미지가 없습니다.</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {customParticles.map(particle => (
                <div key={particle.id} className="relative group aspect-square bg-zinc-900 border border-zinc-800 rounded overflow-hidden flex items-center justify-center p-2">
                  <img src={particle.url} alt={particle.name} className="max-w-full max-h-full object-contain" />
                  <button 
                    onClick={() => removeCustomParticle(particle.id)}
                    className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] text-zinc-300 truncate px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-center">
                    {particle.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </FloatingPanel>
  );
}
