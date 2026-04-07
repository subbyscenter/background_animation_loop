import { useAppStore, AspectRatio, Resolution, BackgroundType } from '../../store/useAppStore';
import { t } from '../../i18n';
import chroma from 'chroma-js';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import FloatingPanel from '../ui/FloatingPanel';

import { builtinParticles } from '../../utils/builtinParticles';

const Section = ({ title, children, defaultOpen = true }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-zinc-800">
      <button 
        onClick={() => setOpen(!open)} 
        className="w-full flex items-center justify-between p-4 text-sm font-medium text-zinc-100 hover:bg-zinc-900 transition-colors"
      >
        {title}
        <ChevronDown className={`w-4 h-4 text-zinc-500 transform transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="p-4 pt-0 flex flex-col gap-6">{children}</div>}
    </div>
  );
};

const SliderWithInput = ({ label, value, min, max, step = 1, onChange, unit = '' }: { label: string, value: number, min: number, max: number, step?: number, onChange: (v: number) => void, unit?: string }) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between items-center">
      <label className="text-xs text-zinc-400">{label}</label>
      <div className="flex items-center gap-1">
        <input 
          type="number" 
          value={Number(value).toString()} 
          onChange={(e) => {
            let val = parseFloat(e.target.value);
            if (!isNaN(val)) {
              val = Math.max(min, Math.min(max, val));
              onChange(val);
            }
          }}
          className="w-14 bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-xs text-right text-zinc-300 focus:outline-none focus:border-indigo-500"
        />
        {unit && <span className="text-[10px] text-zinc-500">{unit}</span>}
      </div>
    </div>
    <input 
      type="range" min={min} max={max} step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full accent-indigo-500"
    />
  </div>
);

export default function PropertiesPanel() {
  const { 
    layers, selectedLayerId, updateLayer, removeLayer,
    backgroundType, setBackgroundType,
    backgroundColor, setBackgroundColor,
    backgroundGradient, setBackgroundGradient,
    aspectRatio, setAspectRatio,
    resolution, setResolution,
    includeAudio, setIncludeAudio,
    isPropertiesPanelOpen, setIsPropertiesPanelOpen
  } = useAppStore();
  
  const selectedLayer = layers.find(l => l.id === selectedLayerId);

  const generatePalettes = (baseColor: string) => {
    try {
      const color = chroma(baseColor);
      return [
        { name: t.sidebarRight.paletteTypes.analogous, colors: [color.hex(), color.set('hsl.h', '+30').hex(), color.set('hsl.h', '-30').hex()] },
        { name: t.sidebarRight.paletteTypes.complementary, colors: [color.hex(), color.set('hsl.h', '+180').hex(), color.set('hsl.h', '+150').hex()] },
        { name: t.sidebarRight.paletteTypes.triadic, colors: [color.hex(), color.set('hsl.h', '+120').hex(), color.set('hsl.h', '+240').hex()] },
        { name: t.sidebarRight.paletteTypes.monochromatic, colors: [color.hex(), color.brighten(1.5).hex(), color.darken(1.5).hex()] },
      ];
    } catch (e) {
      return [];
    }
  };

  const updateCustomProp = (key: string, value: any) => {
    if (!selectedLayer) return;
    updateLayer(selectedLayer.id, {
      customProps: {
        ...selectedLayer.customProps,
        [key]: value
      }
    });
  };

  return (
    <FloatingPanel 
      title={t.sidebarRight.title} 
      isOpen={isPropertiesPanelOpen} 
      onClose={() => setIsPropertiesPanelOpen(false)}
      defaultPosition={{ x: window.innerWidth - 320, y: 380 }}
      defaultSize={{ width: 300, height: 500 }}
    >
      <div className="flex flex-col">
        {/* Global Settings */}
        <Section title={t.sidebarRight.globalSettings}>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-zinc-400">배경 타입</label>
            <div className="flex border border-zinc-800 rounded overflow-hidden">
              <button
                onClick={() => setBackgroundType('solid')}
                className={`flex-1 py-1.5 text-xs font-medium transition-colors ${backgroundType === 'solid' ? 'bg-indigo-600 text-white' : 'bg-zinc-950 text-zinc-400 hover:bg-zinc-900'}`}
              >
                단색 (Solid)
              </button>
              <button
                onClick={() => setBackgroundType('gradient')}
                className={`flex-1 py-1.5 text-xs font-medium transition-colors ${backgroundType === 'gradient' ? 'bg-indigo-600 text-white' : 'bg-zinc-950 text-zinc-400 hover:bg-zinc-900'}`}
              >
                그라디언트 (Gradient)
              </button>
            </div>
          </div>

          {backgroundType === 'solid' ? (
            <div className="flex flex-col gap-2">
              <label className="text-xs text-zinc-400">배경 색상</label>
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded overflow-hidden border border-zinc-700">
                  <input 
                    type="color" 
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="absolute -inset-2 w-12 h-12 cursor-pointer"
                  />
                </div>
                <span className="text-xs text-zinc-300 uppercase font-mono">{backgroundColor}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-zinc-400">색상 1 (Start)</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded overflow-hidden border border-zinc-700">
                    <input 
                      type="color" 
                      value={backgroundGradient.color1}
                      onChange={(e) => setBackgroundGradient({ ...backgroundGradient, color1: e.target.value })}
                      className="absolute -inset-2 w-12 h-12 cursor-pointer"
                    />
                  </div>
                  <span className="text-xs text-zinc-300 uppercase font-mono">{backgroundGradient.color1}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-zinc-400">색상 2 (End)</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded overflow-hidden border border-zinc-700">
                    <input 
                      type="color" 
                      value={backgroundGradient.color2}
                      onChange={(e) => setBackgroundGradient({ ...backgroundGradient, color2: e.target.value })}
                      className="absolute -inset-2 w-12 h-12 cursor-pointer"
                    />
                  </div>
                  <span className="text-xs text-zinc-300 uppercase font-mono">{backgroundGradient.color2}</span>
                </div>
              </div>
              <SliderWithInput 
                label="그라디언트 각도" 
                value={backgroundGradient.angle} 
                min={0} max={360} 
                onChange={(v) => setBackgroundGradient({ ...backgroundGradient, angle: v })} 
                unit="°" 
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs text-zinc-400">{t.sidebarRight.aspectRatio}</label>
            <select 
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
              className="bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="16:9">16:9 (가로형)</option>
              <option value="9:16">9:16 (세로형/쇼츠)</option>
              <option value="1:1">1:1 (정방형)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-zinc-400">{t.sidebarRight.resolution}</label>
            <select 
              value={resolution}
              onChange={(e) => setResolution(Number(e.target.value) as Resolution)}
              className="bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value={720}>720p (HD)</option>
              <option value={1080}>1080p (FHD)</option>
              <option value={1440}>1440p (QHD)</option>
              <option value={2160}>2160p (4K)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input 
              type="checkbox" 
              id="includeAudio"
              checked={includeAudio}
              onChange={(e) => setIncludeAudio(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-zinc-950"
            />
            <label htmlFor="includeAudio" className="text-xs text-zinc-300 cursor-pointer">
              {t.sidebarRight.includeAudio}
            </label>
          </div>
        </Section>

        {/* Layer Settings */}
        {selectedLayer ? (
          <Section title={`${t.sidebarRight.layerSettings}: ${selectedLayer.type}`}>
            <div className="flex items-center justify-between">
              <button 
                onClick={() => removeLayer(selectedLayer.id)} 
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                {t.sidebarRight.deleteLayer}
              </button>
            </div>
            
            {/* Base Color Picker */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-zinc-400">{t.sidebarRight.baseColor}</label>
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded overflow-hidden border border-zinc-700">
                  <input 
                    type="color" 
                    value={selectedLayer.colors[0] || '#ffffff'}
                    onChange={(e) => {
                      const newColor = e.target.value;
                      updateLayer(selectedLayer.id, { colors: [newColor, ...selectedLayer.colors.slice(1)] });
                    }}
                    className="absolute -inset-2 w-12 h-12 cursor-pointer"
                  />
                </div>
                <span className="text-xs text-zinc-300 uppercase font-mono">{selectedLayer.colors[0] || '#ffffff'}</span>
              </div>
            </div>

            {/* Auto Palette Recommendation */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-zinc-400">{t.sidebarRight.autoPalette}</label>
              <div className="flex flex-col gap-2">
                {generatePalettes(selectedLayer.colors[0] || '#ffffff').map((palette, idx) => (
                  <button 
                    key={idx}
                    onClick={() => updateLayer(selectedLayer.id, { colors: palette.colors })}
                    className="flex flex-col gap-1.5 p-2 rounded border border-zinc-800 hover:border-indigo-500 bg-zinc-900 transition-colors text-left group"
                  >
                    <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors">{palette.name}</span>
                    <div className="flex h-5 w-full rounded overflow-hidden">
                      {palette.colors.map((c, i) => (
                        <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <SliderWithInput 
              label={t.sidebarRight.patternSize} 
              value={selectedLayer.patternSize} 
              min={10} max={500} 
              onChange={(v) => updateLayer(selectedLayer.id, { patternSize: v })} 
              unit="px" 
            />

            <SliderWithInput 
              label={t.sidebarRight.rotation} 
              value={selectedLayer.rotation} 
              min={0} max={360} 
              onChange={(v) => updateLayer(selectedLayer.id, { rotation: v })} 
              unit="°" 
            />

            <SliderWithInput 
              label={t.sidebarRight.speed} 
              value={selectedLayer.speed} 
              min={0} max={4} step={0.1} 
              onChange={(v) => updateLayer(selectedLayer.id, { speed: v })} 
              unit="x" 
            />

            {/* PolkaDots Specific Controls */}
            {selectedLayer.type === 'PolkaDots' && selectedLayer.customProps && (
              <div className="flex flex-col gap-4 p-3 bg-zinc-900 rounded border border-zinc-800 mt-2">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase">PolkaDots Settings</h4>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-zinc-400">{t.sidebarRight.polkaDots.grouping}</label>
                  <select 
                    value={selectedLayer.customProps.grouping || 'unified'}
                    onChange={(e) => updateCustomProp('grouping', e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="unified">{t.sidebarRight.polkaDots.groupingUnified}</option>
                    <option value="alternating">{t.sidebarRight.polkaDots.groupingAlternating}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-zinc-400">{t.sidebarRight.polkaDots.animType}</label>
                  <select 
                    value={selectedLayer.customProps.animType || 'slide'}
                    onChange={(e) => updateCustomProp('animType', e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="slide">{t.sidebarRight.polkaDots.animSlide}</option>
                    <option value="wave">{t.sidebarRight.polkaDots.animWave}</option>
                  </select>
                </div>

                {selectedLayer.customProps.animType === 'slide' && (
                  <>
                    <SliderWithInput 
                      label={t.sidebarRight.polkaDots.slideSpeed} 
                      value={selectedLayer.customProps.slideSpeed ?? 50} 
                      min={0} max={500} 
                      onChange={(v) => updateCustomProp('slideSpeed', v)} 
                      unit="px/s" 
                    />
                    <SliderWithInput 
                      label={t.sidebarRight.polkaDots.slideDirection} 
                      value={selectedLayer.customProps.slideDirection ?? 45} 
                      min={0} max={360} 
                      onChange={(v) => updateCustomProp('slideDirection', v)} 
                      unit="°" 
                    />
                  </>
                )}

                <SliderWithInput 
                  label={t.sidebarRight.polkaDots.scale1} 
                  value={selectedLayer.customProps.scale1 ?? 1} 
                  min={0.1} max={3} step={0.1} 
                  onChange={(v) => updateCustomProp('scale1', v)} 
                  unit="x" 
                />

                {selectedLayer.customProps.grouping === 'alternating' && (
                  <SliderWithInput 
                    label={t.sidebarRight.polkaDots.scale2} 
                    value={selectedLayer.customProps.scale2 ?? 1} 
                    min={0.1} max={3} step={0.1} 
                    onChange={(v) => updateCustomProp('scale2', v)} 
                    unit="x" 
                  />
                )}
              </div>
            )}

            {/* ParticleRain Specific Controls */}
            {selectedLayer.type === 'ParticleRain' && selectedLayer.customProps && selectedLayer.customProps.particleLayers && (
              <div className="flex flex-col gap-4 p-3 bg-zinc-900 rounded border border-zinc-800 mt-2">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase">Particle Rain Settings</h4>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-zinc-400">파티클 레이어 개수</label>
                  <select 
                    value={selectedLayer.customProps.layerCount || 3}
                    onChange={(e) => updateCustomProp('layerCount', Number(e.target.value))}
                    className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value={1}>1개</option>
                    <option value={2}>2개</option>
                    <option value={3}>3개</option>
                  </select>
                </div>

                {/* Tabs for layers */}
                <div className="flex border-b border-zinc-800">
                  {selectedLayer.customProps.particleLayers.slice(0, selectedLayer.customProps.layerCount || 3).map((pLayer: any, idx: number) => (
                    <button
                      key={pLayer.id}
                      onClick={() => updateCustomProp('activeTab', idx)}
                      className={`flex-1 py-1.5 text-xs font-medium border-b-2 transition-colors ${selectedLayer.customProps.activeTab === idx ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                    >
                      {idx === 0 ? t.sidebarRight.particleRain.layer1 : idx === 1 ? t.sidebarRight.particleRain.layer2 : t.sidebarRight.particleRain.layer3}
                    </button>
                  ))}
                </div>

                {/* Active Tab Content */}
                {(() => {
                  const activeIdx = Math.min(selectedLayer.customProps.activeTab ?? 0, (selectedLayer.customProps.layerCount || 3) - 1);
                  const activeLayer = selectedLayer.customProps.particleLayers[activeIdx];
                  if (!activeLayer) return null;
                  
                  const updateParticleLayer = (key: string, value: any) => {
                    const newLayers = [...selectedLayer.customProps.particleLayers];
                    newLayers[activeIdx] = { ...activeLayer, [key]: value };
                    updateCustomProp('particleLayers', newLayers);
                  };

                  return (
                    <div className="flex flex-col gap-4 mt-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-zinc-400">{t.sidebarRight.particleRain.shapeType}</label>
                        <select 
                          value={activeLayer.shapeType}
                          onChange={(e) => updateParticleLayer('shapeType', e.target.value)}
                          className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                        >
                          <optgroup label="기본 도형">
                            <option value="Circle">{t.sidebarRight.particleRain.shapes.Circle}</option>
                            <option value="Triangle">{t.sidebarRight.particleRain.shapes.Triangle}</option>
                            <option value="Diamond">{t.sidebarRight.particleRain.shapes.Diamond}</option>
                            <option value="Star">{t.sidebarRight.particleRain.shapes.Star}</option>
                            <option value="Snowflake">{t.sidebarRight.particleRain.shapes.Snowflake}</option>
                            <option value="Hexagon">{t.sidebarRight.particleRain.shapes.Hexagon}</option>
                            <option value="Heart">{t.sidebarRight.particleRain.shapes.Heart}</option>
                            <option value="Cross">{t.sidebarRight.particleRain.shapes.Cross}</option>
                          </optgroup>
                          <optgroup label="8bit 레트로">
                            <option value="Pixel">{t.sidebarRight.particleRain.shapes.Pixel}</option>
                            <option value="8bitHeart">{t.sidebarRight.particleRain.shapes['8bitHeart']}</option>
                            <option value="8bitStar">{t.sidebarRight.particleRain.shapes['8bitStar']}</option>
                            <option value="8bitInvader">{t.sidebarRight.particleRain.shapes['8bitInvader']}</option>
                          </optgroup>
                          <optgroup label="커스텀">
                            <option value="CustomImage">커스텀 이미지 (PNG)</option>
                          </optgroup>
                        </select>
                      </div>

                      {activeLayer.shapeType === 'CustomImage' && (
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-zinc-400">커스텀 이미지 선택</label>
                          <select 
                            value={activeLayer.customImageId || ''}
                            onChange={(e) => updateParticleLayer('customImageId', e.target.value)}
                            className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                          >
                            <option value="">선택 안함</option>
                            {builtinParticles.map(p => (
                              <option key={p.id} value={p.id}>[폴더] {p.name}</option>
                            ))}
                            {useAppStore.getState().customParticles.map(p => (
                              <option key={p.id} value={p.id}>[업로드] {p.name}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <SliderWithInput 
                        label={t.sidebarRight.particleRain.count} 
                        value={activeLayer.count} 
                        min={10} max={200} 
                        onChange={(v) => updateParticleLayer('count', v)} 
                      />

                      <SliderWithInput 
                        label={t.sidebarRight.particleRain.speed} 
                        value={activeLayer.speed} 
                        min={10} max={300} 
                        onChange={(v) => updateParticleLayer('speed', v)} 
                      />

                      <SliderWithInput 
                        label="슬라이드 이동 방향" 
                        value={activeLayer.direction ?? 90} 
                        min={0} max={360} 
                        onChange={(v) => updateParticleLayer('direction', v)} 
                        unit="°" 
                      />

                      <SliderWithInput 
                        label={t.sidebarRight.particleRain.opacity} 
                        value={activeLayer.opacity} 
                        min={0.1} max={1} step={0.1} 
                        onChange={(v) => updateParticleLayer('opacity', v)} 
                      />

                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <label className="text-xs text-zinc-400">{t.sidebarRight.particleRain.sizeRange}</label>
                          <span className="text-[10px] text-zinc-500">{activeLayer.minSize} - {activeLayer.maxSize}</span>
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="range" min="1" max="50" 
                            value={activeLayer.minSize}
                            onChange={(e) => updateParticleLayer('minSize', Math.min(Number(e.target.value), activeLayer.maxSize))}
                            className="w-full accent-indigo-500"
                          />
                          <input 
                            type="range" min="1" max="100" 
                            value={activeLayer.maxSize}
                            onChange={(e) => updateParticleLayer('maxSize', Math.max(Number(e.target.value), activeLayer.minSize))}
                            className="w-full accent-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-zinc-400">{t.sidebarRight.particleRain.bpmSync}</label>
                        <select 
                          value={activeLayer.bpmSync}
                          onChange={(e) => updateParticleLayer('bpmSync', e.target.value)}
                          className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                        >
                          <option value="none">{t.sidebarRight.particleRain.syncNone}</option>
                          <option value="pulse">{t.sidebarRight.particleRain.syncPulse}</option>
                        </select>
                      </div>

                      {activeLayer.bpmSync === 'pulse' && (
                        <>
                          <SliderWithInput 
                            label="펄스 크기 배수" 
                            value={activeLayer.pulseSize ?? 1.5} 
                            min={1} max={3} step={0.1} 
                            onChange={(v) => updateParticleLayer('pulseSize', v)} 
                            unit="x" 
                          />
                          <SliderWithInput 
                            label="펄스 투명도 배수" 
                            value={activeLayer.pulseOpacity ?? 0.5} 
                            min={0.1} max={1} step={0.1} 
                            onChange={(v) => updateParticleLayer('pulseOpacity', v)} 
                            unit="x" 
                          />
                        </>
                      )}

                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-zinc-400">Layer Color</label>
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-8 rounded overflow-hidden border border-zinc-700">
                            <input 
                              type="color" 
                              value={activeLayer.color}
                              onChange={(e) => updateParticleLayer('color', e.target.value)}
                              className="absolute -inset-2 w-12 h-12 cursor-pointer"
                            />
                          </div>
                          <span className="text-xs text-zinc-300 uppercase font-mono">{activeLayer.color}</span>
                        </div>
                      </div>

                    </div>
                  );
                })()}
              </div>
            )}

          </Section>
        ) : (
          <div className="text-sm text-zinc-500 text-center py-8">
            {t.sidebarRight.noLayerSelected}
          </div>
        )}
      </div>
    </FloatingPanel>
  );
}



