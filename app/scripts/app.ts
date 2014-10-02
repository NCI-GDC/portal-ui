/// <reference path="types/types.ts"/>

declare module ngApp {
  interface IRootScope extends ng.IScope {
    pageTitle: string;
  }
}

/* @ngInject */
function appConfig($urlRouterProvider: ng.ui.IUrlRouterProvider,
                   $locationProvider: ng.ILocationProvider,
                   RestangularProvider: restangular.IProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/");
  RestangularProvider.setBaseUrl("https://dcc.icgc.org/api/v1");
}

angular
    .module("ngApp", [
      "ui.router.state",
      "ui.bootstrap",
      "restangular",

      "ngApp.home",
      "ngApp.widgets",
      "ngApp.components",
      "templates"
    ])
    .config(appConfig);
