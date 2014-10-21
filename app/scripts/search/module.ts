module ngApp.search {
  "use strict";

  import IFacet = ngApp.models.IFacet;
  import IFilesService = ngApp.files.services.IFilesService;
  import IParticipantsService = ngApp.participants.services.IParticipantsService;

  /* @ngInject */
  function searchConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("search", {
      url: "/search",
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
