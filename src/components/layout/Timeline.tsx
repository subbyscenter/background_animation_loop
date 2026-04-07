import { useRef, useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Play, Pause, Upload, Trash2, Loader2 } from 'lucide-react';
import { t } from '../../i18n';
import { analyze } from 'web-audio-beat-detector';

export default function Timeline() {
  const { 
    audioUrl, setAudioUrl, 
    audioDuration, setAudioDuration, 
    currentTime, setCurrentTime, 
    isPlaying, setIsPlaying,
    setBpm
  } = useAppStore();
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const [isDetectingBpm, setIsDetectingBpm] = useState(false);

  // Sync audio element with state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioUrl]);

  // Handle manual scrubbing
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Update current time loop
  useEffect(() => {
    const updateTime = (timestamp: number) => {
      if (isPlaying) {
        if (audioUrl && audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        } else {
          // Fallback timer if no audio
          const delta = (timestamp - lastTimeRef.current) / 1000;
          setCurrentTime((useAppStore.getState().currentTime + delta) % 60); // Loop every 60s
        }
      }
      lastTimeRef.current = timestamp;
      animationRef.current = requestAnimationFrame(updateTime);
    };

    animationRef.current = requestAnimationFrame(updateTime);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, audioUrl]);

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setIsPlaying(false);
      setCurrentTime(0);

      // Detect BPM
      try {
        setIsDetectingBpm(true);
        const audioContext = new AudioContext();
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const tempo = await analyze(audioBuffer);
        if (tempo) {
          setBpm(Math.round(tempo));
        }
      } catch (error) {
        console.error('BPM detection failed:', error);
      } finally {
        setIsDetectingBpm(false);
      }
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-16 border-t border-zinc-800 bg-zinc-950 flex items-center px-4 gap-4 shrink-0">
      {/* Audio Element (Hidden) */}
      {audioUrl && (
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration)}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Play/Pause Button */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white transition-colors shrink-0"
        title={isPlaying ? t.timeline.pause : t.timeline.play}
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
      </button>

      {/* Time Display */}
      <div className="text-xs font-mono text-zinc-400 w-24 shrink-0 text-center">
        {formatTime(currentTime)} / {audioUrl ? formatTime(audioDuration) : '60:00'}
      </div>

      {/* Scrubber */}
      <div className="flex-1 flex items-center">
        <input
          type="range"
          min="0"
          max={audioUrl ? audioDuration : 60}
          step="0.01"
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>

      {/* Audio Upload/Remove */}
      <div className="flex items-center gap-2 shrink-0">
        <input 
          type="file" 
          accept="audio/*" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleAudioUpload}
        />
        {isDetectingBpm && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-zinc-700 bg-zinc-800 text-zinc-400 text-xs font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            BPM 분석 중...
          </div>
        )}
        {audioUrl ? (
          <button
            onClick={() => {
              setAudioUrl(null);
              setAudioDuration(0);
              setCurrentTime(0);
              setIsPlaying(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded border border-red-900/50 bg-red-900/20 hover:bg-red-900/40 text-red-400 text-xs font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {t.timeline.removeAudio}
          </button>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 rounded border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            {t.timeline.uploadAudio}
          </button>
        )}
      </div>
    </div>
  );
}
