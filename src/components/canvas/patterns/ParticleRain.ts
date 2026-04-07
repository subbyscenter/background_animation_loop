import { PatternRenderProps } from './types';
import Konva from 'konva';
import { useAppStore } from '../../../store/useAppStore';

const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// --- 8bit 픽셀 아트를 위한 공통 헬퍼 함수 ---
const drawPixelArt = (ctx: Konva.Context, x: number, y: number, r: number, grid: number[][]) => {
  const rows = grid.length;
  const cols = grid[0].length;
  // r을 기준으로 픽셀 크기 계산
  const pixelWidth = (r * 2.5) / cols;
  const pixelHeight = (r * 2.5) / rows;

  ctx.save();
  // 중심(x, y)이 그림의 중앙이 되도록 이동
  ctx.translate(x - (cols * pixelWidth) / 2, y - (rows * pixelHeight) / 2);
  ctx.beginPath();
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] === 1) {
        ctx.rect(col * pixelWidth, row * pixelHeight, pixelWidth, pixelHeight);
      }
    }
  }
  
  ctx.fill();
  ctx.restore();
};

// --- 기존 파티클 도형들 ---
const drawStar = (ctx: Konva.Context, x: number, y: number, r: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * r, -Math.sin((18 + i * 72) / 180 * Math.PI) * r);
    ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * (r * 0.5), -Math.sin((54 + i * 72) / 180 * Math.PI) * (r * 0.5));
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

const drawSnowflake = (ctx: Konva.Context, x: number, y: number, r: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -r);
    ctx.moveTo(0, -r * 0.5);
    ctx.lineTo(r * 0.2, -r * 0.7);
    ctx.moveTo(0, -r * 0.5);
    ctx.lineTo(-r * 0.2, -r * 0.7);
    ctx.rotate(Math.PI / 3);
  }
  ctx.stroke();
  ctx.restore();
};

const drawDiamond = (ctx: Konva.Context, x: number, y: number, r: number) => {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.lineTo(x + r * 0.6, y);
  ctx.lineTo(x, y + r);
  ctx.lineTo(x - r * 0.6, y);
  ctx.closePath();
  ctx.fill();
};

const drawTriangle = (ctx: Konva.Context, x: number, y: number, r: number) => {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.lineTo(x + r * 0.866, y + r * 0.5);
  ctx.lineTo(x - r * 0.866, y + r * 0.5);
  ctx.closePath();
  ctx.fill();
};

const drawCircle = (ctx: Konva.Context, x: number, y: number, r: number) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
};

// --- 추가된 일반 파티클 도형들 ---
const drawHexagon = (ctx: Konva.Context, x: number, y: number, r: number) => {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const px = x + r * Math.cos(angle);
    const py = y + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
};

const drawHeart = (ctx: Konva.Context, x: number, y: number, r: number) => {
  ctx.save();
  ctx.translate(x, y - r * 0.2); // 중앙 정렬을 위해 살짝 위로 조정
  ctx.beginPath();
  ctx.moveTo(0, r * 0.3);
  ctx.bezierCurveTo(-r, -r * 0.5, -r * 1.5, r * 0.3, 0, r * 1.2);
  ctx.bezierCurveTo(r * 1.5, r * 0.3, r, -r * 0.5, 0, r * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

const drawCross = (ctx: Konva.Context, x: number, y: number, r: number) => {
  const w = r * 0.4;
  ctx.beginPath();
  ctx.rect(x - w / 2, y - r, w, r * 2);
  ctx.rect(x - r, y - w / 2, r * 2, w);
  ctx.fill();
};

// --- 8bit (레트로) 파티클 도형들 ---
const drawPixel = (ctx: Konva.Context, x: number, y: number, r: number) => {
  ctx.beginPath();
  ctx.rect(x - r, y - r, r * 2, r * 2);
  ctx.fill();
};

const draw8BitHeart = (ctx: Konva.Context, x: number, y: number, r: number) => {
  const grid = [
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ];
  drawPixelArt(ctx, x, y, r, grid);
};

const draw8BitStar = (ctx: Konva.Context, x: number, y: number, r: number) => {
  const grid = [
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1]
  ];
  drawPixelArt(ctx, x, y, r, grid);
};

const draw8BitInvader = (ctx: Konva.Context, x: number, y: number, r: number) => {
  const grid = [
    [0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1],
    [0, 0, 0, 1, 1, 1, 0, 0, 0]
  ];
  drawPixelArt(ctx, x, y, r, grid);
};

// --- 이미지 캐시 ---
const imageCache: Record<string, HTMLImageElement> = {};

const getCachedImage = (url: string) => {
  if (!imageCache[url]) {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      // Force a redraw when the image loads
      useAppStore.getState().setCurrentTime(useAppStore.getState().currentTime);
    };
    imageCache[url] = img;
  }
  return imageCache[url];
};

