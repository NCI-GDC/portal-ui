module ngApp.query.controllers {
  import IFacet = ngApp.models.IFacet;
  import IFilesService = ngApp.files.services.IFilesService;
  import IParticipantsService = ngApp.participants.services.IParticipantsService;
  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;
  import IParticipants = ngApp.participants.models.IParticipants;
  import IAnnotations = ngApp.annotations.models.IAnnotations;
  import ICoreService = ngApp.core.services.ICoreService;
  import IQueryState = ngApp.query.services.IQueryState;
  import ICartService = ngApp.cart.services.ICartService;
  import ILocationService = ngApp.components.location.services.ILocationService;

  export interface IQueryController {
    files: IFiles;
    participants: IParticipants;
    QState: IQueryState;
    CartService: ICartService;
    addFilesKeyPress(event: any, type: string): void;
    setState(tab: string, next: string): void;
    select(section: string, tab: string): void;
    tabSwitch: boolean;
  }

  interface IQueryControllerScope extends ng.IScope {
  }

  class QueryController implements IQueryController {
    files : IFiles;
    participants: IParticipants;
    query: string = "";
    tabSwitch: boolean = false;
    fileSortColumns: any = [
      {
        key: "file_size",
        name: "Size"
      },
      {
        key: "file_name",
        name: "File Name"
      },
      {
        key: "file_extension",
        name: "File Type"
      },
      {
        key: "data_type",
        name: "Data Category"
      }
    ];
    participantSortColumns: any = [
      {
        key: "bcr_patient_barcode",
        name: "Participant ID"
      },
      {
        key: "gender",
        name: "Gender"
      },
      {
        key: "person_neoplasm_cancer_status",
        name: "Tumor Stage"
      }
    ];

    /* @ngInject */
    constructor(private $scope: IQueryControllerScope,
                private $state: ng.ui.IStateService,
                public QState: IQueryState,
                public CartService: ICartService,
                public FilesService: IFilesService,
                public ParticipantsService: IParticipantsService,
                private LocationService: ILocationService,
                CoreService: ICoreService) {
      var data = $state.current.data || {};
      this.QState.setActive(data.tab);
      CoreService.setPageTitle("Query");

      $scope.$on("$locationChangeSuccess", (event, next: string) => {
        if (next.indexOf("query") !== -1) {
          this.refresh();
        }
      });
      this.refresh();
    }

    refresh() {
      if (this.tabSwitch) {
        this.tabSwitch = false;
        return;
      }

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
        ]
      }).then((data) => this.files = data);
      this.ParticipantsService.getParticipants({
        fields: [
          "bcr_patient_barcode",
          "bcr_patient_uuid",
          "gender",
          "patient_id",
          "vital_status",
          "person_neoplasm_cancer_status",
          "admin.disease_code"
        ]
      }).then((data) => this.participants = data);
    }

    // TODO Load data lazily based on active tab
    setState(tab: string, next: string) {
      // Changing tabs and then navigating to another page
      // will cause this to fire.
      if (tab && (this.$state.current.name.match("query."))) {

        next += tab;
        this.tabSwitch = true;
        this.$state.go(next, this.LocationService.search(), {inherit: true});
      }
    }

    select(tab: string) {
      var next = "query.";

      this.QState.setActive(tab);

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
  }

  angular
      .module("query.controller", [
        "query.services",
        "cart.services",
        "core.services",
        "participants.services",
        "files.services",
      ])
      .controller("QueryController", QueryController);
}
