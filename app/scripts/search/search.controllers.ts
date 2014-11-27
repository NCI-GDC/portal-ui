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
    files : IFiles;
    participants: IParticipants;
    query: string = "";

    /* @ngInject */
    constructor(private $scope,
                private $state: ng.ui.IStateService,
                public State: IState,
                public CartService: ICartService,
                public FilesService: IFilesService,
                public ParticipantsService: IParticipantsService,
                CoreService: ICoreService) {
      var data = $state.current.data || {};
      this.State.setActive(data.tab);
      CoreService.setPageTitle("Search");

      this.$scope.$on("$locationChangeSuccess", (event, next) => {
        if (next.indexOf("search") !== -1) {
          this.refresh();
        }
      });
      this.refresh();
    }

    refresh() {
      this.FilesService.getFiles({
        fields: [
          "data_access",
          "data_format",
          "data_level",
          "data_subtype",
          "data_type",
          "file_extension",
          "file_name",
          "file_size",
          "file_uuid",
          "platform",
          "updated"
        ],
        facets: [
          "data_access",
          "data_format",
          "data_level",
          "data_subtype",
          "data_type",
          "file_extension",
          "platform"
        ]
      }).then((data) => this.files = data);
      this.ParticipantsService.getParticipants({
        fields: [
          "bcr_patient_barcode",
          "bcr_patient_uuid",
          "gender",
          "patient_id",
          "vital_status",
          "person_neoplasm_cancer_status"
        ],
        facets: [
          "ethnicity",
          "gender",
          "histological_type",
          "history_of_neoadjuvant_treatment",
          "race",
          "tumor_tissue_site",
          "vital_status"
        ]
      }).then((data) => this.participants = data);
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
  }

  angular
      .module("search.controller", [
        "search.services",
        "cart.services"
      ])
      .controller("SearchController", SearchController);
}
