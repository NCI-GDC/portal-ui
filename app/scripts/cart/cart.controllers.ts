module ngApp.cart.controllers {
  import ICartService = ngApp.cart.services.ICartService;
  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;
  import ICoreService = ngApp.core.services.ICoreService;
  import IUserService = ngApp.components.user.services.IUserService;

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
  }

  class CartController implements ICartController {
    lastModified: Moment;

    /* @ngInject */
    constructor(private $scope: ng.IScope, public files: IFile[], private CoreService: ICoreService,
                private CartService: ICartService, private UserService: IUserService) {
      CoreService.setPageTitle("Cart", "(" + this.files.length + ")");
      this.lastModified = this.CartService.lastModified;

      $scope.$on("gdc-user-reset", () => {
        this.files = CartService.getFiles();
      });
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


    getSelectedSize(): number {
      return _.reduce(this.selected(), function (sum: number, hit: IFile) {
        return sum + hit.file_size;
      }, 0);
    }

    remove(id: string) {
      this.CartService.remove([id]);
      this.lastModified = this.CartService.lastModified;
    }

    removeAll() {
      this.CartService.removeAll();
      this.lastModified = this.CartService.lastModified;
    }

    removeSelected(): void {
      var ids: string[] = _.pluck(this.selected(), "file_uuid");
      this.CartService.remove(ids);
      this.lastModified = this.CartService.lastModified;
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
      return this.UserService.currentUser.projects.indexOf(file.archive.disease_code) !== -1;
    }

  }

  angular
      .module("cart.controller", ["cart.services", "core.services", "user.services"])
      .controller("CartController", CartController);
}

