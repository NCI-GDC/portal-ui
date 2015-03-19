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
    constructor(private $scope: ng.IScope,
                public files: IFile[],
                private CoreService: ICoreService,
                private CartService: ICartService,
                private UserService: IUserService,
                private Restangular,
                private FilesService) {
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

      $scope.$on("cart.update",()=>{
        this.setDisplayedFiles();
      })

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

    getManifest() {
      var authorizedInCart = this.CartService.getAuthorizedFiles().filter(function isSelected(a){return a.selected});

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
      .module("cart.controller", ["cart.services", "core.services", "user.services"])
      .controller("LoginToDownloadController", LoginToDownloadController )
      .controller("CartController", CartController);
}

