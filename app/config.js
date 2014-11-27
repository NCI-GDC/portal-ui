// config.js
angular.module("ngApp.config", [])
  .constant("config", {
    "version": "__VERSION__",
    "commitLink": "https://github.com/NCI-GDC/portal-ui/commit/__COMMIT__",
    "commitHash": "__COMMIT__",
    "tag":"https://github.com/NCI-GDC/portal-ui/releases/tag/__VERSION__"
  });