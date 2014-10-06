describe('Files:', function () {

  var FilesService, controller, httpBackend;

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.files'));

  // Injection of dependencies, $http will be mocked with $httpBackend
  beforeEach(inject(function ($httpBackend) {
    httpBackend = $httpBackend;
  }));

  describe('Controller:', function () {
    it('should have files', inject(function ($controller) {
      // Which HTTP requests do we expect to occur, and how do we response?
      var files = [
        { 
          id: 1,
          uuid: "gerg43g34g-fberg-233223-g2g3r-gerg23fg"
        },
        {
          id: 2,
          uuid: "gerg43g34g-fberg-233223-g2g3r-gerg23fg"
        }
      ];

      // Starting the controller
      var wc = $controller('FilesController', {files: files});

      // We expect the controller to put the right value onto the scope
      expect(wc).to.have.property('files').with.length(2);
    }));
  });

  describe('Service:', function () {
    it('should get all files', inject(function (FilesService) {
      sinon.spy(FilesService.ds, 'get');

      var fs = {hits:[],facets:[],pagination:{}};
      httpBackend.whenGET("/files").respond(fs);

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
