module ngApp.search {
  "use strict";

  import IFilesService = ngApp.files.services.IFilesService;
  import IFiles = ngApp.files.models.IFiles;
  import IParticipantsService = ngApp.participants.services.IParticipantsService;
  import IParticipants = ngApp.participants.models.IParticipants;
  import IAnnotations = ngApp.annotations.models.IAnnotations;
  import IAnnotationsService = ngApp.annotations.services.IAnnotationsService;

  /* @ngInject */
  function searchConfig($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {

    $urlRouterProvider.when("/search", "/search/p");
    $urlRouterProvider.when("/query", "/query/p");

    $stateProvider.state("search", {
      url: "/search?filters",
      controller: "SearchController as sc",
      templateUrl: "search/templates/search.html",
      reloadOnSearch: false
    });

    $stateProvider.state("search.participants", {
      url: "/p?filters",
      data: {
        tab: "participants"
      },
      reloadOnSearch: false
    });

    $stateProvider.state("search.files", {
      url: "/f?filters",
      data: {
        tab: "files"
      },
      reloadOnSearch: false
    });

    $stateProvider.state("query", {
      url: "/query?query",
      controller: "SearchController as sc",
      templateUrl: "search/templates/search.html",
      reloadOnSearch: false
    });

    $stateProvider.state("query.participants", {
      url: "/p",
      data: {
        tab: "participants",
        advancedQuery: true
      },
      reloadOnSearch: false
    });

    $stateProvider.state("query.files", {
      url: "/f",
      data: {
        tab: "files",
        advancedQuery: true
      },
      reloadOnSearch: false
    });

  }

  angular
      .module("ngApp.search", [
        "search.controller",
        "ngApp.participants",
        "ngApp.files",
        "ui.router.state"
      ])
      .config(searchConfig);
}
