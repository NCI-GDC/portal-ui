module ngApp.cart.controllers {
  import ICartService = ngApp.cart.services.ICartService;
  import IFiles = ngApp.files.models.IFiles;
  import ICoreService = ngApp.core.services.ICoreService;

  export interface ICartController {
    files: IFiles;
    totalSize: number;
  }

  class CartController implements ICartController {
    /* @ngInject */
    files: IFiles;
    totalSize: number = 0;

    constructor(private CartService: ICartService, private CoreService: ICoreService) {
        this.files = CartService.getFiles();
        this.calculateTotalSize();
        CoreService.setPageTitle("Cart " + "(" + this.files.hits.length + ")");
    }

    calculateTotalSize(): void {
      for(var i = 0; i < this.files.hits.length; i++) {
        this.totalSize += this.files.hits[i].size;
      }
    }
  }

  angular
    .module("cart.controller", ["cart.services"])
    .controller("CartController", CartController);
}

