# vite-bundle-explorer

A powerful bundle analyzer and visualizer tool for Vite and any other Rollup-compatible bundler.

Analyze your bundle size, detect duplicate dependencies, and visualize module graphs to optimize your application's performance.

## Features

- ⚡ **Multi-Bundler Support** – Works with any Rollup-compatible bundler like `vite`, `rollup`, `rolldown`, and `tsdown`.
- 📦 **Universal** – Supports both Applications and Libraries.
- 📊 **Visual Insights** – Interactive Chunk Treemap and Module Import Graph.
- 🔍 **Deep Analysis** – Detect duplicated dependencies, trace dependencies to identify exactly _why_ module is bundled.
- 🛡️ **Build Checks** – Run checks during the build process.

## Usage

Install the package as a development dependency

```shell
npm install -D vite-bundle-explorer
# yarn add -D vite-bundle-explorer
# pnpm add -D vite-bundle-explorer
```

Register the plugin (config name depends on your bundler, here is an example for `vite`).

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

Once your build is complete, you can use CLI or any static file server to see the interactive visualization.

```shell
npx vite-bundle-explorer bundle-report
```

## Configuration

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

| Option                 | Type      | Default           | Description                                                                                               |
|------------------------|-----------|-------------------|-----------------------------------------------------------------------------------------------------------|
| `enabled`              | `boolean` | `true`            | Disable stats collection and report generation. This option is disabled automatically for `vite dev` mode |
| `reportCompressedSize` | `boolean` | `true`            | Calculate compressed size of chunks. May slightly increase build time.                                    |
| `reportDirectoryName`  | `string`  | `"bundle-report"` | Name of the output directory                                                                              |
| `emitHtml`             | `boolean` | `true`            | Generate a standalone interactive HTML report                                                             |
| `emitJson`             | `boolean` | `false`           | Generate raw `stats.json` file                                                                            |
| `check`                | `boolean` | `true`            | Run report checks during the build process                                                                |
| `failOnWarning`        | `boolean` | `false`           | Cancel build if bundle has any report warnings                                                            |

## CI/CD Integration

You can use `vite-bundle-explorer` to run checks in your CI pipeline.

To fail the build when duplicate dependencies or other warnings are found, set `failOnWarning` to `true`:

```javascript
export default defineConfig({
  plugins: [
    statsPlugin({
      failOnWarning: true,
    }),
  ],
});
```
