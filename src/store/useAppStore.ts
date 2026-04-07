import { create } from 'zustand';
import { temporal } from 'zundo';

export type LayerType = 'PolkaDots' | 'DiagonalStripes' | 'BouncingColorBar' | 'ParticleRain';
export type AspectRatio = '16:9' | '9:16' | '1:1';
export type Resolution = 720 | 1080 | 1440 | 2160;
export type BackgroundType = 'solid' | 'gradient';

export interface CustomParticle {
  id: string;
  name: string;
  url: string;
}

export interface Layer {
  id: string;
  type: LayerType;
  name: string;
  visible: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  speed: number; // BPM multiplier
  colors: string[];
  patternSize: number;
  customProps: Record<string, any>; // For pattern-specific properties
}

interface AppState {
  bpm: number;
  setBpm: (bpm: number) => void;
  backgroundType: BackgroundType;
  setBackgroundType: (type: BackgroundType) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  backgroundGradient: { color1: string; color2: string; angle: number };
  setBackgroundGradient: (gradient: { color1: string; color2: string; angle: number }) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  resolution: Resolution;
  setResolution: (res: Resolution) => void;
  isGuideOpen: boolean;
  setIsGuideOpen: (isOpen: boolean) => void;
  
  // Custom Particles
  customParticles: CustomParticle[];
  addCustomParticle: (particle: CustomParticle) => void;
  removeCustomParticle: (id: string) => void;

  // Panel States
  isLayersPanelOpen: boolean;
  setIsLayersPanelOpen: (isOpen: boolean) => void;
  isPropertiesPanelOpen: boolean;
  setIsPropertiesPanelOpen: (isOpen: boolean) => void;
  isParticleLibraryOpen: boolean;
  setIsParticleLibraryOpen: (isOpen: boolean) => void;

  // Audio & Timeline
  audioUrl: string | null;
  setAudioUrl: (url: string | null) => void;
  audioDuration: number;
  setAudioDuration: (duration: number) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  includeAudio: boolean;
  setIncludeAudio: (include: boolean) => void;

  // Layers
  layers: Layer[];
  addLayer: (layer: Omit<Layer, 'id' | 'customProps'>) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  removeLayer: (id: string) => void;
  selectedLayerId: string | null;
  setSelectedLayerId: (id: string | null) => void;
}

export const useAppStore = create<AppState>()(
  temporal(
    (set) => ({
      bpm: 120,
      setBpm: (bpm) => set({ bpm }),
      backgroundType: 'solid',
      setBackgroundType: (backgroundType) => set({ backgroundType }),
      backgroundColor: '#00FF00', // Default Chroma Key Green
      setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
      backgroundGradient: { color1: '#00FF00', color2: '#0000FF', angle: 90 },
      setBackgroundGradient: (backgroundGradient) => set({ backgroundGradient }),
      aspectRatio: '16:9',
      setAspectRatio: (aspectRatio) => set({ aspectRatio }),
      resolution: 1080,
      setResolution: (resolution) => set({ resolution }),
      isGuideOpen: false,
      setIsGuideOpen: (isGuideOpen) => set({ isGuideOpen }),
      
      customParticles: [],
      addCustomParticle: (particle) => set((state) => ({ customParticles: [...state.customParticles, particle] })),
      removeCustomParticle: (id) => set((state) => ({ customParticles: state.customParticles.filter(p => p.id !== id) })),

      isLayersPanelOpen: true,
      setIsLayersPanelOpen: (isLayersPanelOpen) => set({ isLayersPanelOpen }),
      isPropertiesPanelOpen: true,
      setIsPropertiesPanelOpen: (isPropertiesPanelOpen) => set({ isPropertiesPanelOpen }),
      isParticleLibraryOpen: false,
      setIsParticleLibraryOpen: (isParticleLibraryOpen) => set({ isParticleLibraryOpen }),

      audioUrl: null,
      setAudioUrl: (audioUrl) => set({ audioUrl }),
      audioDuration: 0,
      setAudioDuration: (audioDuration) => set({ audioDuration }),
      currentTime: 0,
      setCurrentTime: (currentTime) => set({ currentTime }),
      isPlaying: false,
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      isRecording: false,
      setIsRecording: (isRecording) => set({ isRecording }),
      includeAudio: true,
      setIncludeAudio: (includeAudio) => set({ includeAudio }),

      layers: [],
      addLayer: (layer) => set((state) => {
        const defaultCustomProps: Record<string, any> = {};
        if (layer.type === 'PolkaDots') {
          defaultCustomProps.grouping = 'unified'; // 'unified' | 'alternating'
          defaultCustomProps.animType = 'slide'; // 'slide' | 'wave'
          defaultCustomProps.slideSpeed = 50; // pixels per second
          defaultCustomProps.slideDirection = 45; // degrees
          defaultCustomProps.scale1 = 1;
          defaultCustomProps.scale2 = 1;
        } else if (layer.type === 'ParticleRain') {
          defaultCustomProps.layerCount = 3;
          defaultCustomProps.particleLayers = [
            { id: 'bg', name: 'Background', shapeType: 'Circle', count: 100, speed: 20, opacity: 0.3, minSize: 2, maxSize: 5, color: '#ffffff', bpmSync: 'none', direction: 90, pulseSize: 1.5, pulseOpacity: 0.5 },
            { id: 'mg', name: 'Midground', shapeType: 'Triangle', count: 50, speed: 50, opacity: 0.6, minSize: 5, maxSize: 12, color: '#aaaaaa', bpmSync: 'pulse', direction: 90, pulseSize: 1.5, pulseOpacity: 0.5 },
            { id: 'fg', name: 'Foreground', shapeType: 'Star', count: 20, speed: 100, opacity: 1.0, minSize: 15, maxSize: 30, color: '#ffff00', bpmSync: 'none', direction: 90, pulseSize: 1.5, pulseOpacity: 0.5 },
          ];
          defaultCustomProps.activeTab = 0;
        }
        
        return {
          layers: [...state.layers, { ...layer, name: layer.type, visible: true, customProps: defaultCustomProps, id: crypto.randomUUID() }]
        };
      }),
      updateLayer: (id, updates) => set((state) => ({
        layers: state.layers.map(l => l.id === id ? { ...l, ...updates } : l)
      })),
      removeLayer: (id) => set((state) => ({
        layers: state.layers.filter(l => l.id !== id),
        selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId
      })),
      selectedLayerId: null,
      setSelectedLayerId: (id) => set({ selectedLayerId: id }),
    }),
    {
      partialize: (state) => ({ 
        layers: state.layers, 
        backgroundType: state.backgroundType,
        backgroundColor: state.backgroundColor, 
        backgroundGradient: state.backgroundGradient,
        bpm: state.bpm,
        aspectRatio: state.aspectRatio,
        resolution: state.resolution,
        customParticles: state.customParticles
      }),
    }
  )
);



