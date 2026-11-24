import { resolve } from 'node:path';

export default {
  mode: 'production',
  target: 'node',
  entry: './src/index.js',
  output: {
    path: resolve('dist-webpack'),
    filename: 'index.cjs',
    library: { type: 'commonjs2' },
  },
  optimization: {
    minimize: false,
  },
};
