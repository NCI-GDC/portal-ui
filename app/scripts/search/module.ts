module ngApp.search {
  "use strict";

  import IFacet = ngApp.models.IFacet;
  import IFilesService = ngApp.files.services.IFilesService;
  import IParticipantsService = ngApp.participants.services.IParticipantsService;

  /* @ngInject */
  function searchConfig($stateProvider: ng.ui.IStateProvider,
                        $urlRouterProvider: ng.ui.IUrlRouterProvider) {

    $stateProvider.state("search", {
      url: "/search",
      abstract: true,
      controller: "SearchController as sc",
      templateUrl: "search/templates/search.html",
      resolve: {
        files: (FilesService: IFilesService) => {
          return FilesService.getFiles();
        },
        participants: (ParticipantsService: IParticipantsService) => {
          return ParticipantsService.getParticipants();
        }
      }
    });

    $stateProvider.state("search.participants", {
      url: "/p",
      data: {
        tab: "participants"
      }
    });

    $stateProvider.state("search.files", {
      url: "/f",
      data: {
        tab: "files"
      }
    });

    $urlRouterProvider.when("/search", "/search/p");
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
