module ngApp.cart.controllers {
  import ICartService = ngApp.cart.services.ICartService;
  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;
  import ICoreService = ngApp.core.services.ICoreService;
  import IUserService = ngApp.components.user.services.IUserService;
  import ISearchService = ngApp.search.services.ISearchService;
  import IPagination = ngApp.components.tables.pagination.models.IPagination;

  export interface ICartController {
    files: IFile[];
    lastModified: Moment;
    getTotalSize(): number;
    getFileIds(): string[];
    getRelatedFileIds(): string[];
    processPaging: boolean;
    pagination: IPagination;
    cartTableConfig: any;
    projectCountChartConfig: any;
    fileCountChartConfig: any;
  }

  class CartController implements ICartController {
    lastModified: Moment;
    pagination: any = {};
    processPaging: boolean = true;
    displayedFiles: IFile[];
    numberFilesGraph: any;
    sizeFilesGraph: any;
    cartTableConfig: any;
    projectCountChartConfig: any;
    fileCountChartConfig: any;
    helpHidden: boolean = false;
    participantCount: number;

    /* @ngInject */
    constructor(private $scope: ng.IScope,
                private $state: ng.ui.IStateService,
                private $filter: ng.IFilterService,
                public files: IFile[],
                private CoreService: ICoreService,
                private CartService: ICartService,
                private UserService: IUserService,
                private CartTableModel,
                private Restangular,
                private SearchService: ISearchService,
                private FilesService,
                private CartState) {
      var data = $state.current.data || {};
      this.CartState.setActive("tabs", data.tab);
      CoreService.setPageTitle("Cart", "(" + this.files.length + ")");
      this.lastModified = this.CartService.lastModified;
      this.cartTableConfig = CartTableModel;

      this.pagination = {
        from: 1,
        size: 20,
        count: 10,
        page: 1,
        pages: Math.ceil(files.length / 10),
        total: files.length,
        sort: ""
      };

      $scope.$on("gdc-user-reset", () => {
        this.files = CartService.getFiles();
        this.getSummary();
      });

      $scope.$on("undo", () => {
        this.files = CartService.getFiles();
        this.getSummary();
      });

      $scope.$on("cart-update", () => {
        this.lastModified = this.CartService.lastModified;
        this.files = CartService.getFiles();
        this.getSummary();
      });

      this.projectCountChartConfig = {
        textValue: "file_size.value",
        textFilter: "size",
        label: "file",
        sortKey: "doc_count",
        displayKey: "key",
        sortData: true,
        defaultText: "project",
        pluralDefaultText: "projects",
      };

      this.fileCountChartConfig = {
        textValue: "file_size.value",
        textFilter: "size",
        label: "file",
        sortKey: "doc_count",
        displayKey: "key",
        sortData: true,
        defaultText: "authorization level",
        pluralDefaultText: "authorization levels"
      };

      this.getSummary();
    }

    getSummary() {
      this.participantCount = _.unique(_.flatten(_.pluck(this.files, "caseIds"))).length;
      var filters = {
        op: "and",
        content: [
          {
            op: "in",
            content: {
              field: "files.file_id",
              value: _.pluck(this.files, "file_id")
            }
          }
        ]
      };

      this.SearchService.getSummary(filters, true).then((data) => {
        this.summary = data;
      });

      var UserService = this.UserService;
      var authCountAndFileSizes = _.reduce(this.files, (result, file) => {
        var canDownloadKey = UserService.userCanDownloadFile(file) ? 'authorized' : 'unauthorized';
        result[canDownloadKey].count += 1;
        result[canDownloadKey].file_size += file.file_size;
        return result;
      }, { 'authorized': { 'count': 0, 'file_size': 0 }, 'unauthorized': {'count': 0, 'file_size': 0 } });

      this.fileCountChartData = _.filter([
        {
          key: 'authorized',
          doc_count: authCountAndFileSizes.authorized.count || 0,
          file_size: { value: authCountAndFileSizes.authorized.file_size }
        },
        {
          key: 'unauthorized',
          doc_count: authCountAndFileSizes.unauthorized.count || 0,
          file_size: { value: authCountAndFileSizes.unauthorized.file_size }
        }
      ], (i) => i.doc_count);

    }

