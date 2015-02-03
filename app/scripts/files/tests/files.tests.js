describe('Files:', function () {

  var FilesService, controller, httpBackend;

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.files', 'core.services', 'ngProgressLite'));

  // Injection of dependencies, $http will be mocked with $httpBackend
  beforeEach(inject(function ($httpBackend) {
    httpBackend = $httpBackend;
  }));

  describe('Service:', function () {
    it('should get all files', inject(function (FilesService) {
      sinon.spy(FilesService.ds, 'get');

      var fs = {hits: [], facets: [], pagination: {}};
      httpBackend.whenGET("/files?filters=%7B%7D&from=1&size=10").respond(fs);

      FilesService.getFiles();
      httpBackend.flush();

      expect(FilesService.ds.get).to.have.been.calledOnce;
      expect(FilesService.ds.get).to.have.been.calledWith("");
    }));

    it('should get one file by id', inject(function (FilesService) {
      sinon.spy(FilesService.ds, 'get');

      var f = {};
      httpBackend.whenGET("/files/1").respond(f);

      FilesService.getFile(1);
      httpBackend.flush();

      expect(FilesService.ds.get).to.have.been.calledOnce;
      expect(FilesService.ds.get).to.have.been.calledWith(1);
    }));
  });
});
