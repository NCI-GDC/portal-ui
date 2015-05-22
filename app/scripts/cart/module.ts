module ngApp.cart {
  "use strict";

  import IFile = ngApp.files.models.IFile;
  import ICartService = ngApp.cart.services.ICartService;

  function cartConfig($stateProvider: ng.ui.IStateProvider) {

    $stateProvider.state("cart", {
      url: "/cart",
      controller: "CartController as cc",
      templateUrl: "cart/templates/cart.html",
      resolve: {
        files: (CartService: ICartService): IFile[] => {
          return CartService.getFiles();
        }
      }
    });

  }

  angular
      .module("ngApp.cart", [
        "cart.controller",
        "cart.services",
        "cart.directives",
        "ngApp.files",
        "ui.router.state",
        "ui.bootstrap"
      ])
      .config(cartConfig);
}
