// config.js
angular.module("ngApp.config", [])
  .constant("config", {
    "version": "__VERSION__",
    "commitLink": "https://github.com/NCI-GDC/portal-ui/commit/__COMMIT__",
    "commitHash": "__COMMIT__",
    "api": "__API__",
    "auth":"__AUTH__",
    "auth_api": "__AUTH__/api",
    "supportedAPI": "1",
    "tag": "https://github.com/NCI-GDC/portal-ui/releases/tag/__VERSION__",
    "production": __PRODUCTION__,
    "fake_auth": __FAKE_AUTH__,
    "es_host": "__ES_HOST__",
    "es_index_version": "__ES_INDEX_VERSION__",
  });