    setState(tab: string) {
      // Changing tabs and then navigating to another page
      // will cause this to fire.
      if (tab && (this.$state.current.name.match("cart."))) {
        this.$state.go("cart." + tab, {}, {inherit: false});
      }
    }

    getTotalSize(): number {
      return _.reduce(this.files, function (sum: number, hit: IFile) {
        return sum + hit.file_size;
      }, 0);
    }

    getFileIds(): string[] {
      return _.pluck(this.files, "file_id");
    }

    getRelatedFileIds(): string[] {
      return _.reduce(this.files, function (ids, file) {
        return ids.concat(file.related_ids);
      }, []);
    }

    removeAll() {
      this.CartService.removeAll();
      this.lastModified = this.CartService.lastModified;
      this.files = this.CartService.getFiles();
      this.getSummary();
    }

    getManifest(selectedOnly: boolean = false) {
      this.FilesService.downloadManifest(_.pluck(this.CartService.getFiles(), "file_id"), (complete) => {
        if(complete) {
          return true;
        }
      });
    }

  }

  class LoginToDownloadController {
    /* @ngInject */
    constructor (private $modalInstance) {}

    cancel() :void {
      this.$modalInstance.close(false);
    }

    goAuth() :void {
      this.$modalInstance.close(true);
    }
  }

  class AddToCartSingleCtrl {
    /* @ngInject */
    constructor(private CartService: ICartService) {}

    addToCart(): void {
      console.log(this.file.file_id);
      this.CartService.addFiles([this.file], true);
    }

    removeFromCart(): void {
      this.CartService.removeFiles([this.file]);
    }
  }

  class AddToCartAllCtrl {
    CartService: ICartService;
    /* @ngInject */
    constructor(public CartService: ICartService,
    //private QueryCartService: IQueryCartService,
                private UserService: IUserService,
                public LocationService: ILocationService,
                public FilesService: IFilesService,
                public UserService: IUserService,
                public $timeout: ng.ITimeoutService,
                public notify: INotifyService) {
                  this.CartService = CartService;
    }

    removeAll(): void {
      // Query ES using the current filter and the file uuids in the Cart
      // If an id is in the result, then it is both in the Cart and in the current Search query
      var filters = this.filter || this.LocationService.filters();
      var size: number = this.CartService.getFiles().length;
      if (!filters.content) {
        filters.op = "and";
        filters.content = [];
      }

      filters.content.push({
        content: {
          field: "files.file_id",
          value: _.pluck(this.CartService.getFiles(), "file_id")
        },
        op: "in"
      });

      this.FilesService.getFiles({
        fields:[
          "file_id"
        ],
        filters: filters,
        size: size,
        from: 0
      }).then((data) => {
        this.CartService.remove(_.pluck(data.hits, "file_id"));
      });
    }

    addAll(): void {
      var filters = (this.filter ? JSON.parse(this.filter) : undefined) || this.LocationService.filters();
      filters = this.UserService.addMyProjectsFilter(filters, "cases.project.project_id");

      if (this.size >= this.CartService.getCartVacancySize()) {
        this.CartService.sizeWarning();
        return;
      }

      var addingMsgPromise = this.$timeout(() => {
        this.notify({
          message: "",
          messageTemplate: "<span data-translate>Adding <strong>" + this.size + "</strong> files to cart</span>",
          container: "#notification",
          classes: "alert-info"
        });
      }, 1000);

      this.FilesService.getFiles({
        fields: ["access",
                 "file_name",
                 "file_id",
                 "file_size",
                 "data_type",
                 "data_format",
                 "annotations.annotation_id",
                 "cases.case_id",
                 "cases.project.project_id",
                 "cases.project.name"
                 ],
        filters: filters,
        sort: "",
        size: this.size,
        from: 0
      }).then((data) => {
        this.CartService.addFiles(data.hits, false);
        this.$timeout.cancel(addingMsgPromise);
      });
    }
  }

  angular
      .module("cart.controller", [
        "cart.services",
        "core.services",
        "user.services",
        "cart.table.model",
        "search.services"
      ])
      .controller("LoginToDownloadController", LoginToDownloadController )
      .controller("AddToCartAllCtrl", AddToCartAllCtrl)
      .controller("AddToCartSingleCtrl", AddToCartSingleCtrl)
      .controller("CartController", CartController);
}
