module.exports = {
  env: {
    // Global variables:
    browser: true,
    node: true,
    es6: true,
    // 'jest/globals': true, // Allows 'it', 'describe' etc.
  },
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:import/typescript',
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
    'react',
    'react-hooks',
    'sort-destructure-keys'
    // 'jest'
  ],
  rules: {
    'array-bracket-newline': ['error', {
      'multiline': true,
      'minItems': 3,
    }],
    'array-element-newline': ['warn', {
      'multiline': true,
      'minItems': 3,
    }],
    'arrow-body-style': 'off',
    'arrow-parens': 'off',
    'camelcase': ['warn', {
      allow: ["^UNSAFE_", "doc_count"],
    }],
    'comma-dangle': ['warn', 'always-multiline'],
    'func-names': ['warn', 'as-needed'],
    'function-paren-newline': ['warn', 'consistent'],
    'indent': ['warn', 2, {
      ArrayExpression: 'first',
      CallExpression: { arguments: 'first' },
      flatTernaryExpressions: true,
      FunctionDeclaration: { parameters: 'first' },
      FunctionExpression: { parameters: 'first' },
      ignoreComments: true,
      ignoredNodes: [
        'ConditionalExpression',
        'JSXAttribute',
        'JSXClosingElement',
        'JSXElement',
        'JSXElement > *',
        'JSXEmptyExpression',
        'JSXExpressionContainer',
        'JSXIdentifier',
        'JSXMemberExpression',
        'JSXNamespacedName',
        'JSXOpeningElement',
        'JSXSpreadAttribute',
        'JSXSpreadChild',
        'JSXText',
        'TemplateLiteral > *',
      ],
      ImportDeclaration: 'first',
      MemberExpression: 1,
      ObjectExpression: 'first',
      SwitchCase: 1,
      VariableDeclarator: 'first',
    }],
    'no-console': ['warn', {
      allow: [
        'info',
        'warn',
        'error',
      ]
    }],
    'no-debugger': 'warn',
    'no-fallthrough': ['warn', {
      commentPattern: 'break[\\s\\w]*omitted',
    }],
    'no-nested-ternary': 'off',
    'no-unused-expressions': ['warn', {
      allowShortCircuit: true,
    }],
    'no-var': 'error', // Must use const or let.
    'object-property-newline': ['warn', {
      // allowAllPropertiesOnSameLine: false,
    }],
    'object-curly-newline': 'warn', // ['warn', {
    // ObjectExpression: {
    //   'multiline': true,
    //   'minProperties': 2,
    // },
    // ObjectPattern: {
    //   'multiline': true,
    //   'minProperties': 2,
    // },
    // ImportDeclaration: {
    //   'multiline': true,
    //   'minProperties': 2,
    // },
    // ExportDeclaration: {
    //   'multiline': true,
    //   'minProperties': 2,
    // },
    // }],
    'operator-linebreak': ['warn', 'after', {
      overrides: {
        '?': 'before',
        ':': 'before',
      }
    }],
    'padded-blocks': 'error',
    'semi': ['warn', 'always'],
    'sort-keys': ['warn', 'asc', {
      caseSensitive: false,
      natural: true,
    }],
    'quotes': ['warn', 'single'],
    'import/no-extraneous-dependencies': ['warn', {
      'packageDir': './'
    }],
    'react/jsx-closing-bracket-location': ['warn', 'props-aligned'],
    'react/jsx-indent': ['warn', 2, {
      checkAttributes: true,
      // indentLogicalExpressions: true,
    }],
    'react/jsx-indent-props': ['warn', 'first'],
    'react/jsx-max-props-per-line': ['warn', {
      maximum: 1,
      when: 'multiline',
    }],
    'react/jsx-one-expression-per-line': ['warn', {
      allow: 'single-child',
    }],
    'react/jsx-sort-default-props': 'error',
    'react/jsx-sort-props': ['warn', {
      ignoreCase: true,
    }],
    'react/jsx-tag-spacing': ['warn', {
      closingSlash: 'never',
      beforeSelfClosing: 'always',
      afterOpening: 'never',
      beforeClosing: 'allow',
    }],
    'react/jsx-wrap-multilines': ['error', {
      declaration: 'parens-new-line',
      assignment: 'parens-new-line',
      return: 'parens-new-line',
      arrow: 'parens-new-line',
      condition: 'parens-new-line',
      logical: 'parens-new-line',
      prop: 'parens-new-line',
    }],
    'react/no-did-mount-set-state': 'warn',
    'react/no-did-update-set-state': 'warn',
    'react/no-direct-mutation-state': 'warn',
    'react/jsx-filename-extension': ['warn', {
      extensions: [
        '.js',
        '.jsx',
        '.tsx',
      ],
    }],
    'react/no-multi-comp': 'warn',
    'react/no-unknown-property': 'warn',
    'react/sort-comp': 'warn',
    'react/sort-prop-types': 'error',
    'react/prop-types': 'off', // Disable prop-types as TS is used for type checking.
    'sort-destructure-keys/sort-destructure-keys': ['warn', {
      caseSensitive: false,
    }],
    '@typescript-eslint/explicit-function-return-type': 'off', // Allows functional components, should be fixed soon: https://github.com/typescript-eslint/typescript-eslint/issues/149
    '@typescript-eslint/explicit-member-accessibility': 'off', // Allows not having to set public/private on class properties.
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['./src/packages']
      },
    },
    react: {
      version: 'detect', // Automatically picks the version you have installed.
    },
  },
}
