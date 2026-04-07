import Konva from 'konva';
import { Layer as LayerType } from '../../../store/useAppStore';

export interface PatternRenderProps {
  context: Konva.Context;
  shape: Konva.Shape;
  layer: LayerType;
  currentTime: number;
  bpm: number;
}
