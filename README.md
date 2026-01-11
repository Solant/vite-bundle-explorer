# vite-bundle-explorer

A powerful bundle analyzer and visualizer tool for Vite and any other Rollup-compatible bundler.

Analyze your bundle size, detect duplicate dependencies, and visualize module graphs to optimize your application's performance.

[Example report](https://solant.me/demo/vite-bundle-explorer)

## Why Choose `vite-bundle-explorer`?

While other bundle analysis tools exist for the Vite ecosystem, this package offers a deeper level of insight and broader set of features:

- 📦 **Multi-Bundler Support**: works with any Rollup-compatible bundler like `vite`, `rollup`, `rolldown`, and `tsdown`.
- 🛠️ **Universal**: supports both applications and libraries.
- 📊 **Advanced Visualisations:** both an interactive Treemap and a powerful Import Graph.
- 🔗 **Deep Dependency Tracing:** use "Trace Import" to backtrack the full chain of imports responsible for pulling in any given module.
- 📏 **Accurate Metrics:** correct chunk size reporting, avoiding known issues in alternative tools.
- 🛡️ **Build Checks**: run checks during the build process.

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
