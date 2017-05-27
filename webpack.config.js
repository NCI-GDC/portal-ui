function findLoader(config, callback) {
  var index = config.module.rules.findIndex(callback);
  if (index === -1) throw Error("Loader not found");
  return config.module.rules[index];
}

function turnOnBabelRc(webpackConfig) {
  var babelLoader = findLoader(webpackConfig, function(loader) {
    return (
      loader.test &&
      loader.test.toString() === /\.(js|jsx)$/.toString() &&
      !loader.enforce
    );
  });

  babelLoader.options = {};
}

module.exports = function(webpackConfig, isDevelopment) {
  turnOnBabelRc(webpackConfig);
};
