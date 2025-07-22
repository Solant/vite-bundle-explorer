# vite-bundle-explorer

A utility to help debug and optimize bundle sizes. It gathers Vite bundle statistics,
including module sizes and import graphs, and visualizes them for an efficient debugging experience.

We're always open to suggestions for improving the visualization, so feel free to share your ideas via GitHub issues!

## How it works

`vite-bundle-explorer` comprises two main components:

- Vite Plugin: Gathers detailed build statistics.
- CLI Utility: Serves a user-friendly web interface for visualizing the data.

## Usage

Install the package as a development dependency using your preferred package manager:

```shell
npm install -D vite-bundle-explorer
```

Next, add the `statsPlugin` to your vite config. This plugin will generate a `stats.json` file in your output directory
after a successful build, containing all the necessary bundle statistics.

```javascript
import { defineConfig } from 'vite';
import { statsPlugin } from 'vite-bundle-analyzer/plugin';

export default defineConfig({
  plugins: [
    // ...other plugins
    statsPlugin(),
  ],
});
```

Once your build is complete and `stats.json` is generated, you can launch the web interface using the CLI utility:

```shell
npx vite-bundle-analyzer ./dist/stats.json
```

This command will open a local server in your browser, providing a comprehensive visualization of your bundle.

## Frequently Asked Questions

### Q: Why do bundle and module sizes appear larger than their actual production values?

A: The module sizes reported by the plugin represent their state _before_ minification and gzip compression.

---
