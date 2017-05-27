/* @flow */

const merge = require("webpack-merge");
const webpackConfig = require("@knit/webpack-dev-server-config");

const host = process.env.HOST || "http://localhost";
const port = process.env.PORT || 5000;

const config = merge(webpackConfig, {
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: ["node_modules", "src/packages"]
  },
  devServer: {
    proxy: {
      "/api": {
        target: `${host}:${port}`,
        pathRewrite: { "^/api": "" }
      }
    }
  }
});

module.exports = config;
