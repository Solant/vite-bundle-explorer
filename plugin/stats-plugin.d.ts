import { type Plugin } from 'vite';

interface StatsPluginOptions {
  reportDirectoryName?: string;
  reportCompressedSize?: boolean;
  emitHtml?: boolean;
  emitJson?: boolean;
}

declare function statsPlugin(options?: StatsPluginOptions): Plugin;

export { statsPlugin };
