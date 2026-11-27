# Changelog

## 1.1.0

### Minor Changes

- [#28](https://github.com/Solant/vite-bundle-explorer/pull/28) [`cb6bc5b`](https://github.com/Solant/vite-bundle-explorer/commit/cb6bc5ba4f5ab050d153c9a1c7e4403054c1ecd9) Thanks [@Solant](https://github.com/Solant)! - identify built-in node modules in the module tree

- [#31](https://github.com/Solant/vite-bundle-explorer/pull/31) [`57b86dc`](https://github.com/Solant/vite-bundle-explorer/commit/57b86dce39a57c5624ad9244faea32de72433edc) Thanks [@Solant](https://github.com/Solant)! - precompute graph layout for stable rendering

- [#29](https://github.com/Solant/vite-bundle-explorer/pull/29) [`18ae39e`](https://github.com/Solant/vite-bundle-explorer/commit/18ae39e02dac2181ce5a17e5382e0f9da0d29215) Thanks [@Solant](https://github.com/Solant)! - [viewer] redesign explorer UI: compact header with segmented view toggle, unified gray/blue design system, denser option panels, restyled modals and context menu

- [#35](https://github.com/Solant/vite-bundle-explorer/pull/35) [`9fae732`](https://github.com/Solant/vite-bundle-explorer/commit/9fae7326b55b3ae53f660b89babd599015a14344) Thanks [@Solant](https://github.com/Solant)! - add support for esbuild

- [#33](https://github.com/Solant/vite-bundle-explorer/pull/33) [`f58c879`](https://github.com/Solant/vite-bundle-explorer/commit/f58c87973228c76ba57b98bda5be011a76550f3d) Thanks [@Solant](https://github.com/Solant)! - [viewer] rename size metrics and add descriptions

### Patch Changes

- [`671c8c7`](https://github.com/Solant/vite-bundle-explorer/commit/671c8c7101a3be609f17a772b7958ffe239e5f43) Thanks [@Solant](https://github.com/Solant)! - fix dependency name resolution for pnpm and absolute paths


## v1.0.0

[compare changes](https://github.com/Solant/vite-bundle-explorer/compare/v0.3.4...v1.0.0)

### 🚀 Enhancements

- Improve graph view legend usability ([#18](https://github.com/Solant/vite-bundle-explorer/pull/18))
- Show the module import path in a graph view ([#19](https://github.com/Solant/vite-bundle-explorer/pull/19))
- Implement tree-based module filter ([ee4b382](https://github.com/Solant/vite-bundle-explorer/commit/ee4b382))
- Hide dependencies by default, enhance graph view legend ([4487277](https://github.com/Solant/vite-bundle-explorer/commit/4487277))

### 🩹 Fixes

- Use a relative base path for some static file servers like Jetbrains ([918dab6](https://github.com/Solant/vite-bundle-explorer/commit/918dab6))
- Show an accurate number of modules for every view ([01d5745](https://github.com/Solant/vite-bundle-explorer/commit/01d5745))
- ⚠️  Change entrypoint detection logic ([ed8e2bf](https://github.com/Solant/vite-bundle-explorer/commit/ed8e2bf))
- Apply dark mode theme for the tooltips ([44de0e5](https://github.com/Solant/vite-bundle-explorer/commit/44de0e5))
- Remove some production build inconsistencies ([5c26271](https://github.com/Solant/vite-bundle-explorer/commit/5c26271))

### 🏡 Chore

- Replace prettier with stylistic eslint rules ([#21](https://github.com/Solant/vite-bundle-explorer/pull/21))
- Update readme file ([c5756d3](https://github.com/Solant/vite-bundle-explorer/commit/c5756d3))
- Add example link ([cdf2c56](https://github.com/Solant/vite-bundle-explorer/commit/cdf2c56))

#### ⚠️ Breaking Changes

- ⚠️  Change entrypoint detection logic ([ed8e2bf](https://github.com/Solant/vite-bundle-explorer/commit/ed8e2bf))

### ❤️ Contributors

- Solant <runner62v6@gmail.com>

## v0.3.4

[compare changes](https://github.com/Solant/vite-bundle-explorer/compare/v0.3.3...v0.3.4)

### 🩹 Fixes

- Fix compiled bundle path, prevent empty stats from being created ([5a33eab](https://github.com/Solant/vite-bundle-explorer/commit/5a33eab))

### ❤️ Contributors

- Solant <runner62v6@gmail.com>

## v0.3.3

[compare changes](https://github.com/Solant/vite-bundle-explorer/compare/v0.3.2...v0.3.3)

### 🚀 Enhancements

- Add `check` and `failOnWarning` options, run the bundle report during build ([0cad6e9](https://github.com/Solant/vite-bundle-explorer/commit/0cad6e9))

### 🩹 Fixes

- Fix build after report change ([e9bf7d7](https://github.com/Solant/vite-bundle-explorer/commit/e9bf7d7))

### 🏡 Chore

- Migrate custom build step to tsdown ([0ae099b](https://github.com/Solant/vite-bundle-explorer/commit/0ae099b))
- Update vite version ([a48ce34](https://github.com/Solant/vite-bundle-explorer/commit/a48ce34))

### ❤️ Contributors

- Solant <runner62v6@gmail.com>

## v0.3.2

[compare changes](https://github.com/Solant/vite-bundle-explorer/compare/v0.3.1...v0.3.2)

### 🩹 Fixes

- Prevent error when closeBundle is executed twice, update documentation ([d808f7d](https://github.com/Solant/vite-bundle-explorer/commit/d808f7d))

### ❤️ Contributors

- Solant <runner62v6@gmail.com>

## v0.3.1

[compare changes](https://github.com/Solant/vite-bundle-explorer/compare/v0.3.0...v0.3.1)

### 🚀 Enhancements

- Add support for libs and rollup/rolldown bundlers ([8436d72](https://github.com/Solant/vite-bundle-explorer/commit/8436d72))

### ❤️ Contributors

- Solant <runner62v6@gmail.com>

## v0.3.0

[compare changes](https://github.com/Solant/vite-bundle-explorer/compare/v0.2.2...v0.3.0)

### 🚀 Enhancements

- Improve treemap colors ([#7](https://github.com/Solant/vite-bundle-explorer/pull/7))
- ⚠️  Generate static html report ([#16](https://github.com/Solant/vite-bundle-explorer/pull/16))

### 🩹 Fixes

- Improve design for smaller screens ([#15](https://github.com/Solant/vite-bundle-explorer/pull/15))

#### ⚠️ Breaking Changes

- ⚠️  Generate static html report ([#16](https://github.com/Solant/vite-bundle-explorer/pull/16))

### ❤️ Contributors

- Solant <runner62v6@gmail.com>

## v0.2.2

[compare changes](https://github.com/Solant/vite-bundle-explorer/compare/v0.2.1...v0.2.2)

### 🩹 Fixes

- Add a missing dts file ([fcc9e44](https://github.com/Solant/vite-bundle-explorer/commit/fcc9e44))

### ❤️ Contributors

- Solant <runner62v6@gmail.com>

## v0.2.1

[compare changes](https://github.com/Solant/vite-bundle-explorer/compare/v0.2.0...v0.2.1)

### 🩹 Fixes

- Add types for stats plugin ([225e3b6](https://github.com/Solant/vite-bundle-explorer/commit/225e3b6))
- Remove warning icon if there are no duplicated dependencies ([7c21e94](https://github.com/Solant/vite-bundle-explorer/commit/7c21e94))

### 📖 Documentation

- Fix README.md instructions ([d9d1fc5](https://github.com/Solant/vite-bundle-explorer/commit/d9d1fc5))

### ❤️ Contributors

- Solant <runner62v6@gmail.com>

## v0.2.0

[compare changes](https://github.com/Solant/vite-bundle-explorer/compare/v0.1.1...v0.2.0)

### 🚀 Enhancements

- Prevent chart rerender on changed options, allow dynamic option changing ([5ff0207](https://github.com/Solant/vite-bundle-explorer/commit/5ff0207))
- Add custom color mapping for the graph view ([1661443](https://github.com/Solant/vite-bundle-explorer/commit/1661443))
- Format module size, add styling for empty modules ([c9f451d](https://github.com/Solant/vite-bundle-explorer/commit/c9f451d))
- Add edge arrows, add root module style ([bbe9e41](https://github.com/Solant/vite-bundle-explorer/commit/bbe9e41))
- Add option to trim graph ([#1](https://github.com/Solant/vite-bundle-explorer/pull/1))
- ⚠️  Add right-click actions ([fa4ccb4](https://github.com/Solant/vite-bundle-explorer/commit/fa4ccb4))
- Add overview info dialog ([#3](https://github.com/Solant/vite-bundle-explorer/pull/3))
- Design improvements ([#4](https://github.com/Solant/vite-bundle-explorer/pull/4))
- ⚠️  Add metric selector ([#5](https://github.com/Solant/vite-bundle-explorer/pull/5))
- Reuse module filter ([6a933a3](https://github.com/Solant/vite-bundle-explorer/commit/6a933a3))
- Change accent color ([e54cf24](https://github.com/Solant/vite-bundle-explorer/commit/e54cf24))

### 🔥 Performance

- Optimize chart option updates ([84bf44e](https://github.com/Solant/vite-bundle-explorer/commit/84bf44e))

### 🩹 Fixes

- Improve dependency handling for pnpm projects ([735a52e](https://github.com/Solant/vite-bundle-explorer/commit/735a52e))
- Remove duplicate edges ([7ff578d](https://github.com/Solant/vite-bundle-explorer/commit/7ff578d))
- Unify dependency name resolution between npm and pnpm ([faa7939](https://github.com/Solant/vite-bundle-explorer/commit/faa7939))
- Truncate an importer list in the tooltip for better readability ([61f571a](https://github.com/Solant/vite-bundle-explorer/commit/61f571a))

### 💅 Refactors

- Move stats functions from index.ts ([a672e17](https://github.com/Solant/vite-bundle-explorer/commit/a672e17))
- Centralize color definitions in shared config ([a87af35](https://github.com/Solant/vite-bundle-explorer/commit/a87af35))

### 📖 Documentation

- Update readme, description and preview ([#6](https://github.com/Solant/vite-bundle-explorer/pull/6))

### 🏡 Chore

- Fix build and formatting ([718cdf0](https://github.com/Solant/vite-bundle-explorer/commit/718cdf0))

#### ⚠️ Breaking Changes

- ⚠️  Add right-click actions ([fa4ccb4](https://github.com/Solant/vite-bundle-explorer/commit/fa4ccb4))
- ⚠️  Add metric selector ([#5](https://github.com/Solant/vite-bundle-explorer/pull/5))

### ❤️ Contributors

- Solant <runner62v6@gmail.com>

## v0.1.1


### 🚀 Enhancements

- Add base button styles ([e2adaa3](https://github.com/Solant/vite-bundle-explorer/commit/e2adaa3))
- Add switch ([cc7cfda](https://github.com/Solant/vite-bundle-explorer/commit/cc7cfda))
- Add view toggle ([080f842](https://github.com/Solant/vite-bundle-explorer/commit/080f842))
- Add imported by tooltip ([fa7191a](https://github.com/Solant/vite-bundle-explorer/commit/fa7191a))
- Disable stats plugin in dev mode ([a48d2ef](https://github.com/Solant/vite-bundle-explorer/commit/a48d2ef))
- Add graph view ([3be9d3a](https://github.com/Solant/vite-bundle-explorer/commit/3be9d3a))
- Group dependency modules by library ([1f02bc6](https://github.com/Solant/vite-bundle-explorer/commit/1f02bc6))

### 🩹 Fixes

- Fix compact style view ([06067e0](https://github.com/Solant/vite-bundle-explorer/commit/06067e0))
- Ui styles ([407fc8d](https://github.com/Solant/vite-bundle-explorer/commit/407fc8d))
- Cherry-pick echarts modules ([d8c20bf](https://github.com/Solant/vite-bundle-explorer/commit/d8c20bf))

### 💅 Refactors

- Move charts initialization ([c8928ca](https://github.com/Solant/vite-bundle-explorer/commit/c8928ca))
- Preparation for additional views ([19cb9d3](https://github.com/Solant/vite-bundle-explorer/commit/19cb9d3))
- Migrate and organize BuildStats entities, enhance stats generation and usage ([d5e16e9](https://github.com/Solant/vite-bundle-explorer/commit/d5e16e9))
- Modularize view options, remove ModuleFilter, and enhance graph configuration ([ea09121](https://github.com/Solant/vite-bundle-explorer/commit/ea09121))

### 🏡 Chore

- Cleanup before release ([f2e139f](https://github.com/Solant/vite-bundle-explorer/commit/f2e139f))
- Add keywords ([a92f070](https://github.com/Solant/vite-bundle-explorer/commit/a92f070))
- Add example.gif ([e2415f4](https://github.com/Solant/vite-bundle-explorer/commit/e2415f4))
- Add preview ([f514345](https://github.com/Solant/vite-bundle-explorer/commit/f514345))
- Update .gitignore ([e8cbb99](https://github.com/Solant/vite-bundle-explorer/commit/e8cbb99))
- Add changelogen ([ac0e85b](https://github.com/Solant/vite-bundle-explorer/commit/ac0e85b))

### ❤️ Contributors

- Solant <runner62v6@gmail.com>

