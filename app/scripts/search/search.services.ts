module ngApp.search.services {
  import IParticipants = ngApp.participants.models.IParticipants;
  import IFiles = ngApp.files.models.IFiles;
  import IParticipantsService = ngApp.participants.services.IParticipantsService;
  import IFilesService = ngApp.files.services.IFilesService;

  export interface ISearchService {
    getParticipants(params?: Object): ng.IPromise<IParticipants>;
    getFiles(params?: Object): ng.IPromise<IFiles>;
  }

  class SearchService implements ISearchService {
    /* @ngInject */
    constructor(private ParticipantsService: IParticipantsService, private FilesService: IFilesService) {}

    getFiles(params: Object = {}): ng.IPromise<IFiles> {
      return this.FilesService.getFiles(params);
    }

    getParticipants(params: Object = {}): ng.IPromise<IParticipants> {
      return this.ParticipantsService.getParticipants(params);
    }
  }

  angular
      .module("search.services", ["restangular"])
      .service("SearchService", SearchService);
}
