describe('Query:', function () {

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.query'));
  beforeEach(module('ngProgressLite'));


  describe('Controller:', function () {
    it('should have participants', inject(function ($rootScope, $controller) {
      var scope = $rootScope.$new();
      var wc = $controller('QueryController', {$scope: scope, data: {tab: "participants"}});
    }));
    it('should have files', inject(function ($rootScope, $controller) {
      var scope = $rootScope.$new();
      var wc = $controller('QueryController', {$scope: scope, data: {tab: "files"}});
    }));
  });
});
