import { PatternRenderProps } from './types';

export const renderDiagonalStripes = ({ context, shape, layer, currentTime, bpm }: PatternRenderProps) => {
  const w = shape.width();
  const h = shape.height();
  const pSize = layer.patternSize || 50;
  const colors = layer.colors && layer.colors.length > 0 ? layer.colors : ['#ffffff'];

  context.beginPath();
  context.rect(-w / 2, -h / 2, w, h);
  context.clip();

  const beat = (currentTime / (60 / bpm)) * layer.speed;
  
  context.lineWidth = pSize * 0.4;
  // Scroll effect based on beat
  const offset = (beat % 1) * pSize * 2;
  let i = 0;
  for (let x = -w * 1.5 + offset; x < w * 1.5 + offset; x += pSize) {
    context.beginPath();
    context.strokeStyle = colors[i % colors.length];
    context.moveTo(x, -h / 2);
    context.lineTo(x + h, h / 2);
    context.stroke();
    i++;
  }
};
