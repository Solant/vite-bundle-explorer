import { defineConfig } from 'unocss';
import presetWind3 from '@unocss/preset-wind3';
import presetIcons from '@unocss/preset-icons';

export default defineConfig({
  presets: [
    presetWind3({ dark: 'class' }),
    presetIcons({
      collections: {
        mdi: () => import('@iconify-json/mdi/icons.json').then((i) => i.default),
        'vscode-icons': () => import('@iconify-json/vscode-icons/icons.json').then((i) => i.default),
      },
    }),
  ],
});
