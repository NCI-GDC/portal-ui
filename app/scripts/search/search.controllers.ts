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
  import ICartService = ngApp.cart.services.ICartService;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import IUserService = ngApp.components.user.services.IUserService;
  import ISearchService = ngApp.search.services.ISearchService;
  import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;

  export interface ISearchController {
    files: IFiles;
    participants: IParticipants;
    summary: any;
    State: IState;
    CartService: ICartService;
    addFilesKeyPress(event: any, type: string): void;
    setState(tab: string, next: string): void;
    select(section: string, tab: string): void;
    removeFiles(files: IFile[]): void;
    isUserProject(file: IFile): boolean;
    tabSwitch: boolean;
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
                private SearchTableFilesModel: TableiciousConfig,
                private SearchTableParticipantsModel: TableiciousConfig) {
      var data = $state.current.data || {};
      this.SearchState.setActive("tabs", data.tab);
      this.SearchState.setActive("facets", data.tab);
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
    }

    refresh() {
      if (this.tabSwitch) {
        this.tabSwitch = false;
        return;
      }

      this.SearchService.getSummary().then((data) => {
        this.summary = data;
      });

      this.FilesService.getFiles({
        fields: this.SearchTableFilesModel.fields,
        facets: [
          "data_subtype",
          "data_type",
          "experimental_strategy",
          "data_format",
          "platform",
          "archive.revision",
          "access",
          "state",
          "data_format",
          "center.name"
        ]
      }).then((data) => {
        if (!data.hits.length) {
          this.CoreService.setSearchModelState(true);
        }
        this.files = data;

        for(var i = 0; i < this.files.hits.length; i++) {
          this.files.hits[i].related_ids = _.pluck(this.files.hits[i].related_files, "file_id");
        }

      });

      this.ParticipantsService.getParticipants({
        fields: this.SearchTableParticipantsModel.fields,
        facets: [
          "clinical.icd_10",
          "clinical.ethnicity",
          "clinical.gender",
          "clinical.vital_status",
          "clinical.race",
          "project.name",
          "project.project_id",
          "project.primary_site",
          "project.program.name"
        ]
      }).then((data: IFiles) => {
        if (!data.hits.length) {
          this.CoreService.setSearchModelState(true);
        }

        this.participants = data;
      });
    }

    // TODO Load data lazily based on active tab
    // If done, flag preventing data reload on tab switch needs to
    // be reworked.
    setState(tab: string) {
      // Changing tabs and then navigating to another page
      // will cause this to fire.
      if (tab && (this.$state.current.name.match("search."))) {
        this.tabSwitch = true;
        this.$state.go("search." + tab, this.LocationService.search(), {inherit: false});
      }
    }

    isUserProject(file: IFile): boolean {
      return this.UserService.isUserProject(file);
    }

    select(section: string, tab: string) {
      this.SearchState.setActive(section, tab);
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

      if (q) {
        stateParams = {
          query: q,
          filters: angular.toJson(f)
        };
      }

      this.$state.go("query.summary", stateParams, { inherit: true });
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

