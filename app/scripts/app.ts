/// <reference path="./types.ts"/>

declare module ngApp {
  export interface IGDCConfig {
    version: string;
    tag: string;
    commitLink: string;
    commitHash: string;
    api: string;
    auth: string;
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
import IProjectsService = ngApp.projects.services.IProjectsService;
import ILocalStorageService = ngApp.core.services.ILocalStorageService;

function logVersionInfo (config) {
  console.groupCollapsed(
    "%c★ UI Git Info\n"
  + "=============",
    "color: rgb(173, 30, 30); font-weight: bold;"
  )

  console.info("%cTag: %c" + config.tag,
    "font-weight: bold;", "color: rgb(89, 139, 214);"
  )

  console.info("%cCommit Link: %c" + config.commitLink,
    "font-weight: bold;", "color: rgb(89, 139, 214);"
  )

  console.groupEnd()

  console.groupCollapsed(
    "%c★ API Git Info\n"
  + "==============",
    "color: rgb(173, 30, 30); font-weight: bold;"
  )

  console.info("%cTag: %c" + config.apiTag,
    "font-weight: bold;", "color: rgb(89, 139, 214);"
  )

  console.info("%cCommit Link: %c" + config.apiCommitLink,
    "font-weight: bold;", "color: rgb(89, 139, 214);"
  )

  console.groupEnd()
}

// Cross-Site Request Forgery (CSRF) Prevention
// https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet#General_Recommendation:_Synchronizer_Token_Pattern
function addTokenToRequest (element, operation, route, url, headers, params, httpConfig) {
  var csrftoken = document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  return {
    element: element,
    headers: _.extend(headers, { 'X-CSRFToken': csrftoken }),
    params: params,
    httpConfig: httpConfig
  };
}

/* @ngInject */
function appConfig(
  $urlRouterProvider: ng.ui.IUrlRouterProvider,
  $locationProvider: ng.ILocationProvider,
  RestangularProvider: restangular.IProvider,
  config: IGDCConfig,
  $compileProvider: ng.ICompileService,
  $httpProvider: ng.IHttpProvider
) {
  $compileProvider.debugInfoEnabled(!config.production);
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/404");
  RestangularProvider.setBaseUrl(config.api);
  RestangularProvider.setDefaultHttpFields({
    cache: true
  });

  /**
  The regex is from https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie in Example #2.
  Cookies are stored in document.cookie as "cookieName1=cookieValue; cookieName2=cookieValue"
  so the capturing group after the "csrftoken=" captures the value and places it into var csrftoken.
  Unable to use $cookies because services can't be injected in config step
  **/
  var csrftoken = document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  $httpProvider.defaults.headers.common['X-CSRFToken'] = csrftoken;

}

/* @ngInject */
function appRun(gettextCatalog: any,
                Restangular: restangular.IProvider,
                $state: ng.ui.IStateService,
                CoreService: ICoreService,
                $rootScope: IRootScope,
                config: IGDCConfig,
                notify: INotifyService,
                $cookies: ng.cookies.ICookiesService,
                UserService: IUserService,
                ProjectsService: IProjectsService,
                $window: ng.IWindowService,
                $uibModal: any,
                $uibModalStack,
                LocalStorageService: ILocalStorageService
                ) {

  if (navigator.cookieEnabled && $cookies.get("GDC-Portal-Sha") !== config.commitHash) {
    $cookies.put("GDC-Portal-Sha", config.commitHash);
    [ "Projects-col", "Annotations-col", "Files-col", "Cases-col",
      "Cart-col", "gdc-cart-items", "gdc-cart-updated", "gdc-facet-config"
    ].forEach(item => LocalStorageService.removeItem(item))
  }
  gettextCatalog.debug = true;

  $rootScope.config = config;
  Restangular.addFullRequestInterceptor(addTokenToRequest);
  Restangular.setErrorInterceptor((response) => {
    CoreService.xhrDone();
    if (response.status === 500 && !$uibModalStack.getTop()) {
      $uibModal.open({
        templateUrl: "core/templates/internal-server-error.html",
        controller: "WarningController",
        controllerAs: "wc",
        backdrop: "static",
        keyboard: false,
        backdropClass: "warning-backdrop",
        animation: false,
        size: "lg",
        resolve: {
          warning: null
        }
      });
    }
    // TODO more than just 404
    //$state.go("404", {}, {inherit: true});
  });
  Restangular.addResponseInterceptor((data, operation: string, model: string, url, response, deferred) => {
    // Ajax
    CoreService.xhrDone();
    if (response.headers('content-disposition')) {
      return deferred.resolve({ 'data': data, 'headers': response.headers()});
    } else {
      return deferred.resolve(data);
    }

  });


  Restangular.all('status').get('').then(function(data){

    config.apiVersion = data['tag'];
    config.apiCommitHash = data['commit'];
    config.apiTag = "https://github.com/NCI-GDC/gdcapi/releases/tag/" + config.apiVersion;
    config.apiCommitLink ="https://github.com/NCI-GDC/gdcapi/commit/" + config.apiCommitHash;

    logVersionInfo(config)

    if (+data.version !== +config.supportedAPI) {
      config.apiIsMismatched = true;
    }
  }, function(response) {
    notify.config({ duration: 60000 });
    notify.closeAll();
    notify({
      message: "",
      messageTemplate: "<span>Unable to connect to the GDC API. Make sure you have " +
                       "accepted the Security Certificate. <br>If not, please click " +
                       "<a target='_blank' href='"+config.api+"/status'>here</a> and accept the Security Certificate</span>",
      container: "#notification",
      classes: "alert-danger"
    });
  });

  UserService.login();

  ProjectsService.getProjects({ size: 100 })
    .then(data => {
      ProjectsService.projectIdMapping =
        data.hits.reduce((acc, project) => {
          acc[project.project_id] = project.name;
            return acc;
          }, {});
      });

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

  $rootScope.$on("$stateChangeError", () => {
    $state.go("404", {}, { location: "replace" });
  });

}

angular
    .module("ngApp", [
      "cgNotify",
      "ngProgressLite",
      "ngAnimate",
      "ngAria",
      "ngCookies",
      "ngSanitize",
      "ngApp.config",
      "ui.router.state",
      "ui.bootstrap",
      "restangular",
      "gettext",
      "ngTagsInput",
      "ui.sortable",

      "ngApp.core",
      "ngApp.search",
      "ngApp.query",
      "ngApp.participants",
      "ngApp.files",
      "ngApp.annotations",
      "ngApp.home",
      "ngApp.projects",
      "ngApp.cases",
      "ngApp.components",
      "ngApp.cart",
      "ngApp.notFound",
      "ngApp.reports",
      "templates"
    ])
    .config(appConfig)
    .factory('RestFullResponse', function(Restangular: restangular.IService) {
      return Restangular.withConfig(function(RestangularConfigurer: restangular.IProvider) {
        RestangularConfigurer.setFullResponse(true);
      })
      .addFullRequestInterceptor(addTokenToRequest);
    })
    .run(appRun)
    .factory('AuthRestangular', function(Restangular: restangular.IService, config: IGDCConfig, CoreService: ICoreService) {
      return Restangular.withConfig(function(RestangularConfigurer: restangular.IProvider) {
        RestangularConfigurer.setBaseUrl(config.auth)
      })
        .addFullRequestInterceptor(addTokenToRequest)
        .addResponseInterceptor((data, operation: string, model: string, url, response, deferred) => {
          // Ajax
          CoreService.xhrDone();
          if (response.headers('content-disposition')) {
            return deferred.resolve({ 'data': data, 'headers': response.headers() });
          } else {
            return deferred.resolve(data);
          }
        });
    });
