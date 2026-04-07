import { PatternRenderProps } from './types';

export const renderBouncingColorBar = ({ context, shape, layer, currentTime, bpm }: PatternRenderProps) => {
  const w = shape.width();
  const h = shape.height();
  const pSize = layer.patternSize || 50;
  const colors = layer.colors && layer.colors.length > 0 ? layer.colors : ['#ffffff'];

  context.beginPath();
  context.rect(-w / 2, -h / 2, w, h);
  context.clip();

  const beat = (currentTime / (60 / bpm)) * layer.speed;
  const barHeight = pSize / colors.length;
  
  colors.forEach((c, idx) => {
    // Bounce effect based on beat
    const bounce = Math.abs(Math.sin(beat * Math.PI + idx * 0.5));
    const currentHeight = barHeight * (0.2 + 0.8 * bounce);
    
    context.beginPath();
    context.fillStyle = c;
    context.rect(-w / 2, -pSize / 2 + idx * barHeight + (barHeight - currentHeight) / 2, w, currentHeight);
    context.fill();
  });
};
