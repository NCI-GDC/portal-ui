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
  }

  interface ISearchScope extends ng.IScope {
      searchfileColumns:any[];
      searchParticipantColumns:any[];
  }

  class SearchController implements ISearchController {
    files: IFiles;
    participants: IParticipants;
    lastAddedFiles: IFile[];
    lastNotifyDialog: INotify;

    searchParticipantColumns:any[] = [
      {
        displayName:"Participant ID",
        id:"participant_id",
        enabled: true
      },
      {
        displayName:"Project",
        id:"project",
        enabled: true
      },
      {
        displayName:"Primary Site",
        id:"primary_site",
        enabled: true
      },
      {
        displayName:"Disease Type",
        id:"disease_type",
        enabled: true
      },
      {
        displayName:"Gender",
        id:"gender",
        enabled: true
      },
      {
        displayName:"Tumor Stage",
        id:"tumor_stage",
        enabled: true
      },
      {
        displayName:"Files",
        id:"files",
        enabled: true
      },
      {
        displayName:"Available Data Files Per Type",
        id:"available_data_files",
        enabled: true
      },
      {
        displayName:"Annotations",
        id:"annotations",
        enabled: true
      }
    ];

    searchfileColumns:any[] = [
      {
        displayName:"Access",
        id:"access",
        enabled: true
      },
      {
        displayName:"File Type",
        id:"file_type",
        enabled: true
      },
      {
        displayName:"Name",
        id:"file_name",
        enabled: true
      },
      {
        displayName:"Participants",
        id:"participants",
        enabled: true
      },
      {
        displayName:"Annotations",
        id:"annotations",
        enabled: true
      },
      {
        displayName:"Project",
        id:"project",
        enabled: true
      },
      {
        displayName:"Data Category",
        id:"data_category",
        enabled: true
      },
      {
        displayName:"Status",
        id:"status",
        enabled: true
      },
      {
        displayName:"Size",
        id:"size",
        enabled: true
      },
      {
        displayName:"Revision",
        id:"revision",
        enabled: true
      },
      {
        displayName:"Update date",
        id:"update_date",
        enabled: true
      },
    ];

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

      $scope.searchfileColumns = this.searchfileColumns;
      $scope.searchParticipantColumns = this.searchParticipantColumns;


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
          "participants.bcr_patient_uuid"
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
          "files.data_level"
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
      return this.UserService.currentUser.projects.indexOf(file.archive.disease_code) !== -1;
    }

    fileColumnIsEnabled = (columnId) => {
        return this.TableService.objectWithMatchingIdInArrayIsEnabled(this.searchfileColumns,columnId);
    }

    participantColumnIsEnabled = (columnId) => {
      return this.TableService.objectWithMatchingIdInArrayIsEnabled(this.searchParticipantColumns,columnId);
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

    addAll(): void {
      console.log("SearchController::addAll");
      var filters = this.LocationService.filters();
      var size: number = (this.files.pagination.total >= this.CartService.getMaxSize()) ? this.CartService.getMaxSize() : this.files.pagination.total;
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
          "participants.bcr_patient_uuid"
        ],
        filters: filters,
        size: size
      }).then((data) => this.CartService.addFiles(data.hits));
    }

    removeAllInSearchResult(): void {
      // Query ES using the current filter and the file uuids in the Cart
      // If an id is in the result, then it is both in the Cart and in the current Search query
      var filters = this.LocationService.filters();
      var size: number = this.CartService.getFiles().length;
      if (!filters.content) {
        filters.op = "and";
        filters.content = [];
      }
      filters.content.push({
        content: {
          field: "files.file_uuid",
          value: _.pluck(this.CartService.getFiles(), "file_uuid")
        },
        op: "is"
      });
      this.FilesService.getFiles({
        fields:[
          "file_uuid"
        ],
        filters: filters,
        size: size,
        from: 0
      }).then((data) => {
        this.CartService.remove(_.pluck(data.hits, "file_uuid"));
      });
    }

    removeFiles(files: IFile[]): void {
      this.CartService.remove(_.pluck(files, "file_uuid"));
    }

    addRelatedFiles(participant: IParticipant): void {
      this.addToCart(participant.files);
    }

    getFilteredRelatedFiles(participant: IParticipant): void {
      var filters = this.LocationService.filters();

      if (!filters.content) {
        filters.op = "and";
        filters.content = [];
      }

      filters.content.push({
        content: {
          field: "participants.bcr_patient_uuid",
          value: [
            participant.bcr_patient_uuid
          ]
        },
        op: "is"
      });

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
          "participants.bcr_patient_uuid"
        ],
        filters: filters,
        size: 100
      }).then((data) => participant.filteredRelatedFiles = data);

    }

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
        "files.services"
      ])
      .controller("SearchController", SearchController);
}

