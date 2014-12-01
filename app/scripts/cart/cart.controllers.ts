module ngApp.cart.controllers {
  import ICartService = ngApp.cart.services.ICartService;
  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;
  import ICoreService = ngApp.core.services.ICoreService;

  export interface ICartController {
    files: IFiles;
    lastModified: Moment;
    selected(): IFile[];
    selectedSize(): number;
    getTotalSize(): number;
    removeSelected(): void;
    remove(id: string): void;
    selectAll(): void;
    deselectAll(): void;
    all(): boolean;
  }

  class CartController implements ICartController {
    lastModified: Moment;

    /* @ngInject */
    constructor(public files: IFiles, private CoreService: ICoreService, private CartService: ICartService) {
      CoreService.setPageTitle("Cart", "(" + this.files.hits.length + ")");
      CartService.files = files;
      this.lastModified = this.CartService.lastModified;
    }

    selected(): IFile[] {
      return this.CartService.getSelectedFiles();
    }

    selectedSize(): number {
      return this.getSelectedSize();
    }

    getTotalSize(): number {
      return _.reduce(this.files.hits, function (sum: number, hit: IFile) {
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
      console.log(1);
      this.CartService.removeAll();
      this.lastModified = this.CartService.lastModified;
    }

    removeSelected(): void {
      var ids : string[] = _.pluck(this.selected(), "file_uuid");
      this.CartService.remove(ids);
      this.lastModified = this.CartService.lastModified;
    }

    selectAll(): void {
      this.files.hits.forEach((file: IFile): void => {
        file.selected = true;
      });
    }

    deselectAll(): void {
      this.files.hits.forEach((file: IFile): void => {
        file.selected = false;
      });
    }

    all() :boolean {
      return _.every(this.files.hits, {selected: true});
    }

  }

  angular
      .module("cart.controller", ["cart.services", "core.services"])
      .controller("CartController", CartController);
}

