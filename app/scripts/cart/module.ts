module ngApp.cart {
  "use strict";

  import IFilesService = ngApp.files.services.IFilesService;
  import IFiles = ngApp.files.models.IFiles;

  function cartConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("cart", {
      url: "/cart",
      controller: "CartController as cc",
      templateUrl: "cart/templates/cart.html",
      resolve: {
        files: (FilesService: IFilesService) => {
          return FilesService.getFiles({
            paging: {
              count: 10
            }
          });
        }
      }
     }
    );
  }

  angular
    .module("ngApp.cart", [
        "cart.controller",
        "ngApp.files",
        "ui.router.state"
    ])
    .config(cartConfig);
}
