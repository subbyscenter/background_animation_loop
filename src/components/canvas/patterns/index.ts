import { renderPolkaDots } from './PolkaDots';
import { renderDiagonalStripes } from './DiagonalStripes';
import { renderBouncingColorBar } from './BouncingColorBar';
import { renderParticleRain } from './ParticleRain';
import { PatternRenderProps } from './types';
import { LayerType } from '../../../store/useAppStore';

export const renderPattern = (type: LayerType, props: PatternRenderProps) => {
  switch (type) {
    case 'PolkaDots':
      return renderPolkaDots(props);
    case 'DiagonalStripes':
      return renderDiagonalStripes(props);
    case 'BouncingColorBar':
      return renderBouncingColorBar(props);
    case 'ParticleRain':
      return renderParticleRain(props);
    default:
      return null;
  }
};
