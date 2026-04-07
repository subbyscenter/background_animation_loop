import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n';
import { X } from 'lucide-react';

export default function GuideModal() {
  const { isGuideOpen, setIsGuideOpen } = useAppStore();

  if (!isGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-100">{t.guide.title}</h2>
          <button 
            onClick={() => setIsGuideOpen(false)}
            className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4 text-sm text-zinc-300 leading-relaxed">
          <p>{t.guide.step1}</p>
          <p>{t.guide.step2}</p>
          <p>{t.guide.step3}</p>
          <p>{t.guide.step4}</p>
          <p>{t.guide.step5}</p>
        </div>
        <div className="p-4 border-t border-zinc-800 flex justify-end">
          <button 
            onClick={() => setIsGuideOpen(false)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {t.guide.close}
          </button>
        </div>
      </div>
    </div>
  );
}
