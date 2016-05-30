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
  import IFacetsConfigService = ngApp.components.facets.services.IFacetsConfigService;

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
    participantsLoading: boolean = true;
    filesLoading: boolean = true;
    summary: any;
    tabSwitch: boolean = false;
    projectIdChartConfig: any;
    primarySiteChartConfig: any;
    facetsCollapsed: boolean = false;

    /* @ngInject */
    constructor(private $scope: ISearchScope,
                private $rootScope: IRootScope,
                private $state: ng.ui.IStateService,
                public SearchState: ISearchState,
                public CartService: ICartService,
                public SearchService: ISearchService,
                public FilesService: IFilesService,
                public ParticipantsService: IParticipantsService,
                private LocationService: ILocationService,
                private UserService: IUserService,
                public CoreService: ICoreService,
                public SearchTableFilesModel: TableiciousConfig,
                public SearchCasesTableService: TableiciousConfig,
                private FacetsConfigService: IFacetsConfigService,
                public FacetService,
                SearchChartConfigs) {
      var data = $state.current.data || {};
      this.SearchState.setActive("tabs", data.tab, "active");
      this.SearchState.setActive("facets", data.tab, "active");
      CoreService.setPageTitle("Search");

      $scope.$on("$locationChangeSuccess", (event, next: string) => {
        if (next.indexOf("search") !== -1) {
          this.refresh();
        }
      });
      $scope.$on("$stateChangeSuccess", (event, toState: any, toParams: any, fromState: any) => {
        if (toState.name.indexOf("search") !== -1) {
          this.SearchState.setActive("tabs", toState.name.split(".")[1], "active");
        }
        if (fromState.name.indexOf("search") === -1) {
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }
      });

      $scope.$on("gdc-user-reset", () => {
        this.refresh();
      });

      $scope.fileTableConfig = this.SearchTableFilesModel;
      $scope.participantTableConfig = this.SearchCasesTableService.model();

      this.FacetsConfigService.setFields('files', this.SearchTableFilesModel.facets);
      this.FacetsConfigService.setFields('cases', this.SearchCasesTableService.model().facets);
      this.refresh();
      this.chartConfigs = SearchChartConfigs;
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

      const casesTableModel = this.SearchCasesTableService.model();

      this.$rootScope.$emit('ShowLoadingScreen');
      this.filesLoading = true;
      this.participantsLoading = true;

      this.SearchService.getSummary().then((data) => {
        this.summary = data;
        this.tabSwitch = false;
      });

      var fileOptions = {
        fields: this.SearchTableFilesModel.fields,
        facets: this.FacetService.filterFacets(this.FacetsConfigService.fieldsMap['files'])
      };

      var participantOptions = {
        fields: casesTableModel.fields,
        expand: casesTableModel.expand,
        facets: this.FacetService.filterFacets(this.FacetsConfigService.fieldsMap['cases'])
      };

      this.FilesService.getFiles(fileOptions).then((data: IFiles) => {
        this.filesLoading = false;

        if (!this.participantsLoading && !this.filesLoading) {
          this.$rootScope.$emit('ClearLoadingScreen');
        }

        this.files = this.files || {};
        this.files.aggregations = data.aggregations;
        this.files.pagination = data.pagination;

        if (!_.isEqual(this.files.hits, data.hits)) {
          this.files.hits = data.hits;
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
        this.participantsLoading = false;

        if (!this.participantsLoading && !this.filesLoading) {
          this.$rootScope.$emit('ClearLoadingScreen');
        }

        this.participants = this.participants || {};
        this.participants.aggregations = data.aggregations;
        this.participants.pagination = data.pagination;

        if (!_.isEqual(this.participants.hits, data.hits)) {
          this.participants.hits = data.hits;
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
      this.CartService.remove(files);
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

    toggleFacets(shouldCollapse) {
      this.facetsCollapsed = shouldCollapse;
      this.$rootScope.$emit("toggleFacets");
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
        "search.cases.table.service",
        "files.services",
        "facets.services"
      ])
      .controller("SearchController", SearchController);
}
