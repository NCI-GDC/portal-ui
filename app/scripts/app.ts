declare module ngApp {
  interface IRootScope extends ng.IScope {
    pageTitle: string;
    loaded: boolean;
  }
}

/* @ngInject */
function appConfig($urlRouterProvider: ng.ui.IUrlRouterProvider,
                   $stateProvider: ng.ui.IStateProvider,
                   $locationProvider: ng.ILocationProvider,
                   RestangularProvider: restangular.IProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/404");
  $stateProvider.state("404", {
    url: "/404",
    templateUrl: "core/templates/404.html"
  });
  RestangularProvider.setBaseUrl("http://localhost:3001/api");
}

/* @ngInject */
function appRun(gettextCatalog, Restangular: restangular.IService, $state: ng.ui.IStateService) {
  gettextCatalog.debug = true;

  Restangular.setErrorInterceptor((response) => {
    $state.go("404");
  });
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
