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
  import IUserService = ngApp.components.user.services.IUserService;
  import ISearchService = ngApp.search.services.ISearchService;
  import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;

  export interface IQueryController {
    files: IFiles;
    participants: IParticipants;
    QState: IQueryState;
    CartService: ICartService;
    addFilesKeyPress(event: any, type: string): void;
    setState(tab: string, next: string): void;
    select(section: string, tab: string): void;
    removeFiles(files: IFile[]): void;
    isUserProject(file: IFile): boolean;
    tabSwitch: boolean;
    query: string;
  }

  interface IQueryScope extends ng.IScope {
    fileTableConfig:TableiciousConfig;
    participantTableConfig:TableiciousConfig;
  }

  class QueryController implements IQueryController {
    files: IFiles;
    participants: IParticipants;
    query: string = "";
    tabSwitch: boolean = false;

    /* @ngInject */
    constructor(private $scope: IQueryScope,
                private $state: ng.ui.IStateService,
                public QState: IQueryState,
                public CartService: ICartService,
                public SearchService: ISearchService,
                public FilesService: IFilesService,
                public ParticipantsService: IParticipantsService,
                private LocationService: ILocationService,
                private UserService: IUserService,
                private CoreService: ICoreService,
                private SearchTableFilesModel: TableiciousConfig,
                private SearchTableParticipantsModel: TableiciousConfig) {
      var data = $state.current.data || {};
      this.QState.setActive(data.tab);
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
      $scope.participantTableConfig = this.SearchTableParticipantsModel;

      this.projectIdChartConfig = {
        key: "project_id",
        textValue: "file_size.value",
        textFilter: "size",
        label: "file",
        sortKey: "doc_count",
        defaultText: "project"
      };

      this.primarySiteChartConfig = {
        key: "primary_site",
        textValue: "file_size.value",
        textFilter: "size",
        label: "file",
        sortKey: "doc_count",
        defaultText: "primary site"
      };

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
        raw: true,
        fields: this.SearchTableFilesModel.fields
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
        raw: true,
        fields: this.SearchTableParticipantsModel.fields
      }).then((data: IFiles) => {
        if (!data.hits.length) {
          this.CoreService.setSearchModelState(true);
        }

        this.participants = data;
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
      this.QState.setActive(tab);
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
        "participants.services",
        "search.table.files.model",
        'search.table.participants.model',
        "files.services"
      ])
      .controller("QueryController", QueryController);
}