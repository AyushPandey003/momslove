module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    extends: [
      'next/core-web-vitals',
      'plugin:react/recommended',
      'plugin:jsx-a11y/recommended'
    ],
    plugins: ['react', 'jsx-a11y'],
    rules: {
      'react/no-unescaped-entities': 'error',
    }
  };
  