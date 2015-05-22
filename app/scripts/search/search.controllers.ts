module ngApp.search.controllers {
  import IFacet = ngApp.core.models.IFacet;
  import IFilesService = ngApp.files.services.IFilesService;
  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;
  import IParticipantsService = ngApp.participants.services.IParticipantsService;
  import IParticipants = ngApp.participants.models.IParticipants;
  import IParticipant = ngApp.participants.models.IParticipant;
  import IAnnotations = ngApp.annotations.models.IAnnotations;
  import ICoreService = ngApp.core.services.ICoreService;
  import ICartService = ngApp.cart.services.ICartService;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import IUserService = ngApp.components.user.services.IUserService;
  import ISearchService = ngApp.search.services.ISearchService;
  import ISearchState = ngApp.search.services.ISearchState;
  import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;

  export interface ISearchController {
    files: IFiles;
    participants: IParticipants;
    summary: any;
    SearchState: ISearchState;
    CartService: ICartService;
    addFilesKeyPress(event: any, type: string): void;
    setState(tab: string, next: string): void;
    select(section: string, tab: string): void;
    removeFiles(files: IFile[]): void;
    tabSwitch: boolean;
    projectIdChartConfig: any;
    primarySiteChartConfig: any;
  }

  interface ISearchScope extends ng.IScope {
    fileTableConfig:TableiciousConfig;
    participantTableConfig:TableiciousConfig;
  }

  class SearchController implements ISearchController {
    files: IFiles;
    participants: IParticipants;
    summary: any;
    tabSwitch: boolean = false;
    projectIdChartConfig: any;
    primarySiteChartConfig: any;

    /* @ngInject */
    constructor(private $scope: ISearchScope,
                private $state: ng.ui.IStateService,
                public SearchState: ISearchState,
                public CartService: ICartService,
                public SearchService: ISearchService,
                public FilesService: IFilesService,
                public ParticipantsService: IParticipantsService,
                private LocationService: ILocationService,
                private UserService: IUserService,
                public CoreService: ICoreService,
                $filter: ng.IFilterService,
                private SearchTableFilesModel: TableiciousConfig,
                private SearchTableParticipantsModel: TableiciousConfig,
                public FacetService) {
      var data = $state.current.data || {};
      this.SearchState.setActive("tabs", data.tab, "active");
      this.SearchState.setActive("facets", data.tab, "active");
      CoreService.setPageTitle("Search");

      $scope.$on("$locationChangeSuccess", (event, next: string) => {
        if (next.indexOf("search") !== -1) {
          this.refresh();
        }
      });
      $scope.$on("gdc-user-reset", () => {
        this.refresh();
      });

      $scope.fileTableConfig = this.SearchTableFilesModel;
      $scope.participantTableConfig = this.SearchTableParticipantsModel;

      this.refresh();

      this.projectIdChartConfig = {
        key: "project_id",
        textValue: "file_size.value",
        textFilter: "size",
        label: "file",
        sortKey: "doc_count",
        defaultText: "project",
        state: {
          "default": {
            name: "search.files",
            params: {
              filters: function(value) {
                return $filter("makeFilter")([
                  {
                    name: "participants.project.project_id",
                    value: [
                      value
                    ]
                  }
                ], true);
              }
            }
          }
        }
      };

      this.primarySiteChartConfig = {
        key: "primary_site",
        textValue: "file_size.value",
        textFilter: "size",
        label: "file",
        sortKey: "doc_count",
        defaultText: "primary site",
        state: {
          "default": {
            name: "search.files",
            params: {
              filters: function(value) {
                return $filter("makeFilter")([
                  {
                    name: "participants.project.primary_site",
                    value: [
                      value
                    ]
                  }
                ], true);
              }
            }
          }
        }
      };
    }

    refresh() {
      if (this.tabSwitch) {
        if (this.SearchState.tabs.participants.active) {
          this.SearchState.setActive("tabs", "participants", "hasLoadedOnce");
        }

        if (this.SearchState.tabs.files.active) {
          this.SearchState.setActive("tabs", "files", "hasLoadedOnce");
        }
        this.tabSwitch = false;
        return;
      }

      this.SearchService.getSummary().then((data) => {
        this.summary = data;
        this.tabSwitch = false;
      });

      var fileOptions = {
        fields: this.SearchTableFilesModel.fields,
        expand: this.SearchTableFilesModel.expand,
        facets: [
          "data_subtype",
          "data_type",
          "experimental_strategy",
          "data_format",
          "platform",
          "archive.revision",
          "access",
          "state",
          "origin",
          "data_format",
          "center.name",
          "tags"
        ]
      };

      var participantOptions = {
        fields: this.SearchTableParticipantsModel.fields,
        expand: this.SearchTableParticipantsModel.expand,
        facets: [
          "clinical.icd_10",
          "clinical.ethnicity",
          "clinical.gender",
          "clinical.vital_status",
          "clinical.days_to_death",
          "clinical.race",
          "clinical.age_at_diagnosis",
          "project.name",
          "project.project_id",
          "project.primary_site",
          "project.program.name"
        ]
      };

      this.FilesService.getFiles(fileOptions).then((data: IFiles) => {
        if (!_.isEqual(this.files, data)) {
          this.files = data;
          this.tabSwitch = false;
          if (this.SearchState.tabs.files.active) {
            this.SearchState.setActive("tabs", "files", "hasLoadedOnce");
          }

          for (var i = 0; i < this.files.hits.length; i++) {
            this.files.hits[i].related_ids = _.pluck(this.files.hits[i].related_files, "file_id");
          }
        }
      });

      this.ParticipantsService.getParticipants(participantOptions).then((data: IParticipants) => {
        if (!_.isEqual(this.participants, data)) {
          this.participants = data;
          this.tabSwitch = false;
          if (this.SearchState.tabs.participants.active) {
            this.SearchState.setActive("tabs", "participants", "hasLoadedOnce");
          }
        }
      });
    }

    setState(tab: string) {
      // Changing tabs and then navigating to another page
      // will cause this to fire.
      if (tab && (this.$state.current.name.match("search."))) {
        this.tabSwitch = true;
        this.$state.go("search." + tab, this.LocationService.search(), {inherit: false});
      }
    }

    select(section: string, tab: string) {
      this.SearchState.setActive(section, tab, "active");
      this.setState(tab);
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
      this.CartService.remove(_.pluck(files, "file_id"));
    }

    gotoQuery() {
      var stateParams = {};
      var f = this.LocationService.filters();
      var q = this.LocationService.filter2query(f);
      var toTab = this.$state.current.name.split(".")[1];

      if (q) {
        stateParams = {
          query: q,
          filters: angular.toJson(f)
        };
      }

      this.$state.go("query." + toTab, stateParams, { inherit: true });
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
        "files.services",
        "facets.services"
      ])
      .controller("SearchController", SearchController);
}

