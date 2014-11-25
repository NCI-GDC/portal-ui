module ngApp.search.controllers {
  import IFacet = ngApp.models.IFacet;
  import IFilesService = ngApp.files.services.IFilesService;
  import IParticipantsService = ngApp.participants.services.IParticipantsService;
  import IFiles = ngApp.files.models.IFiles;
  import IParticipants = ngApp.participants.models.IParticipants;
  import IAnnotations = ngApp.annotations.models.IAnnotations;
  import ICoreService = ngApp.core.services.ICoreService;
  import IState = ngApp.search.services.IState;
  import ICartService = ngApp.cart.services.ICartService;

  export interface ISearchController {
    files: IFiles;
    participants: IParticipants;
    State: IState;
    CartService: ICartService;
    participantAccordian: boolean;
    participantBioAccordian: boolean;
    query: string;
    searchQuery(event: any, size: number): void;
    addFilesKeyPress(event: any, type: string): void;
  }

  class SearchController implements ISearchController {
    participantAccordian: boolean = true;
    participantBioAccordian: boolean = true;
    query: string = "";

    /* @ngInject */
    constructor(private $state: ng.ui.IStateService,
                public State: IState,
                public files: IFiles,
                public participants: IParticipants,
                public CartService: ICartService,
                CoreService: ICoreService) {
      var data = $state.current.data || {};
      this.State.setActive(data.tab);
      CoreService.setPageTitle("Search");
    }

    // TODO Load data lazily based on active tab
    select(tab) {
      // Changing tabs and then navigating to another page
      // will cause this to fire.
      if (tab && this.$state.current.name.match("search.")) {
        this.$state.go("search." + tab, {}, {inherit: true});
      }
    }

    addFilesKeyPress(event: any, type: string) {
      if (event.which === 13) {
        if (type === "all") {
          // TODO add filtered list of files
          this.CartService.addFiles(this.files.hits);
        } else {
          this.CartService.addFiles(this.files.hits);
        }
      }
    }

    searchQuery(event: any, size: number): void {
      if (event.which === 1 || event.which === 13) {
        console.log("Click event or enter key pressed");
      }
    }

    // TODO Listen for Location change event - run activate
  }

  angular
      .module("search.controller", [
        "search.services",
        "cart.services"
      ])
      .controller("SearchController", SearchController);
}
