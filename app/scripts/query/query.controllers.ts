module ngApp.query.controllers {
  import IFacet = ngApp.core.models.IFacet;
  import IFilesService = ngApp.files.services.IFilesService;
  import ICasesService = ngApp.cases.services.ICasesService;
  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;
  import ICases = ngApp.cases.models.ICases;
  import IAnnotations = ngApp.annotations.models.IAnnotations;
  import ICoreService = ngApp.core.services.ICoreService;
  import IQueryState = ngApp.query.services.IQueryState;
  import ICartService = ngApp.cart.services.ICartService;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import IUserService = ngApp.components.user.services.IUserService;
  import ISearchService = ngApp.search.services.ISearchService;
  import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;

  export interface IQueryController {
    files: IFiles;
    cases: ICases;
    QState: IQueryState;
    CartService: ICartService;
    addFilesKeyPress(event: any, type: string): void;
    setState(tab: string, next: string): void;
    select(section: string, tab: string): void;
    removeFiles(files: IFile[]): void;
    isUserProject(file: IFile): boolean;
    tabSwitch: boolean;
    query: string;
    projectIdChartConfig: any;
    primarySiteChartConfig: any;
  }

  interface IQueryScope extends ng.IScope {
    fileTableConfig:TableiciousConfig;
    caseTableConfig:TableiciousConfig;
  }

  class QueryController implements IQueryController {
    files: IFiles;
    cases: ICases;
    query: string = "";
    tabSwitch: boolean = false;
    projectIdChartConfig: any;
    primarySiteChartConfig: any;

    /* @ngInject */
    constructor(private $scope: IQueryScope,
                private $state: ng.ui.IStateService,
                public QState: IQueryState,
                public CartService: ICartService,
                public SearchService: ISearchService,
                public FilesService: IFilesService,
                public CasesService: ICasesService,
                private LocationService: ILocationService,
                private UserService: IUserService,
                private CoreService: ICoreService,
                private SearchTableFilesModel: TableiciousConfig,
                private SearchTableCasesModel: TableiciousConfig,
                SearchChartConfigs) {
      var data = $state.current.data || {};
      this.QState.setActive(data.tab, "active");
      CoreService.setPageTitle("Query");

      $scope.$on("$locationChangeSuccess", (event, next: string) => {
        if (next.indexOf("query") !== -1) {
          this.refresh();
        }
      });
      $scope.$on("gdc-user-reset", () => {
        this.refresh();
      });

      $scope.fileTableConfig = this.SearchTableFilesModel;
      $scope.caseTableConfig = this.SearchTableCasesModel;

      this.refresh();
      this.chartConfigs = SearchChartConfigs;
    }

    refresh() {
      if (this.tabSwitch) {
        if (this.QState.tabs.cases.active) {
          this.QState.setActive("cases", "hasLoadedOnce");
        }

        if (this.QState.tabs.files.active) {
          this.QState.setActive("files", "hasLoadedOnce");
        }
        this.tabSwitch = false;
        return;
      }

      this.SearchService.getSummary().then((data) => {
        this.summary = data;
      });

      var fileOptions = {
        fields: this.SearchTableFilesModel.fields,
        expand: this.SearchTableFilesModel.expand
      };

      var caseOptions = {
        fields: this.SearchTableCasesModel.fields,
        expand: this.SearchTableCasesModel.expand,
      };

      this.FilesService.getFiles(fileOptions).then((data: IFiles) => {
        this.files = this.files || {};
        this.files.aggregations = data.aggregations;

        if (!_.isEqual(this.files.hits, data.hits)) {
          this.files = data;
          this.tabSwitch = false;
          if (this.QState.tabs.files.active) {
            this.QState.setActive("files", "hasLoadedOnce");
          }

          for (var i = 0; i < this.files.hits.length; i++) {
            this.files.hits[i].related_ids = _.pluck(this.files.hits[i].related_files, "file_id");
          }
        }
      });

      this.CasesService.getCases(caseOptions).then((data: ICases) => {
        this.cases = this.cases || {};
        this.cases.aggregations = data.aggregations;

        if (!_.isEqual(this.cases.hits, data.hits)) {
          this.cases = data;
          this.tabSwitch = false;
          if (this.QState.tabs.cases.active) {
            this.QState.setActive("cases", "hasLoadedOnce");
          }
        }
      });
    }

    // TODO Load data lazily based on active tab
    setState(tab: string) {
      // Changing tabs and then navigating to another page
      // will cause this to fire.
      if (tab && (this.$state.current.name.match("query."))) {
        this.tabSwitch = true;
        this.$state.go('query.' + tab, this.LocationService.search(), {inherit: false});
      }
    }

    isUserProject(file: IFile): boolean {
      return this.UserService.isUserProject(file);
    }


    select(tab: string) {
      this.QState.setActive(tab, "active");
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
  }
  angular
      .module("query.controller", [
        "query.services",
        "search.services",
        "location.services",
        "cart.services",
        "core.services",
        "cases.services",
        "search.table.files.model",
        'search.table.cases.model',
        "files.services"
      ])
      .controller("QueryController", QueryController);
}
