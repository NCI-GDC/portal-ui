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

    $stateProvider.state("search", {
      url: "/search?query",
      controller: "SearchController as sc",
      templateUrl: "search/templates/search.html"
    });

    $stateProvider.state("search.participants", {
      url: "/p?filters",
      data: {
        tab: "participants"
      }
    });

    $stateProvider.state("search.files", {
      url: "/f?filters",
      data: {
        tab: "files"
      }
    });

    $stateProvider.state("search.annotations", {
      url: "/a",
      data: {
        tab: "annotations"
      }
    });
  }

  angular
      .module("ngApp.search", [
        "search.controller",
        "ngApp.annotations",
        "ngApp.participants",
        "ngApp.files",
        "ui.router.state"
      ])
      .config(searchConfig);
}
