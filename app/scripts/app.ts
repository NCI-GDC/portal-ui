declare module ngApp {
  export interface IGDCConfig {
    version: string;
    tag: string;
    commitLink: string;
    commitHash: string;
    api: string;
  }

  export interface IRootScope extends ng.IScope {
    pageTitle: string;
    loaded: boolean;
    config: IGDCConfig;
    makeFilter(fields: { name: string; value: string }[]): string;
  }
}

import ICoreService = ngApp.core.services.ICoreService;
import IRootScope = ngApp.IRootScope;
import IGDCConfig = ngApp.IGDCConfig;

/* @ngInject */
function appConfig($urlRouterProvider: ng.ui.IUrlRouterProvider,
                   $stateProvider: ng.ui.IStateProvider,
                   $locationProvider: ng.ILocationProvider,
                   RestangularProvider: restangular.IProvider,
                   config: IGDCConfig) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/404");
  RestangularProvider.setBaseUrl(config.api);
  RestangularProvider.setDefaultHttpFields({cache: false});
}

/* @ngInject */
function appRun(gettextCatalog, Restangular: restangular.IProvider,
                $state: ng.ui.IStateService, CoreService: ICoreService,
                $rootScope: IRootScope, config: IGDCConfig) {
  gettextCatalog.debug = true;

  $rootScope.config = config;
  Restangular.setErrorInterceptor((response) => {
    CoreService.xhrDone();
    // TODO more than just 404
    //$state.go("404", {}, {inherit: true});
  });
  Restangular.addRequestInterceptor((element) => {
    // Ajax
    CoreService.xhrSent();
    return element;
  });
  Restangular.addResponseInterceptor((data, operation, what, url, response, deferred) => {
    // Ajax
    CoreService.xhrDone();
    return deferred.resolve(data);
  });

  $rootScope.$on("$stateChangeStart", () => {
    // Page change
    CoreService.setLoadedState(false);
  });

  $rootScope.$on("$stateChangeSuccess", () => {
    // Page change
    CoreService.setLoadedState(true);
  });
}

angular
    .module("ngApp", [
      "ngProgressLite",
      "ngAnimate",
      "ngAria",
      "ngApp.config",
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
      "ngApp.reports",
      "templates"
    ])
    .config(appConfig)
    .run(appRun);
