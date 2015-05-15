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
    selected(): IFile[];
    selectedSize(): number;
    getTotalSize(): number;
    removeSelected(): void;
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

    /* @ngInject */
    constructor(private $scope: ng.IScope,
                private $state: ng.ui.IStateService,
                $filter: ng.IFilterService,
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
        defaultText: "project"
      };

      this.fileCountChartConfig = {
        textValue: "file_size.value",
        textFilter: "size",
        label: "file",
        sortKey: "doc_count",
        defaultText: "access level",
        state: {
          open: {
            name: "search.files",
            params: {
              filters: $filter("makeFilter")([
                {
                  name: "files.file_id",
                  value: _.pluck(_.filter(this.files, (file) => {
                    return file.access === "open";
                  }), "file_id")
                },
                {
                  name: "files.access",
                  value: "open"
                }
              ], true)
            }
          },
          "protected": {
            name: "search.files",
            params: {
              filters: $filter("makeFilter")([
                {
                  name: "files.file_id",
                  value: _.pluck(_.filter(this.files, (file) => {
                    return file.access === "protected";
                  }), "file_id")
                },
                {
                  name: "files.access",
                  value: "protected"
                }
              ], true)
            }
          }
        }
      };

      this.getSummary();
    }

    getSummary() {
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

      this.SearchService.getSummary(filters).then((data) => {
        this.summary = data;
      });
    }

    setState(tab: string) {
      // Changing tabs and then navigating to another page
      // will cause this to fire.
      if (tab && (this.$state.current.name.match("cart."))) {
        this.$state.go("cart." + tab, {}, {inherit: false});
      }
    }

    select(section: string, tab: string) {
      this.CartState.setActive(section, tab);
      this.setState(tab);
    }

    selected(): IFile[] {
      return this.CartService.getSelectedFiles();
    }

    selectedSize(): number {
      return this.getSelectedSize();
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

    getSelectedSize(): number {
      return _.reduce(this.selected(), function (sum: number, hit: IFile) {
        return sum + hit.file_size;
      }, 0);
    }

    removeAll() {
      this.CartService.removeAll();
      this.lastModified = this.CartService.lastModified;
      this.files = this.CartService.getFiles();
      this.getSummary();
    }

    removeSelected(): void {
      var ids: string[] = _.pluck(this.selected(), "file_id");
      this.CartService.remove(ids);
      this.lastModified = this.CartService.lastModified;
      this.files = this.CartService.getFiles();
      this.getSummary();
    }

    getManifest(selectedOnly: boolean = false) {
      var authorizedInCart = this.CartService.getAuthorizedFiles();

      if (selectedOnly) {
        authorizedInCart = authorizedInCart.filter(function isSelected(a) {
          return a.selected;
        });
      }

      var file_ids = [];
      _.forEach(authorizedInCart, (f) => {
        if (f.hasOwnProperty('related_ids') && f.related_ids) {
          file_ids = file_ids.concat(f.related_ids)
        }
        file_ids.push(f.file_id)
      });

      this.FilesService.downloadManifest(file_ids);
    }

  }

  class LoginToDownloadController {
    constructor (private $modalInstance) {}

    cancel() :void {
      this.$modalInstance.close(false);
    }

    goAuth() :void {
      this.$modalInstance.close(true);
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
      .controller("CartController", CartController);
}

