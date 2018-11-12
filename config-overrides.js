const { injectBabelPlugin } = require("react-app-rewired");

module.exports = function override(config, env) {
  config = injectBabelPlugin(
    [
      "import-inspector",
      {
        serverSideRequirePath: false,
        webpackRequireWeakId: true
      }
    ],
    config
  );

  config = injectBabelPlugin(
    ["relay", { compat: true, schema: "data/schema.graphql" }],
    config
  );

  return config;
};
