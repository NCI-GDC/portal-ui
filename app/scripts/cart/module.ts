module ngApp.cart {
  "use strict";

  import IFile = ngApp.files.models.IFile;
  import ICartService = ngApp.cart.services.ICartService;

  function cartConfig($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
    $urlRouterProvider.when("/cart", "/cart/s");

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

    $stateProvider.state("cart.summary", {
      url: "/s",
      data: {
        tab: "summary"
      },
      reloadOnSearch: false
    });

    $stateProvider.state("cart.items", {
      url: "/i",
      data: {
        tab: "items"
      },
      reloadOnSearch: false
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
