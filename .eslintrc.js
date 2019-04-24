module.exports = {
  env: {
    // Global variables:
    browser: true,
    node: true,
    es6: true,
    // 'jest/globals': true, // Allows 'it', 'describe' etc.
  },
  extends: [
    'eslint:recommended', // Standard eslint rules.
    'plugin:react/recommended', // React specific linting rules.
    // 'plugin:@typescript-eslint/recommended', // Allows for TypeScript-specific linting rules to run.
  ],
  globals: {
    PropTypes: false,
    React: false,
    uiVersion: false,
  },
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser to use TS.
  parserOptions: {  // provides extra rules.
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features.
    sourceType: 'module', // Allows for the use of imports.
  },
  plugins: [
    '@typescript-eslint',
    'react'
    // 'jest'
  ],
  rules: {
    'indent': ['warn', 2, {
      ArrayExpression: 'first',
      CallExpression: { arguments: 'first' },
      flatTernaryExpressions: true,
      FunctionDeclaration: { parameters: 'first' },
      FunctionExpression: { parameters: 'first' },
      ignoreComments: true,
      ignoredNodes: [ 'ConditionalExpression' ],
      ImportDeclaration: 'first',
      MemberExpression: 1,
      ObjectExpression: 'first',
      SwitchCase: 1,
    }],
    'no-var': 'error', // Must use const or let.
    'react/prop-types': 'off', // Disable prop-types as TS is used for type checking.
    '@typescript-eslint/explicit-function-return-type': 'off', // Allows functional components, should be fixed soon: https://github.com/typescript-eslint/typescript-eslint/issues/149
    '@typescript-eslint/explicit-member-accessibility': 'off', // Allows not having to set public/private on class properties.
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['./src']
      }
    },
    react: {
      version: 'detect', // Automatically picks the version you have installed.
    },
  },
}
