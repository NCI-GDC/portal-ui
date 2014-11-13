declare module ngApp {
  interface IRootScope extends ng.IScope {
    pageTitle: string;
    loaded: boolean;
  }
}

/* @ngInject */
function appConfig($urlRouterProvider: ng.ui.IUrlRouterProvider,
                   $locationProvider: ng.ILocationProvider,
                   RestangularProvider: restangular.IProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/");
  RestangularProvider.setBaseUrl("http://localhost:3001/api");
}

/* @ngInject */
function appRun(gettextCatalog) {
  gettextCatalog.debug = true;
}

angular
    .module("ngApp", [
      "ngAnimate",
      "ui.router.state",
      "ui.bootstrap",
      "restangular",
      "gettext",

      "ngApp.core",
      "ngApp.search",
      "ngApp.home",
      "ngApp.participants",
      "ngApp.files",
      "ngApp.annotations",
      "ngApp.projects",
      "ngApp.components",
      "ngApp.cart",
      "templates"
    ])
    .config(appConfig)
    .run(appRun);
