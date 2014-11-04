module ngApp.cart {
  "use strict";

  import IFilesService = ngApp.files.services.IFilesService;
  import IFiles = ngApp.files.models.IFiles;

  import ICartService = ngApp.cart.services.ICartService;

  function cartConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("cart", {
          url: "/cart",
          controller: "CartController as cc",
          templateUrl: "cart/templates/cart.html",
          resolve: {
            files: (CartService: ICartService) => {
              return CartService.getFiles();
            }
          }
        }
    );
  }

  angular
      .module("ngApp.cart", [
        "cart.controller",
        "cart.services",
        "ngApp.files",
        "ui.router.state"
      ])
      .config(cartConfig);
}
