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
  RestangularProvider.setBaseUrl("http://localhost:3001/api");
}

angular
    .module("ngApp", [
      "ui.router.state",
      "ui.bootstrap",
      "restangular",

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
    .config(appConfig);
