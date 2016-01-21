/// <reference path="./types"/>

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

/* @ngInject */
function appConfig($urlRouterProvider: ng.ui.IUrlRouterProvider,
                   $locationProvider: ng.ILocationProvider,
                   RestangularProvider: restangular.IProvider,
                   config: IGDCConfig,
                   $compileProvider: ng.ICompileService,
                   $httpProvider: ng.IHttpProvider
                   ) {
  $compileProvider.debugInfoEnabled(!config.production);
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/projects");
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
                $modal: any) {

  if ($cookies.get("GDC-Portal-Sha") !== config.commitHash) {
    $cookies.put("GDC-Portal-Sha", config.commitHash);
    $window.localStorage.removeItem("Projects-col");
    $window.localStorage.removeItem("Annotations-col");
    $window.localStorage.removeItem("Files-col");
    $window.localStorage.removeItem("Cases-col");
    $window.localStorage.removeItem("Cart-col");
    $window.localStorage.removeItem("gdc-cart-items");
    $window.localStorage.removeItem("gdc-cart-updated");
  }
  gettextCatalog.debug = true;

  $rootScope.config = config;
  Restangular.setErrorInterceptor((response) => {
    CoreService.xhrDone();
    if (response.status === 500) {
      $modal.open({
                templateUrl: "core/templates/internal-server-error.html",
                controller: "WarningController",
                controllerAs: "wc",
                backdrop: "static",
                keyboard: false,
                backdropClass: "warning-backdrop",
                animation: false,
                size: "lg"
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

  ProjectsService.getProjects({
    size: 100
  })
  .then((data) => {
    var mapping = {};
    _.each(data.hits, (project) => {
      mapping[project.project_id] = project.name;
    });
    ProjectsService.projectIdMapping = mapping;
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
      "react",

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
      "templates",
      'react.components'
    ])
    .config(appConfig)
    .factory('RestFullResponse', function(Restangular: restangular.IService) {
      return Restangular.withConfig(function(RestangularConfigurer: restangular.IProvider) {
        RestangularConfigurer.setFullResponse(true);
      });
    })
    .run(appRun)
    .factory('AuthRestangular', function(Restangular: restangular.IService, config: IGDCConfig, CoreService: ICoreService) {
      return Restangular.withConfig(function(RestangularConfigurer: restangular.IProvider) {
          RestangularConfigurer.setBaseUrl(config.auth)})
        .addResponseInterceptor((data, operation: string, model: string, url, response, deferred) => {
        // Ajax
        CoreService.xhrDone();
        if (response.headers('content-disposition')) {
          return deferred.resolve({ 'data': data, 'headers': response.headers()});
        } else {
          return deferred.resolve(data);
        }
        ;
        });
    })

