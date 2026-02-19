/**
 * Aurora-фон для нижней части главной страницы.
 * Настройки — в src/config/site.config.ts → aurora.home
 */
import AuroraShader from '@/components/Aurora';
import { aurora } from '@/config/site.config';

export const Aurora = () => {
  return (
    <AuroraShader
      colorStops={aurora.home.colorStops}
      amplitude={aurora.home.amplitude}
      blend={aurora.home.blend}
      speed={aurora.home.speed}
      flipVertical={aurora.home.flipVertical}
    />
  );
};
