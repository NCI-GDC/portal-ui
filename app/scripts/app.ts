declare module ngApp {
  export interface IRootScope extends ng.IScope {
    pageTitle: string;
    loaded: boolean;
  }
}

import ICoreService = ngApp.core.services.ICoreService;
import IRootScope = ngApp.IRootScope;

/* @ngInject */
function appConfig($urlRouterProvider: ng.ui.IUrlRouterProvider,
                   $stateProvider: ng.ui.IStateProvider,
                   $locationProvider: ng.ILocationProvider,
                   RestangularProvider: restangular.IProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/404");
  RestangularProvider.setBaseUrl("http://localhost:3001/api");
}

/* @ngInject */
function appRun(gettextCatalog, Restangular: restangular.IProvider,
                $state: ng.ui.IStateService, CoreService: ICoreService,
                $rootScope: IRootScope) {
  gettextCatalog.debug = true;

  Restangular.setErrorInterceptor((response) => {
    $state.go("404", {}, { inherit: true });
  });
  Restangular.addRequestInterceptor((data) => {
    CoreService.setLoadedState(false);
    return data;
  });
  Restangular.addResponseInterceptor((data, operation, what, url, response, deferred) => {
    return deferred.resolve(data);
  });
  $rootScope.$on("$stateChangeSuccess", function() {
    CoreService.setLoadedState(true);
  });
}

angular
    .module("ngApp", [
      "ngAnimate",
      "ngAria",
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
      "ngApp.notFound",
      "templates"
    ])
    .config(appConfig)
    .run(appRun);

