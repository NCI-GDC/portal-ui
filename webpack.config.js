const webpackConfig = require('@knit/webpack-config-socks-app');

const libs = webpackConfig.entry.libs;
libs.unshift(libs.splice(libs.indexOf('babel-polyfill'), 1)[0]);

module.exports = webpackConfig;
