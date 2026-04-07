import { useAppStore } from '../../store/useAppStore';
import { Download, Play, HelpCircle, Loader2, Layers, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { t } from '../../i18n';
import { useRef } from 'react';

export default function Header() {
  const { 
    bpm, setBpm, setIsGuideOpen, 
    isRecording, setIsRecording, 
    setIsPlaying, setCurrentTime,
    audioUrl, audioDuration, includeAudio,
    isLayersPanelOpen, setIsLayersPanelOpen,
    isPropertiesPanelOpen, setIsPropertiesPanelOpen,
    isParticleLibraryOpen, setIsParticleLibraryOpen
  } = useAppStore();

  const handleExport = async () => {
    if (isRecording) return;
    
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      alert('Canvas not found');
      return;
    }

    try {
      setIsRecording(true);
      setCurrentTime(0);
      setIsPlaying(true);

      const stream = canvas.captureStream(30);
      const audioEl = document.querySelector('audio');
      
      if (includeAudio && audioUrl && audioEl) {
        try {
          // Attempt to capture audio stream
          // Note: This might fail if the browser doesn't support captureStream on audio elements
          // or if there are CORS issues, but since it's a local blob, it usually works in Chrome/Firefox.
          const audioStream = (audioEl as any).captureStream ? (audioEl as any).captureStream() : (audioEl as any).mozCaptureStream ? (audioEl as any).mozCaptureStream() : null;
          if (audioStream && audioStream.getAudioTracks().length > 0) {
            stream.addTrack(audioStream.getAudioTracks()[0]);
          }
        } catch (e) {
          console.warn('Failed to capture audio stream:', e);
        }
      }

      let mimeType = 'video/webm';
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        mimeType = 'video/webm;codecs=vp9';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        mimeType = 'video/webm;codecs=vp8';
      } else if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
      }
      
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `loop-bg-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsRecording(false);
        setIsPlaying(false);
      };

      recorder.start();

      // Stop recording after audio duration or 10 seconds default
      const recordDuration = audioUrl && audioDuration > 0 ? audioDuration * 1000 : 10000;
      
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, recordDuration);

    } catch (error) {
      console.error('Export failed:', error);
      alert('비디오 추출에 실패했습니다.');
      setIsRecording(false);
      setIsPlaying(false);
    }
  };

  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center">
          <Play className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-sm font-semibold text-zinc-100">{t.header.title}</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 border-r border-zinc-800 pr-6">
          <button 
            onClick={() => setIsLayersPanelOpen(!isLayersPanelOpen)}
            className={`p-1.5 rounded transition-colors ${isLayersPanelOpen ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'}`}
            title="레이어 패널"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsPropertiesPanelOpen(!isPropertiesPanelOpen)}
            className={`p-1.5 rounded transition-colors ${isPropertiesPanelOpen ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'}`}
            title="속성 패널"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsParticleLibraryOpen(!isParticleLibraryOpen)}
            className={`p-1.5 rounded transition-colors ${isParticleLibraryOpen ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'}`}
            title="파티클 라이브러리"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
        </div>

        <button 
          onClick={() => setIsGuideOpen(true)}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100 transition-colors text-sm font-medium"
        >
          <HelpCircle className="w-4 h-4" />
          {t.header.guide}
        </button>

        <div className="flex items-center gap-2">
          <label htmlFor="bpm" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{t.header.bpm}</label>
          <input
            id="bpm"
            type="number"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-20 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <button 
          onClick={handleExport}
          disabled={isRecording}
          className={`flex items-center gap-2 px-4 py-1.5 rounded text-sm font-medium transition-colors ${
            isRecording 
              ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isRecording ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              추출 중...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              {t.header.export}
            </>
          )}
        </button>
      </div>
    </header>
  );
}

