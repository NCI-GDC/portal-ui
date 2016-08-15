module ngApp.components.header.directives {

  import IHeaderController = ngApp.components.header.controllers.IHeaderController;
  import ICartService = ngApp.cart.services.ICartService;

  /* @ngInject */
  function header(CartService: ICartService, $rootScope: ng.IRootScope): ng.IDirective {
    return {
      restrict: "E",
      templateUrl: "components/header/templates/header.html",
      controller: "HeaderController as hc",
      link: ($scope: ng.IScope) => {
        $scope.cartSize = CartService.files.length;
        $rootScope.$on('cart-update', () => {
          $scope.cartSize = CartService.files.length;
          $scope.$evalAsync();
        });
      }
    };
  }

  angular
      .module("header.directives", [])
      .directive("ngaHeader", header);
}
