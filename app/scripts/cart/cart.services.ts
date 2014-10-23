module ngApp.cart.services {

  export interface ICartService {}

  class CartService implements ICartService {
    /* @ngInject */
    constructor () {}
  }

  angular
    .module("cart.services", ["restangular"])
    .service("CartService", CartService);
}

