describe('Header:', function () {

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.components', 'ngApp.cart', 'ngProgressLite', 'ui.bootstrap'));

  beforeEach(module(function ($provide) {
     $provide.value('AuthRestangular', {});
     $provide.value('config', {});
  }));

  describe('Controller:', function () {
    beforeEach(inject(function ($window) {
      // Clear localStorage system to prevent oddities from tests.
      $window.localStorage.setItem("gdc-cart-items", []);
    }));

    it('should get cart count', inject(function ($controller, CartService) {
      var wc = $controller('HeaderController', { gettextCatalog: {} });
      expect(wc.getNumCartItems()).to.equal(0);
      CartService.add({ id: 'AAA', participantId: [] });
      expect(wc.getNumCartItems()).to.equal(1);
    }));

  });

});
