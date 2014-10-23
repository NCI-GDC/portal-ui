module ngApp.search.controllers {
  import IFacet = ngApp.models.IFacet;
  import IFilesService = ngApp.files.services.IFilesService;
  import IParticipantsService = ngApp.participants.services.IParticipantsService;
  import IFiles = ngApp.files.models.IFiles;
  import IParticipants = ngApp.participants.models.IParticipants;
  import ICoreService = ngApp.core.services.ICoreService;
  import IState = ngApp.search.services.IState;

  export interface ISearchController {
    files: IFiles;
    participants: IParticipants;
    State: IState;
  }

  class SearchController implements ISearchController {

    /* @ngInject */
    constructor(private $state: ng.ui.IStateService,
                public State: IState,
                public files: IFiles,
                public participants: IParticipants,
                CoreService: ICoreService) {
      var data = $state.current.data || {};
      this.State.setActive(data.tab);
      CoreService.setPageTitle("Search");
    }

    // TODO Load data lazily based on active tab
    activate(tab) {
      if (tab) {
        this.State.setActive(tab);
        this.$state.transitionTo("search." + tab, {}, { inherit: true });
      }
    }

    // TODO Listen for Location change event - run activate
  }

  angular
      .module("search.controller", ["search.services"])
      .controller("SearchController", SearchController);
}
