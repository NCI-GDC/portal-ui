module ngApp.search.controllers {
  import IFacet = ngApp.models.IFacet;
  import IFilesService = ngApp.files.services.IFilesService;
  import IParticipantsService = ngApp.participants.services.IParticipantsService;
  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;
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
    setState(tab: string, next: string): void;
    select(section: string, tab: string): void;
    removeFiles(files: IFile[]): void;
  }

  export interface ISearchControllerScope extends ng.IScope {
    advancedQuery: boolean;
  }

  class SearchController implements ISearchController {
    participantAccordian: boolean = true;
    participantBioAccordian: boolean = true;
    files : IFiles;
    participants: IParticipants;
    query: string = "";

    /* @ngInject */
    constructor(private $scope: ISearchControllerScope,
                private $state: ng.ui.IStateService,
                public State: IState,
                public CartService: ICartService,
                public FilesService: IFilesService,
                public ParticipantsService: IParticipantsService,
                CoreService: ICoreService) {
      var data = $state.current.data || {};
      this.State.setActive("tabs", data.tab);
      this.State.setActive("facets", data.tab);
      $scope.advancedQuery = data.advancedQuery;
      CoreService.setPageTitle("Search");

      $scope.$on("$locationChangeSuccess", (event, next: string) => {
        if (next.indexOf("search") !== -1 || next.indexOf("query") !== -1) {
          this.refresh();
        }
      });
      $scope.$watch("advancedQuery", (newVal: boolean) => {
        if (newVal !== undefined) {
          var state: string = "search.";

          if (newVal) {
            state = "query.";
          }

          this.setState(this.$state.current.name.substring(this.$state.current.name.lastIndexOf(".") + 1), state);
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
    setState(tab: string, next: string) {
      // Changing tabs and then navigating to another page
      // will cause this to fire.
      if (tab && (this.$state.current.name.match("search.") ||
                  this.$state.current.name.match("query."))) {

        next += tab;

        this.$state.go(next, {}, {inherit: true});
      }
    }

    select(section: string, tab: string) {
      var next = "search.";

      this.State.setActive(section, tab);

      if (this.$state.current.name.match("query.")) {
        next = "query.";
      }

      this.setState(tab, next);
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

    removeFiles(files: IFile[]): void {
      this.CartService.remove(_.pluck(files, "file_uuid"));
    }
  }

  angular
      .module("search.controller", [
        "search.services",
        "cart.services"
      ])
      .controller("SearchController", SearchController);
}