// --- 메인 렌더링 함수 ---
export const renderParticleRain = ({ context, shape, layer, currentTime, bpm }: PatternRenderProps) => {
  const w = shape.width();
  const h = shape.height();
  const props = layer.customProps || {};
  const layerCount = props.layerCount || 3;
  const particleLayers = (props.particleLayers || []).slice(0, layerCount);
  
  const customParticles = useAppStore.getState().customParticles;

  context.beginPath();
  context.rect(-w / 2, -h / 2, w, h);
  context.clip();

  const beat = (currentTime / (60 / bpm)) * layer.speed;
  const pulsePhase = Math.sin(beat * Math.PI * 2);

  particleLayers.forEach((pLayer: any, layerIdx: number) => {
    const count = pLayer.count || 50;
    const speed = pLayer.speed || 50;
    const minSize = pLayer.minSize || 2;
    const maxSize = pLayer.maxSize || 10;
    const shapeType = pLayer.shapeType || 'Circle';
    const sync = pLayer.bpmSync || 'none';
    const direction = pLayer.direction ?? 90; // Default falling down
    const pulseSize = pLayer.pulseSize ?? 1.5;
    const pulseOpacity = pLayer.pulseOpacity ?? 0.5;
    
    const baseOpacity = pLayer.opacity ?? 1;
    let currentOpacity = baseOpacity;
    
    if (sync === 'pulse') {
      const opacityMult = 1 + ((pulseOpacity - 1) * (pulsePhase + 1) / 2);
      currentOpacity = Math.max(0, Math.min(1, baseOpacity * opacityMult));
    }
    
    context.globalAlpha = currentOpacity;
    context.fillStyle = pLayer.color || '#ffffff';
    context.strokeStyle = pLayer.color || '#ffffff';
    context.lineWidth = 2;

    const rad = (direction * Math.PI) / 180;
    const cosDir = Math.cos(rad);
    const sinDir = Math.sin(rad);

    for (let i = 0; i < count; i++) {
      const seed = layerIdx * 1000 + i;
      const startX = (pseudoRandom(seed) - 0.5) * w;
      const startY = (pseudoRandom(seed + 1) - 0.5) * h;
      const sizeMult = pseudoRandom(seed + 2);
      const speedMult = 0.5 + pseudoRandom(seed + 3);

      let baseR = minSize + sizeMult * (maxSize - minSize);
      if (sync === 'pulse') {
        const sizeMultiplier = 1 + ((pulseSize - 1) * (pulsePhase + 1) / 2);
        baseR *= sizeMultiplier;
      }

      const currentSpeed = speed * speedMult;
      const totalDist = currentSpeed * currentTime;
      
      let x = startX + cosDir * totalDist;
      let y = startY + sinDir * totalDist;
      
      x = ((x + w / 2) % w) - w / 2;
      if (x < -w / 2) x += w;
      
      y = ((y + h / 2) % h) - h / 2;
      if (y < -h / 2) y += h;

      switch (shapeType) {
        // 기존 도형
        case 'Star': drawStar(context, x, y, baseR); break;
        case 'Snowflake': drawSnowflake(context, x, y, baseR); break;
        case 'Diamond': drawDiamond(context, x, y, baseR); break;
        case 'Triangle': drawTriangle(context, x, y, baseR); break;
        
        // 추가된 일반 도형
        case 'Hexagon': drawHexagon(context, x, y, baseR); break;
        case 'Heart': drawHeart(context, x, y, baseR); break;
        case 'Cross': drawCross(context, x, y, baseR); break;
        
        // 8bit 레트로 도형
        case 'Pixel': drawPixel(context, x, y, baseR); break;
        case '8bitHeart': draw8BitHeart(context, x, y, baseR); break;
        case '8bitStar': draw8BitStar(context, x, y, baseR); break;
        case '8bitInvader': draw8BitInvader(context, x, y, baseR); break;

        // 커스텀 이미지
        case 'CustomImage': {
          if (pLayer.customImageId) {
            const particle = customParticles.find((p: any) => p.id === pLayer.customImageId);
            if (particle) {
              const img = getCachedImage(particle.url);
              if (img.complete && img.naturalWidth > 0) {
                context.drawImage(img, x - baseR, y - baseR, baseR * 2, baseR * 2);
              }
            }
          }
          break;
        }

        case 'Circle':
        default: drawCircle(context, x, y, baseR); break;
      }
    }
  });
  
  context.globalAlpha = 1.0;
};