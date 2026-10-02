import css from '@eslint/css';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

import baseConfig from '../eslint.config.mjs';

export default defineConfig([
  ...baseConfig,
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: ['css/recommended']
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        DOMHighResTimeStamp: 'readonly' // Explicitly define DOMHighResTimeStamp as a global
      }
    },
    rules: {
      'no-useless-assignment': 'off'
    }
  }
]);
