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
    undo(): void;
    isUserProject(file: IFile): boolean;
  }

  interface ISearchScope extends ng.IScope {
    searchFileColumns:Object[];
    searchParticipantColumns:Object[];
    fileColumnIsEnabled(id):Boolean;
    participantColumnIsEnabled(id):Boolean;
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

      $scope.searchFileColumns = [
      {
        name:"Access",
        id:"access",
        enabled: true
      },
      {
        name:"File Type",
        id:"file_type",
        enabled: true
      },
      {
        name:"File Name",
        id:"file_name",
        enabled: true
      },
      {
        name:"Participants",
        id:"participants",
        enabled: true
      },
      {
        name:"Annotations",
        id:"annotations",
        enabled: true
      },
      {
        name:"Project",
        id:"project",
        enabled: true
      },
      {
        name:"Data Category",
        id:"data_category",
        enabled: true
      },
      {
        name:"Status",
        id:"status",
        enabled: true
      },
      {
        name:"Size",
        id:"size",
        enabled: true
      },
      {
        name:"Revision",
        id:"revision",
        enabled: true
      },
      {
        name:"Update date",
        id:"update_date",
        enabled: true
      },
      ];

      $scope.searchParticipantColumns = [
      {
        name:"Participant ID",
        id:"participant_id",
        enabled: true
      },
      {
        name:"Project",
        id:"project",
        enabled: true
      },
      {
        name:"Primary Site",
        id:"primary_site",
        enabled: true
      },
      {
        name:"Disease Type",
        id:"disease_type",
        enabled: true
      },
      {
        name:"Gender",
        id:"gender",
        enabled: true
      },
      {
        name:"Tumor Stage",
        id:"tumor_stage",
        enabled: true
      },
      {
        name:"Files",
        id:"files",
        enabled: true
      },
      {
        name:"Available Data Files Per Type",
        id:"available_data_files",
        enabled: true
      },
      {
        name:"Annotations",
        id:"annotations",
        enabled: true
      }
      ];
      
      $scope.fileColumnIsEnabled = function(columnId) {
        return CoreService.arrayHasEnabledColumn($scope.searchFileColumns,columnId);
      }

      $scope.participantColumnIsEnabled = function(columnId) {
        return CoreService.arrayHasEnabledColumn($scope.searchParticipantColumns,columnId);
      }

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
      var cartReturned = this.CartService.addFiles(files);
      this.lastAddedFiles = cartReturned["added"];
      this.notify.closeAll();
      this.notify({
          messageTemplate: this.CartService.buildAddedMsg(cartReturned),
          scope: this.$scope
      });
    }

    undo(): void {
      this.notify.closeAll();
      this.removeFiles(this.lastAddedFiles);
    }

    removeFiles(files: IFile[]): void {
      console.log(files.length);
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
        "files.services",
        "cgNotify"
      ])
      .controller("SearchController", SearchController);
}

