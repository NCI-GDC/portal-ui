module.exports = {
  extends: ['react-app', 'prettier', 'prettier/flowtype'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [1, { trailingComma: 'all', singleQuote: true }],
  },
};
