/* @flow */

const merge = require('webpack-merge');
const webpackConfig = require('@knit/webpack-dev-server-config');

const host = process.env.HOST || 'http://localhost';
const port = process.env.PORT || 5000;

const config = merge(
  webpackConfig,
  {
    devServer: {
      proxy: {
        '/api': {
          target: `${host}:${port}`,
          pathRewrite: { '^/api': '' },
        },
      },
    },
  }
);

module.exports = config;
