module ngApp.cart {
  "use strict";

  import ICartService = ngApp.cart.services.ICartService;
  import IFiles = ngApp.files.models.IFiles;

  function cartConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("cart", {
      url: "/cart",
      controller: "CartController as cc",
      templateUrl: "cart/templates/cart.html"
     }
    );
  }

  angular
    .module("ngApp.cart", [
        "cart.controller",
        "ui.router.state"
    ])
    .config(cartConfig);
}
