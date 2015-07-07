describe('Query:', function () {

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.query', 'ngProgressLite', "core.filters"));

  beforeEach(module(function ($provide) {
      $provide.value('RestFullResponse', {});
  }));

  beforeEach(module(function ($provide) {
      $provide.value('AuthRestangular', {});
  }));

  describe('Controller:', function () {
    it('should have cases', inject(function ($rootScope, $controller) {
      var scope = $rootScope.$new();
      var wc = $controller('QueryController', {$scope: scope, data: {tab: "cases"}});
    }));
    it('should have files', inject(function ($rootScope, $controller) {
      var scope = $rootScope.$new();
      var wc = $controller('QueryController', {$scope: scope, data: {tab: "files"}});
    }));
  });
});
