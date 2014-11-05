describe('Header:', function () {

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.components', 'ngApp.cart'));

  describe('Controller:', function () {
    it('should get cart count', inject(function ($controller, CartService) {
      var wc = $controller('HeaderController', { gettextCatalog: {} });
      expect(wc.getNumCartItems()).to.equal(0);
      CartService.add({ id: 'AAA' });
      expect(wc.getNumCartItems()).to.equal(1);
    }));

  });

});
