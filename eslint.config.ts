import js from '@eslint/js';
import cssModulesPlugin from 'eslint-plugin-css-modules';
import importPlugin from 'eslint-plugin-import';
import perfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

/** @type {import('eslint').Linter.Config} */
const config = [
  { ignores: ['*.config.*', 'dist', 'node_modules', 'package*.json', 'public'] },
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs['recommended-latest'],
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      perfectionist,
      react,
      'css-modules': cssModulesPlugin,
      'react-refresh': reactRefresh,
      'unused-imports': unusedImports,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'css-modules/no-undef-class': 'error',
      'import/no-unresolved': 'error',
      'import/no-unused-modules': 'error',
      'import/order': 'off',
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'alphabetical',
          order: 'asc',
          groups: [
            'value-builtin',
            'value-internal',
            ['value-parent', 'value-sibling'],
            [
              'type-import',
              'type-internal',
              'type-parent',
              'type-sibling',
              'type-index'
            ],
            'ts-equals-import',
            'side-effect-style',
            'style',
          ],
          internalPattern: [
            '^/',
            '^@components/',
            '^@contexts/',
            '^@hooks/',
            '^@pages/',
            '^@services/',
            '^@utils/',
          ],
          customGroups: {
            value: {
              'base-components': ['/*/*/[!-]*/*.*'],
              'compound-components': ['/*/*/*-*/*.*'],
            },
          },
          newlinesBetween: 'always',
        },
      ],
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'error',
    },
    settings: {
      'css-modules': {
        camelCase: 'true',
        filetypes: {
          '.css': 'postcss',
          '.module.css': 'postcss',
        },
      },
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.app.json', './tsconfig.node.json'],
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
  eslintPluginPrettierRecommended,
];

export default config;
