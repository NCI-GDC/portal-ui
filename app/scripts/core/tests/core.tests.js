describe('Core:', function () {

  var CoreService, httpBackend;

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.files', 'core.services', 'ngProgressLite'));

  beforeEach(module(function ($provide) {
      $provide.value('RestFullResponse', {});
      $provide.value('notify', {});
      $provide.value('config', {});
  }));

  // Injection of dependencies, $http will be mocked with $httpBackend
  beforeEach(inject(function ($httpBackend) {
    httpBackend = $httpBackend;
  }));

  describe('Service:', function () {

    it('should calculate fib', inject(function (CoreService) {
      expect(CoreService.fib(0)).to.equal(0);
      expect(CoreService.fib(1)).to.equal(1);
      expect(CoreService.fib(2)).to.equal(1);
      expect(CoreService.fib(3)).to.equal(2);
      expect(CoreService.fib(4)).to.equal(3);
      expect(CoreService.fib(5)).to.equal(5);
      expect(CoreService.fib(6)).to.equal(8);
    }));

  });
});
