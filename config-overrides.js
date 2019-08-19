const { injectBabelPlugin } = require('react-app-rewired');
const rewireReactHotLoader = require('react-app-rewire-hot-loader');

module.exports = function override(config, env) {
  config = injectBabelPlugin(
    [
      'import-inspector',
      {
        serverSideRequirePath: false,
        webpackRequireWeakId: true,
      },
    ],
    config
  );

  config = injectBabelPlugin(
    [
      'relay',
      {
        compat: true,
        schema: 'data/schema.graphql',
      },
    ],
    config
  );

  env === 'development' && (config.devtool = 'eval-source-map');
  config = rewireReactHotLoader(config, env);

  return config;
};
