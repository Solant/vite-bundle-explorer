import tseslint from 'typescript-eslint';
import airbnb from 'eslint-stylistic-airbnb';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import { flatConfigs } from 'eslint-plugin-import-x';
import unocss from '@unocss/eslint-config/flat';

export default [
  // global ignores
  {
    ignores: [
      'bundle-report/',
      'node_modules/',
      '**/dist-ui/',
      '**/dist-plugin/',
      '**/dist/',
    ],
  },

  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  flatConfigs.recommended,
  unocss,

  airbnb.configs['flat/recommended'],
  airbnb.configs['flat/addon-typescript'],
  airbnb.configs['flat/addon-vue'],
  airbnb.configs['flat/addon-vue-ts'],
  airbnb.configs['flat/addon-iterators'],

  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      sourceType: 'module',
      parserOptions: {
        parser: tseslint.parser,
      },
      globals: {
        ...globals.browser,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    settings: {
      'import-x/internal-regex': '^@/',
    },
    rules: {
      // js
      'func-style': ['error', 'declaration'],
      '@stylistic/max-len': [
        'error',
        120,
        2,
        {
          ignoreUrls: true,
          ignoreComments: false,
          // ignore long eslint-disable comments
          ignorePattern: '^\\s*(\\/\\/|\\/\\*) eslint(-disable)?',
          ignoreRegExpLiterals: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      // imports
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            [
              'parent',
              'sibling',
              'index',
              'object',
            ],
          ],
          'newlines-between': 'always',
        },
      ],
      'import-x/named': ['off'],
      'import-x/no-unresolved': ['off'],
      'import-x/no-named-as-default': ['off'],
      // vue
      'vue/define-macros-order': [
        'error',
        {
          order: [
            'defineOptions',
            'defineProps',
            'defineEmits',
            'defineSlots',
          ],
        },
      ],
      'vue/max-attributes-per-line': ['error', { singleline: { max: 3 }, multiline: { max: 1 } }],
      'vue/multi-word-component-names': ['off'],
      'vue/max-len': [
        'error',
        {
          code: 120,
          template: 120,
          ignoreHTMLAttributeValues: true,
        },
      ],
    },
  },
  {
    files: ['bin/**/*.js', 'packages/plugin/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.{ts,mts,cts,vue}'],
    rules: {
      // TS type/value declaration merging (e.g. `const Metric` + `type Metric`)
      // trips both rules; duplicate identifiers are already a compile error
      'no-redeclare': ['off'],
      '@typescript-eslint/no-redeclare': ['off'],
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      '@stylistic/max-len': [0],
    },
  },
];
