describe('Cases:', function () {

  var CasesService, controller, httpBackend;

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.cases', 'core.services', 'ngProgressLite'));

  beforeEach(module(function ($provide) {
     $provide.value('AuthRestangular', {});
  }));

  // Injection of dependencies, $http will be mocked with $httpBackend
  beforeEach(inject(function ($httpBackend) {
    httpBackend = $httpBackend;
  }));

  describe('Service:', function () {
    it('should get all cases', inject(function (CasesService) {
      sinon.spy(CasesService.ds, 'get');

      var fs = {hits: [], facets: [], pagination: {}};
      httpBackend.whenGET("/cases?filters=%7B%7D&from=1&size=20&sort=case_id:asc").respond(fs);

      CasesService.getCases();
      httpBackend.flush();

      expect(CasesService.ds.get).to.have.been.calledOnce;
      expect(CasesService.ds.get).to.have.been.calledWith("");
    }));

    it('should get one case by id', inject(function (CasesService) {
      sinon.spy(CasesService.ds, 'get');

      var f = {};
      httpBackend.whenGET("/cases/1").respond(f);

      CasesService.getCase(1);
      httpBackend.flush();

      expect(CasesService.ds.get).to.have.been.calledOnce;
      expect(CasesService.ds.get).to.have.been.calledWith(1);
    }));
  });
});
