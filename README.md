# vite-bundle-explorer

Bundle analyzer and visualizer tool for vite.

Current features:

- Chunk size treemap
- Module import graph
- Build stats report
- Detect duplicated dependencies

![preview](https://raw.githubusercontent.com/Solant/vite-bundle-explorer/refs/heads/main/preview.gif)

## How it works

`vite-bundle-explorer` consists of two main parts:

- Vite Plugin: Gathers detailed build statistics in JSON format
- CLI Utility: Serves a web interface for visualizing the data.

## Usage

Install the package as a development dependency

```shell
npm install -D vite-bundle-explorer
# yarn add -D vite-bundle-explorer
# pnpm add -D vite-bundle-explorer
```

Next, add the `statsPlugin` to your vite config. This plugin will generate a `stats.json` file in your output directory
on successful build, containing all bundle stats.

```javascript
import { defineConfig } from 'vite';
import { statsPlugin } from 'vite-bundle-explorer/plugin';

export default defineConfig({
  plugins: [
    // ...other plugins
    statsPlugin(),
  ],
});
```

Once your build is complete and `stats.json` is generated, you can launch the web interface using the CLI utility:

```shell
npx vite-bundle-explorer ./dist/stats.json
```

## Options

You can pass options to stats plugin

```javascript
export default defineConfig({
  plugins: [
    statsPlugin({
      // ...options
    })
  ]
});
```

| Parameter              | Type      | Default                                                                                                            | Description                                                    |
|------------------------|-----------|--------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------|
| `reportCompressedSize` | `boolean` | Same as Vite's [build.reportCompressedSize](https://vite.dev/config/build-options.html#build-reportcompressedsize) | Calculate compressed size of chunks. Might affect performance. |
| `reportDirectoryName`  | `string`  | `"bundle-report"`                                                                                                  | Name of the output directory                                   |
| `emitHtml`             | `boolean` | `true`                                                                                                             | Generate interactive HTML report                               |
| `emitJson`             | `boolean` | `false`                                                                                                            | Generate `stats.json` file                                     |
