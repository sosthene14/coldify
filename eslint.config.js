import i18next from 'eslint-plugin-i18next';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      i18next,
    },
    rules: {
      'i18next/no-literal-string': 'warn',
    },
  },
];