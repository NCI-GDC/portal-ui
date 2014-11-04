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
      templateUrl: "search/templates/search.html",
      resolve: {
        files: (FilesService: IFilesService): ng.IPromise<IFiles> => {
          return FilesService.getFiles();
        },
        participants: (ParticipantsService: IParticipantsService): ng.IPromise<IParticipants> => {
          return ParticipantsService.getParticipants();
        },
        annotations: (AnnotationsService: IAnnotationsService): ng.IPromise<IAnnotations> => {
          return AnnotationsService.getAnnotations();
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
