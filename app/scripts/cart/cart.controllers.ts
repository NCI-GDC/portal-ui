module ngApp.cart.controllers {
  import ICartService = ngApp.cart.services.ICartService;
  import IFiles = ngApp.files.models.IFiles;

  export interface ICartController {
    files: IFiles;
    totalSize: number;
  }

  class CartController implements ICartController {
    /* @ngInject */
    files: IFiles;
    totalSize: number = 0;

    constructor(private CartService: ICartService) {
        this.files = CartService.getFiles();
        this.calculateTotalSize();
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

