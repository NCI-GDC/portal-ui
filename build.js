var fs = require("fs");
var path = require("path");

process.env.NODE_ENV = "production";

require("dotenv").config({ silent: true });

var chalk = require("chalk");
var appPath = require("react-scripts/config/paths").appPath;
var webpackMonkeyPath = path.resolve(appPath, "webpack.config.js");
var webpackConfig = require("react-scripts/config/webpack.config.prod");

if (fs.existsSync(webpackMonkeyPath)) {
  console.log(chalk.yellow("WARNING! You are using modified webpack config!"));
  require(webpackMonkeyPath)(webpackConfig, true);
}
require("react-scripts/scripts/build");
