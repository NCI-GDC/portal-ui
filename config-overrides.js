const { injectBabelPlugin } = require('react-app-rewired');
const rewireReactHotLoader = require('react-app-rewire-hot-loader');
const rewireSass = require('react-app-rewire-scss');

module.exports = function override(config, env) {
  config = injectBabelPlugin(
    [
      'import-inspector',
      {
        serverSideRequirePath: false,
        webpackRequireWeakId: true,
      },
    ],
    config,
  );

  config = injectBabelPlugin(
    [
      'relay',
      {
        compat: true,
        schema: 'data/schema.graphql',
      },
    ],
    config,
  );

  config = rewireSass(config, env);
  // config = rewireSass.withLoaderOptions(someLoaderOptions)(config, env);

  // PLOTLY 3D
  // config.module.rules = config.module.rules.concat({
  //   enforce: 'post',
  //   loader: ['ify-loader', 'transform-loader?plotly.js/tasks/compress_attributes.js'],
  //   test: /\.js$/,
  // });

  env === 'development' && (config.devtool = 'eval-source-map');
  config = rewireReactHotLoader(config, env);

  return config;
};
