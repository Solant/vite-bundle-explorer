import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import airbnb from 'eslint-stylistic-airbnb';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import unocss from '@unocss/eslint-config/flat';

const modernAirbnb = structuredClone(airbnb);
modernAirbnb.rules['no-restricted-syntax'] = modernAirbnb.rules['no-restricted-syntax'].filter(
  (rule) => rule?.selector !== 'ForOfStatement',
);
modernAirbnb.rules['@stylistic/max-len'][1] = 120;

export default [
  {
    ignores: [
      'bundle-report/',
      'node_modules/',
      'dist-ui/',
      'dist-plugin/',
    ],
  },
  modernAirbnb,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  importPlugin.flatConfigs.recommended,
  unocss,
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    plugins: {
      '@stylistic': stylistic,
    },
    languageOptions: {
      sourceType: 'module',
      parserOptions: {
        parser: tseslint.parser,
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // js
      'func-style': ['error', 'declaration'],
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
      'import/order': [
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
      'import/named': ['off'],
      'import/no-unresolved': ['off'],
      'import/no-named-as-default': ['off'],
      // vue
      'vue/block-order': [
        'error',
        {
          order: [
            'script',
            'template',
            'style',
          ],
        },
      ],
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
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
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
    files: ['**/*.vue'],
    rules: {
      '@stylistic/max-len': [0],
    },
  },
];
