import { PatternRenderProps } from './types';

export const renderPolkaDots = ({ context, shape, layer, currentTime, bpm }: PatternRenderProps) => {
  const w = shape.width();
  const h = shape.height();
  const pSize = layer.patternSize || 50;
  const colors = layer.colors && layer.colors.length > 0 ? layer.colors : ['#ffffff'];

  const props = layer.customProps || {};
  const grouping = props.grouping || 'unified';
  const animType = props.animType || 'slide';
  const slideSpeed = props.slideSpeed ?? 50;
  const slideDirection = props.slideDirection ?? 45;
  const scale1 = props.scale1 ?? 1;
  const scale2 = props.scale2 ?? 1;

  context.beginPath();
  context.rect(-w / 2, -h / 2, w, h);
  context.clip();

  let offsetX = 0;
  let offsetY = 0;

  if (animType === 'slide') {
    const rad = (slideDirection * Math.PI) / 180;
    // Calculate total displacement based on time and speed
    const dx = Math.cos(rad) * slideSpeed * currentTime;
    const dy = Math.sin(rad) * slideSpeed * currentTime;
    
    // Modulo by pattern size to keep the drawing within a reasonable bound
    // while creating the illusion of infinite scrolling
    offsetX = dx % pSize;
    offsetY = dy % pSize;
  }

  const beat = (currentTime / (60 / bpm)) * layer.speed;

  // Draw extra dots around the edges to cover the offset shifting seamlessly
  const startX = -w / 2 - pSize * 2;
  const endX = w / 2 + pSize * 2;
  const startY = -h / 2 - pSize * 2;
  const endY = h / 2 + pSize * 2;

  let i = 0;
  for (let x = startX; x < endX; x += pSize) {
    let j = 0;
    for (let y = startY; y < endY; y += pSize) {
      const isGroup1 = grouping === 'unified' || (i + j) % 2 === 0;
      const baseScale = isGroup1 ? scale1 : scale2;
      
      // Determine color based on grouping
      let colorIdx = 0;
      if (grouping === 'unified') {
        colorIdx = (i + j) % colors.length;
      } else {
        colorIdx = isGroup1 ? 0 : (1 % colors.length);
      }
      const color = colors[colorIdx] || colors[0];

      let finalScale = baseScale;

      if (animType === 'wave') {
        const pulse = 1 + 0.3 * Math.sin(beat * Math.PI * 2 + (i + j) * 0.5);
        finalScale *= pulse;
      }

      context.beginPath();
      context.arc(x + offsetX, y + offsetY, pSize * 0.3 * finalScale, 0, Math.PI * 2);
      context.fillStyle = color;
      context.fill();
      j++;
    }
    i++;
  }
};
