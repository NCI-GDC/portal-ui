const { injectBabelPlugin } = require('react-app-rewired');
const rewireDefinePlugin = require('react-app-rewire-define-plugin');
const rewireProvidePlugin = require('react-app-rewire-provide-plugin');
const rewireReactHotLoader = require('react-app-rewire-hot-loader');
const rewireSass = require('react-app-rewire-scss');
const WebpackNotifierPlugin = require('webpack-notifier');

const { version } = require('./package.json');

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

  config = rewireDefinePlugin(config, env, {
    __VERSION__: JSON.stringify(version),
  });

  config = rewireProvidePlugin(config, env, {
    React: 'react',
  });

  config.plugins = config.plugins.concat(
    new WebpackNotifierPlugin(),
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

  if (env === 'production' && config.output && config.output.publicPath) {
    config.output.publicPath = process.env.GDC_BASE;
  }

  return config;
};
