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
    modelLoaded: boolean;
    config: IGDCConfig;
    makeFilter(fields: { name: string; value: string }[]): string;
    makeDownloadLink(ids: string[]): string;
  }
}

import ICoreService = ngApp.core.services.ICoreService;
import IRootScope = ngApp.IRootScope;
import IGDCConfig = ngApp.IGDCConfig;

/* @ngInject */
function appConfig($urlRouterProvider: ng.ui.IUrlRouterProvider,
                   $locationProvider: ng.ILocationProvider,
                   RestangularProvider: restangular.IProvider,
                   config: IGDCConfig
                   ) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/projects");
  RestangularProvider.setBaseUrl(config.api);
  RestangularProvider.setDefaultHttpFields({cache: true});
}

/* @ngInject */
function appRun(gettextCatalog: any, Restangular: restangular.IProvider,
                $state: ng.ui.IStateService, CoreService: ICoreService,
                $rootScope: IRootScope, config: IGDCConfig) {
  gettextCatalog.debug = true;

  $rootScope.config = config;
  Restangular.setErrorInterceptor((response) => {
    CoreService.xhrDone();
    // TODO more than just 404
    //$state.go("404", {}, {inherit: true});
  });
  Restangular.addRequestInterceptor((element, operation: string, model: string) => {
    // Ajax
    CoreService.xhrSent(model);
    return element;
  });
  Restangular.addResponseInterceptor((data, operation: string, model: string, url, response, deferred) => {
    // Ajax
    CoreService.xhrDone(model);
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
      "cgNotify",
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
      "ngApp.query",
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

