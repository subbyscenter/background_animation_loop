import { useRef, useEffect } from 'react';
import { Group, Transformer, Shape } from 'react-konva';
import { Layer as LayerType, useAppStore } from '../../store/useAppStore';
import Konva from 'konva';
import { renderPattern } from './patterns';

interface Props {
  layer: LayerType;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<LayerType>) => void;
}

export default function PatternLayer({ layer, isSelected, onSelect, onChange }: Props) {
  const shapeRef = useRef<Konva.Shape>(null);
  const trRef = useRef<Konva.Transformer>(null);

  // We only subscribe to isPlaying to start/stop the animation loop
  const isPlaying = useAppStore(state => state.isPlaying);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  // Animation loop
  useEffect(() => {
    const node = shapeRef.current;
    if (!node) return;
    
    const anim = new Konva.Animation(() => {
      // Returning true forces a redraw
      return true;
    }, node.getLayer());

    if (isPlaying) {
      anim.start();
    } else {
      anim.stop();
      node.getLayer()?.batchDraw(); // Draw once when stopped to ensure it reflects current time
    }

    return () => { anim.stop(); };
  }, [isPlaying]);

  // Subscribe to currentTime changes for manual scrubbing while paused
  useEffect(() => {
    const unsub = useAppStore.subscribe((state, prevState) => {
      if (state.currentTime !== prevState.currentTime && !state.isPlaying) {
        shapeRef.current?.getLayer()?.batchDraw();
      }
    });
    return unsub;
  }, []);

  // Force redraw when layer properties change
  useEffect(() => {
    shapeRef.current?.getLayer()?.batchDraw();
  }, [layer]);

  return (
    <Group>
      <Shape
        ref={shapeRef}
        x={layer.x}
        y={layer.y}
        width={layer.width}
        height={layer.height}
        rotation={layer.rotation}
        offsetX={layer.width / 2}
        offsetY={layer.height / 2}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        sceneFunc={(context, shape) => {
          const state = useAppStore.getState();
          const currentTime = state.currentTime;
          const bpm = state.bpm;
          
          context.save();
          context.translate(shape.width() / 2, shape.height() / 2);
          
          renderPattern(layer.type, {
            context,
            shape,
            layer,
            currentTime,
            bpm
          });
          
          context.restore();
        }}
        hitFunc={(context, shape) => {
          context.beginPath();
          context.rect(0, 0, shape.width(), shape.height());
          context.closePath();
          context.fillStrokeShape(shape);
        }}
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          
          // Reset scale to 1 and apply to width/height directly
          node.scaleX(1);
          node.scaleY(1);
          
          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) return oldBox;
            return newBox;
          }}
        />
      )}
    </Group>
  );
}


