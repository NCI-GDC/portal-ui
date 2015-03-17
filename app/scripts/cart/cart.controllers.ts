module ngApp.cart.controllers {
  import ICartService = ngApp.cart.services.ICartService;
  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;
  import ICoreService = ngApp.core.services.ICoreService;
  import IUserService = ngApp.components.user.services.IUserService;
  import IPagination = ngApp.components.tables.pagination.models.IPagination;

  export interface ICartController {
    files: IFile[];
    lastModified: Moment;
    selected(): IFile[];
    selectedSize(): number;
    getTotalSize(): number;
    removeSelected(): void;
    remove(id: string): void;
    selectAll(): void;
    deselectAll(): void;
    all(): boolean;
    isUserProject(file: IFile): boolean;
    getFileIds(): string[];
    getRelatedFileIds(): string[];
    processPaging: boolean;
    pagination: IPagination;
    displayedFiles: IFile[];
    setDisplayedFiles(newPaging?: IPagination): void;
    checkCartForClosedFiles();
  }

  class CartController implements ICartController {
    lastModified: Moment;
    pagination: any = {};
    processPaging: boolean = true;
    displayedFiles: IFile[];
    numberFilesGraph: any;
    sizeFilesGraph: any;

    /* @ngInject */
    constructor(private $scope: ng.IScope, public files: IFile[], private CoreService: ICoreService,
                private CartService: ICartService, private UserService: IUserService, private $modal, private $filter, private $window, private Restangular, private FilesService) {
      CoreService.setPageTitle("Cart", "(" + this.files.length + ")");
      this.lastModified = this.CartService.lastModified;

      this.pagination = {
        from: 1,
        size: 20,
        count: 10,
        page: 1,
        pages: Math.ceil(files.length / 10),
        total: files.length,
        sort: ""
      };

      this.setDisplayedFiles();

      $scope.$on("gdc-user-reset", () => {
        this.files = CartService.getFiles();
        this.setDisplayedFiles();

      });
      $scope.$on("cart-paging-update", (event: any, newPaging: any) => {
        this.setDisplayedFiles(newPaging);
      });

      $scope.$on("undo", () => {
        this.setDisplayedFiles();

      });

      $scope.$watch(function () {
        return CartService.getFiles().length && UserService.currentUser;
      }, function () {
        updateChartData();
      }, true);

      function updateChartData() {
        var accessCount = _.countBy(CartService.getFiles(), function (f) {
          return UserService.userCanDownloadFiles([f])
        });
        var data = [
          {
            access: 'open',
            count: accessCount['true'] || 0,
          },
          {
            access: 'protected',
            count: accessCount['false'] || 0,
          }
        ]

        $scope.chartConfig = {
          legend: {
            open: '%!% file(s) you are authorized to download',
            protected: '%!% file(s) you are not authorized to download'
          }
        }

        if (_.find(data, function (a) {
              return a.count > 0;
            })) {
          $scope.chartData = data.map(function (a) {
            return {
              key: a.access,
              value: a.count
            }
          })
        } else {
          $scope.chartData = undefined;
        }

      }
    }

    setDisplayedFiles(newPaging: IPagination = this.pagination): void {
      this.files = this.CartService.getFiles();
      this.pagination.from = newPaging.from;
      this.pagination.size = newPaging.size;
      this.pagination.count = this.pagination.size;
      this.pagination.pages = Math.ceil(this.files.length / this.pagination.size);
      this.pagination.total = this.files.length;

      // Used to check if files are deleted and the overall count can't reach the page
      // we are on.
      while (this.pagination.from > this.pagination.total) {
        this.pagination.page--;
        this.pagination.from -= this.pagination.size;
      }

      // Safe fallback
      if (this.pagination.page < 0 || this.pagination.from < 1) {
        this.pagination.page = 1;
        this.pagination.from = 1;
      }

      this.displayedFiles = _.assign([], this.files).splice(this.pagination.from - 1, this.pagination.size);
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

    getRelatedFileIds(files): string[] {
      return _.reduce(this.files, function (ids, file) {
        return ids.concat(file.related_ids);
      }, []);
    }

    getSelectedSize(): number {
      return _.reduce(this.selected(), function (sum: number, hit: IFile) {
        return sum + hit.file_size;
      }, 0);
    }

    remove(id: string) {
      this.CartService.remove([id]);
      this.lastModified = this.CartService.lastModified;
      this.setDisplayedFiles();
    }

    removeAll() {
      this.CartService.removeAll();
      this.lastModified = this.CartService.lastModified;
      this.setDisplayedFiles();
    }

    removeSelected(): void {
      var ids: string[] = _.pluck(this.selected(), "file_id");
      this.CartService.remove(ids);
      this.lastModified = this.CartService.lastModified;
      this.setDisplayedFiles();
    }

    selectAll(): void {
      this.files.forEach((file: IFile): void => {
        file.selected = true;
      });
    }

    deselectAll(): void {
      this.files.forEach((file: IFile): void => {
        file.selected = false;
      });
    }

    all(): boolean {
      return _.every(this.files, {selected: true});
    }

    isUserProject(file: IFile): boolean {
      return this.UserService.isUserProject(file);
    }

    checkCartForClosedFiles() {
      var $modal = this.$modal;
      var scope = this.$scope;
      var FilesService = this.FilesService;

      var isLoggedIn = this.UserService.currentUser;

      var protectedInCart = _.filter(this.CartService.files, function (a) {
        return a.access === 'protected'
      });
      var openInCart = _.filter(this.CartService.files, function (a) {
        return a.access !== 'protected'
      });

      var unauthorizedInCart;
      var authorizedInCart;

      if (isLoggedIn) {
        var projects = this.UserService.currentUser.projects.gdc_ids;
        unauthorizedInCart = _.filter(protectedInCart, function (a) {
          return !_.intersection(projects, a.projects).length && a.selected == true;
        });
        var openSelected = _.filter(openInCart, function (a) {
          return a.selected == true;
        });
        authorizedInCart = openSelected.concat(_.filter(protectedInCart, function (a) {
          return !!_.intersection(projects, a.projects).length && a.selected == true;
        }));


      } else {
        unauthorizedInCart = _.filter(protectedInCart, function (a) {
          return a.selected == true;
        });
        authorizedInCart = _.filter(openInCart, function (a) {
          return a.selected == true;
        });
      }

      scope.meta = {
        protected: protectedInCart,
        open: openInCart,
        unauthorized: unauthorizedInCart,
        authorized: authorizedInCart
      };

      if (unauthorizedInCart.length === 0) {
        download();
      } else {
        if (isLoggedIn) {
          showRequestAccessModal();
        } else {
          showLoginModal();
        }
      }

      //FIXME clean up
      function download() {
        var file_ids = []
        _.forEach(authorizedInCart, (f) => {
          console.log(f);
          console.log(f.file_id);
          console.log(f.related_ids);

          if (f.hasOwnProperty('related_ids')) {
            file_ids = file_ids.concat(f.related_ids)
          }
          file_ids.push(f.file_id)
        });
        console.log(file_ids);
        FilesService.downloadFiles(file_ids);
      }

      function showLoginModal() {
        var modalInstance = $modal.open({
          templateUrl: "core/templates/login-to-download.html",
          controller: "LoginToDownloadController as wc",
          backdrop: "static",
          keyboard: false,
          scope: scope,
          backdropClass: "warning-backdrop",
          size: "lg"
        });

        modalInstance.result.then((a) => {
          if (a && authorizedInCart.length > 0) {
            download();
          }
        });

      }

      function showRequestAccessModal() {
        var modalInstance = $modal.open({
          templateUrl: "core/templates/request-access-to-download.html",
          controller: "LoginToDownloadController as wc",
          backdrop: "static",
          keyboard: false,
          scope: scope,
          backdropClass: "warning-backdrop",
          size: "lg"
        });

        modalInstance.result.then((a) => {
          if (a && authorizedInCart.length > 0) {
            console.log(authorizedInCart);
            download();
          }
        });
      }
    }

  }


  angular
      .module("cart.controller", ["cart.services", "core.services", "user.services"])
      .controller("LoginToDownloadController", function ($scope, $modalInstance, $window) {

        var meta = $scope.$parent.chartData;

        this.cancel = function (a) {
          $modalInstance.close(false);
        };

        this.goAuth = function () {
          $modalInstance.close(true);
        };
      })

      .controller("CartController", CartController);
}

