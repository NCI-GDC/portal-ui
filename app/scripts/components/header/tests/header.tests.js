describe('Header:', function () {

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.components', 'ngApp.cart', 'ngProgressLite', 'ui.bootstrap'));

  beforeEach(module(function ($provide) {
     $provide.value('AuthRestangular', {});
     $provide.value('config', {});
  }));

  var scope, $compile, httpBackend;
  beforeEach(module('header.directives'));

  beforeEach(module(function ($provide) {
    $provide.value('$stateParams', {});
  }));

  beforeEach(inject(function ($injector) {
    $compile = $injector.get('$compile');
    var $rootScope = $injector.get('$rootScope');

    scope = $rootScope.$new();
  }));

  beforeEach(inject(function ($httpBackend, $window) {
    httpBackend = $httpBackend;
    // Clear localStorage system to prevent oddities from tests.
    $window.localStorage.setItem("gdc-cart-items", []);
  }));

  afterEach(function () {
    scope.$destroy();
  });

  describe('Directive:', function () {
    it('should exist', function () {
      var el = $compile('<nga-header></nga-header>')(scope);
      expect(el).to.exist;
    });

    it('should get cart count', inject(function(CartService, $httpBackend) {
      httpBackend.whenGET("components/header/templates/header.html").respond(200, '');

      var el = $compile('<nga-header></nga-header>')(scope);
      scope.$digest();
      httpBackend.flush();

      expect(el.scope().cartSize).to.equal(0);
      CartService.add({ id: 'AAA' });
      expect(el.scope().cartSize).to.equal(1);
      CartService.add({ id: 'BBB' });
      expect(el.scope().cartSize).to.equal(2);
      CartService.removeAll();
      expect(el.scope().cartSize).to.equal(0);
    }));

  });

});
