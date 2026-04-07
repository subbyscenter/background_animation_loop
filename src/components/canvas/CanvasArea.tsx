import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Path } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useAppStore } from '../../store/useAppStore';
import { getExportDimensions } from '../../utils/dimensions';
import PatternLayer from './PatternLayer';

export default function CanvasArea() {
  const { 
    backgroundType, backgroundColor, backgroundGradient, aspectRatio, resolution, 
    layers, selectedLayerId, setSelectedLayerId, updateLayer 
  } = useAppStore();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  // Camera state
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPointerPos, setLastPointerPos] = useState({ x: 0, y: 0 });

  const { width: frameWidth, height: frameHeight } = getExportDimensions(aspectRatio, resolution);

  // Handle container resize
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-fit frame when frame size or container size changes
  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return;
    
    // Leave 10% padding around the frame
    const padding = 0.9;
    const scaleX = (containerSize.width * padding) / frameWidth;
    const scaleY = (containerSize.height * padding) / frameHeight;
    const scale = Math.min(scaleX, scaleY);

    setStageScale(scale);
    setStagePos({
      x: containerSize.width / 2,
      y: containerSize.height / 2,
    });
  }, [frameWidth, frameHeight, containerSize.width, containerSize.height]);

  // Zoom with Mouse Wheel
  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    
    // Limit zoom
    if (newScale < 0.05 || newScale > 10) return;

    setStageScale(newScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  // Pan with Middle Mouse Button
  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (e.evt.button === 1) { // Middle click
      e.evt.preventDefault();
      setIsPanning(true);
      setLastPointerPos(e.target.getStage()?.getPointerPosition() || { x: 0, y: 0 });
    } else if (e.evt.button === 0) {
      // Deselect if clicking on empty background or frame overlay
      const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === 'background-rect' || e.target.name() === 'frame-overlay';
      if (clickedOnEmpty) {
        setSelectedLayerId(null);
      }
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isPanning) return;
    e.evt.preventDefault();
    const stage = e.target.getStage();
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos || !lastPointerPos) return;

    const dx = pointerPos.x - lastPointerPos.x;
    const dy = pointerPos.y - lastPointerPos.y;

    setStagePos({ x: stagePos.x + dx, y: stagePos.y + dy });
    setLastPointerPos(pointerPos);
  };

  const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    if (e.evt.button === 1) {
      setIsPanning(false);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full bg-zinc-900 overflow-hidden ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      {containerSize.width > 0 && (
        <Stage
          width={containerSize.width}
          height={containerSize.height}
          scaleX={stageScale}
          scaleY={stageScale}
          x={stagePos.x}
          y={stagePos.y}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <Layer>
            {/* Chroma Key Background (Only inside the logical frame) */}
            {backgroundType === 'solid' ? (
              <Rect
                name="background-rect"
                x={-frameWidth / 2}
                y={-frameHeight / 2}
                width={frameWidth}
                height={frameHeight}
                fill={backgroundColor}
              />
            ) : (
              <Rect
                name="background-rect"
                x={-frameWidth / 2}
                y={-frameHeight / 2}
                width={frameWidth}
                height={frameHeight}
                fillLinearGradientStartPoint={{ 
                  x: frameWidth / 2 + Math.cos((backgroundGradient.angle - 90) * Math.PI / 180) * frameWidth / 2, 
                  y: frameHeight / 2 + Math.sin((backgroundGradient.angle - 90) * Math.PI / 180) * frameHeight / 2 
                }}
                fillLinearGradientEndPoint={{ 
                  x: frameWidth / 2 - Math.cos((backgroundGradient.angle - 90) * Math.PI / 180) * frameWidth / 2, 
                  y: frameHeight / 2 - Math.sin((backgroundGradient.angle - 90) * Math.PI / 180) * frameHeight / 2 
                }}
                fillLinearGradientColorStops={[0, backgroundGradient.color1, 1, backgroundGradient.color2]}
              />
            )}

            {/* Patterns */}
            {layers.map(layer => layer.visible && (
              <PatternLayer 
                key={layer.id} 
                layer={layer} 
                isSelected={selectedLayerId === layer.id} 
                onSelect={() => setSelectedLayerId(layer.id)} 
                onChange={(newAttrs) => updateLayer(layer.id, newAttrs)} 
              />
            ))}

            {/* Export Frame Overlay (Darkens everything outside the logical frame) */}
            <Path
              name="frame-overlay"
              data={`M -50000 -50000 L 50000 -50000 L 50000 50000 L -50000 50000 Z M ${-frameWidth / 2} ${-frameHeight / 2} L ${-frameWidth / 2} ${frameHeight / 2} L ${frameWidth / 2} ${frameHeight / 2} L ${frameWidth / 2} ${-frameHeight / 2} Z`}
              fill="rgba(0,0,0,0.85)"
              fillRule="evenodd"
              listening={true} // Allow clicking on it to deselect
            />

            {/* Frame Border */}
            <Rect
              x={-frameWidth / 2}
              y={-frameHeight / 2}
              width={frameWidth}
              height={frameHeight}
              stroke="#4f46e5" // Indigo-600
              strokeWidth={2 / stageScale} // Keep border 2px regardless of zoom
              listening={false}
            />
          </Layer>
        </Stage>
      )}
    </div>
  );
}


