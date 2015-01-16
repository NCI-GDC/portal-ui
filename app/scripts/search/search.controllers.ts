module ngApp.search.controllers {
  import IFacet = ngApp.models.IFacet;
  import IFilesService = ngApp.files.services.IFilesService;
  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;
  import IParticipantsService = ngApp.participants.services.IParticipantsService;
  import IParticipants = ngApp.participants.models.IParticipants;
  import IParticipant = ngApp.participants.models.IParticipant;
  import IAnnotations = ngApp.annotations.models.IAnnotations;
  import ICoreService = ngApp.core.services.ICoreService;
  import IState = ngApp.search.services.IState;
  import ICartService = ngApp.cart.services.ICartService;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import IUserService = ngApp.components.user.services.IUserService;
  import INotify = ng.cgNotify.INotify;
  import ITableService = ngApp.components.tables.services.ITableService;
  import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;

  export interface ISearchController {
    files: IFiles;
    participants: IParticipants;
    State: IState;
    CartService: ICartService;
    addFilesKeyPress(event: any, type: string): void;
    setState(tab: string, next: string): void;
    select(section: string, tab: string): void;
    removeFiles(files: IFile[]): void;
    addRelatedFiles(participant: IParticipant): void;
    getFilteredRelatedFiles(participant: IParticipant): void;
    addFilteredRelatedFiles(participant: IParticipant): void;
    addToCart(files: IFile[]): void;
    isUserProject(file: IFile): boolean;
    addAll(): void;
    removeAllinSearchResult(): void;
    fileTableConfig:TableiciousConfig;
    participantTableConfig:TableiciousConfig;

  }

  interface ISearchScope extends ng.IScope {
    fileTableConfig:TableiciousConfig;
    participantTableConfig:TableiciousConfig;
  }

  class SearchController implements ISearchController {
    files: IFiles;
    participants: IParticipants;
    lastAddedFiles: IFile[];
    lastNotifyDialog: INotify;

    fileSortColumns: any = [
      {
        key: "file_size",
        name: "Size"
      },
      {
        key: "data_type",
        name: "Data Type"
      },
      {
        key: "data_format",
        name: "Data Format"
      },
      {
        key: "disease_code",
        name: "Project"
      }
    ];
    participantSortColumns: any = [
      {
        key: "admin.disease_code",
        name: "Disease Type"
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

    //searchFileTableModel:TableiciousConfig =

    /* @ngInject */
    constructor(private $scope: ISearchScope,
                private $state: ng.ui.IStateService,
                public State: IState,
                public CartService: ICartService,
                public FilesService: IFilesService,
                public ParticipantsService: IParticipantsService,
                private LocationService: ILocationService,
                private UserService: IUserService,
                public CoreService: ICoreService,
                private TableService : ITableService,
                private SearchTableFilesModel:TableiciousConfig,
                private SearchTableParticipantsModel:TableiciousConfig,
                private notify: any) {
      var data = $state.current.data || {};
      this.State.setActive("tabs", data.tab);
      this.State.setActive("facets", data.tab);
      CoreService.setPageTitle("Search");

      $scope.$on("$locationChangeSuccess", (event, next: string) => {
        if (next.indexOf("search") !== -1 || next.indexOf("query") !== -1) {
          this.refresh();
        }
      });
      $scope.$on("gdc-user-reset", () => {
        this.refresh();
      });

      $scope.fileTableConfig = this.SearchTableFilesModel;
      $scope.participantTableConfig = this.SearchTableParticipantsModel;


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
          "updated",
          "archive.disease_code",
          "archive.revision",
          "archive.archive_name",
          "archive.archive_uuid",
          "participants.bcr_patient_uuid",
        ],
        facets: [
          "data_type",
          "data_subtype",
          "experimental_strategy",
          "data_format",
          "platform",
          "archive.revision",
          "data_level",
          "data_access",
          "archive.center_name",
          "file_extension"
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
          "admin.disease_code",
          "files.file_uuid",
          "files.file_name",
          "files.file_size",
          "tumor_tissue_site",
          "files.data_type",
          "files.data_access",
          "files.archive.revision",
          "files.data_level",
          "summary.data_file_count",
          "summary.file_size",
          "summary.data_types.file_count",
          "summary.data_types.data_type",
          "summary.experimental_strategies.file_count",
          "summary.experimental_strategies.experimental_strategy"
        ],
        facets: [
          "admin.project_code",
          "admin.disease_code",
          "stage_event.pathologic_stage",
          "ethnicity",
          "gender",
          "histological_type",
          "history_of_neoadjuvant_treatment",
          "race",
          "tumor_tissue_site",
          "vital_status"
        ]
      }).then((data) => {
        // TODO - remove when aggregations done on server
        var participants = data.hits.map((participant)=>{
          participant.filesByType = participant.files.reduce((a,b)=>{

            var type = b.data_type;
            if (a[type]) {
              a[type] += 1;
            } else {
              a[type] = 1;
            }

            return a;
          },{});
          return participant;

        });

        this.participants = data;
      });
    }

    // TODO Load data lazily based on active tab
    setState(tab: string, next: string) {
      // Changing tabs and then navigating to another page
      // will cause this to fire.
      if (tab && (this.$state.current.name.match("search.") ||
          this.$state.current.name.match("query."))) {

        next += tab;

        this.$state.go(next, this.LocationService.search(), {inherit: true});
      }
    }

    isUserProject(file: IFile): boolean {
      return this.UserService.isUserProject(file);
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

    addToCart(files: IFile[]): void {
      this.CartService.addFiles(files);
    }





    removeFiles(files: IFile[]): void {
      this.CartService.remove(_.pluck(files, "file_uuid"));
    }

    addRelatedFiles(participant: IParticipant): void {
      this.addToCart(participant.files);
    }

    //getFilteredRelatedFiles(participant: IParticipant): void {
    //  var filters = this.LocationService.filters();
    //
    //  if (!filters.content) {
    //    filters.op = "and";
    //    filters.content = [];
    //  }
    //
    //  filters.content.push({
    //    content: {
    //      field: "participants.bcr_patient_uuid",
    //      value: [
    //        participant.bcr_patient_uuid
    //      ]
    //    },
    //    op: "is"
    //  });
    //
    //  this.FilesService.getFiles({
    //    fields: [
    //      "data_access",
    //      "data_format",
    //      "data_level",
    //      "data_subtype",
    //      "data_type",
    //      "file_extension",
    //      "file_name",
    //      "file_size",
    //      "file_uuid",
    //      "platform",
    //      "updated",
    //      "archive.disease_code",
    //      "archive.revision",
    //      "participants.bcr_patient_uuid"
    //    ],
    //    filters: filters,
    //    size: 100
    //  }).then((data) => participant.filteredRelatedFiles = data);
    //
    //}

    addFilteredRelatedFiles(participant: IParticipant): void {
      this.addToCart(participant.filteredRelatedFiles.hits);
    }

  }

  angular
      .module("search.controller", [
        "search.services",
        "location.services",
        "cart.services",
        "core.services",
        "participants.services",
        "search.table.files.model",
        'search.table.participants.model',
        "files.services"
      ])
      .controller("SearchController", SearchController);
}

