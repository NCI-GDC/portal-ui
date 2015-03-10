declare module ngApp {
  export interface IGDCConfig {
    version: string;
    tag: string;
    commitLink: string;
    commitHash: string;
    api: string;
    apiVersion: string;
    apiCommitHash: string;
    apiCommitLink: string;
    apiTag: string;
    supportedAPI: string;
    apiIsMismatched: boolean;
  }

  export interface IRootScope extends ng.IScope {
    pageTitle: string;
    loaded: boolean;
    modelLoaded: boolean;
    config: IGDCConfig;
    undoClicked(action: string): void;
    cancelRequest(): void;
  }
}

import ICoreService = ngApp.core.services.ICoreService;
import IRootScope = ngApp.IRootScope;
import IGDCConfig = ngApp.IGDCConfig;
import INotifyService = ng.cgNotify.INotifyService;
import IUserService = ngApp.components.user.services.IUserService;

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
                $rootScope: IRootScope, config: IGDCConfig, notify: INotifyService,
                $cookies: ng.cookies.ICookiesService,
                UserService: IUserService) {
  gettextCatalog.debug = true;

  $rootScope.config = config;
  Restangular.setErrorInterceptor((response) => {
    CoreService.xhrDone();
    // TODO more than just 404
    //$state.go("404", {}, {inherit: true});
  });
  Restangular.addRequestInterceptor((element, operation: string, model: string) => {
    // Ajax
    //CoreService.xhrSent();
    return element;
  });
  Restangular.addResponseInterceptor((data, operation: string, model: string, url, response, deferred) => {
    // Ajax
    CoreService.xhrDone();
    return deferred.resolve(data);
  });

  Restangular.all('status').get('').then(function(data){

    config.apiVersion = data['tag'];
    config.apiCommitHash = data['commit'];
    config.apiTag = "https://github.com/NCI-GDC/gdcapi/releases/tag/" + config.apiVersion;
    config.apiCommitLink ="https://github.com/NCI-GDC/gdcapi/commit/" + config.apiCommitHash;

    if (+data.version !== +config.supportedAPI) {
      config.apiIsMismatched = true;
    }
  });

  var userToken = $cookies["X-Auth-Token"];
  if (userToken) {
    UserService.login();
  }

  $rootScope.$on("$stateChangeStart", () => {
    // Page change
    //CoreService.setLoadedState(false);
    // Close all notifcation windows
    notify.closeAll();
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
      "ngCookies",
      "ngApp.config",
      "ui.router.state",
      "ui.bootstrap",
      "restangular",
      "gettext",
      "ngTagsInput",

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

