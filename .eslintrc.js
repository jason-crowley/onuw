module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended', // enable sensible rules which lint for well-known best-practices
    'airbnb', // enable Airbnb ESLint rules, including ECMAScript 6+ and React
    'plugin:@typescript-eslint/eslint-recommended', // disable rules from "eslint:recommended" that are covered by TypeScript's typechecker
    'plugin:@typescript-eslint/recommended', // enable recommended rules from "@typescript-eslint/eslint-plugin"
    'plugin:import/typescript',
    'prettier/@typescript-eslint', // disable ESLint rules from "@typescript-eslint/eslint-plugin" that would conflict with prettier
    'plugin:prettier/recommended', // display prettier errors as ESLint errors (make sure this is last in extends array)
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: ['!**/.eslintrc*'],
  rules: {
    quotes: ['error', 'single', { avoidEscape: true }],
    'prettier/prettier': [
      'error',
      {
        printWidth: 120,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
