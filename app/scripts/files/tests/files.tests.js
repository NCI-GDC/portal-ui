describe('Files:', function () {

  var FilesService, controller, httpBackend;

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.files', 'core.services', 'ngProgressLite'));

  beforeEach(module(function ($provide) {
      $provide.value('RestFullResponse', {});
  }));

  beforeEach(module(function ($provide) {
      $provide.value('AuthRestangular', {});
      $provide.value('config', {});
  }));

  // Injection of dependencies, $http will be mocked with $httpBackend
  beforeEach(inject(function ($httpBackend) {
    httpBackend = $httpBackend;
  }));
  describe('Directives: ', function(){
    describe("download-button", function(){
      var scope, $compile, element;

      beforeEach(inject(function ($injector) {

        $compile = $injector.get('$compile');
        var $rootScope = $injector.get('$rootScope');

        scope = $rootScope.$new();
        element = angular.element('<download-button data-files=fc.file data-copy="Download" data-classes="fa fa-download"><span ng-transclude></span></download-button>');
        $compile(element)(scope);

      }));
      afterEach(function () {
        scope.$destroy();
      });
      it('should compile', function () {
        scope.$digest();
        expect(element).to.be.an('object');
      });
      it('should contain fa-download class', function () {
        scope.$digest();
        expect(element.html()).to.have.string('fa fa-download');
      });
    });
  });

  describe('Service:', function () {

    it('should get all files', inject(function (FilesService) {
      sinon.spy(FilesService.ds, 'get');

      var fs = {hits: [], facets: [], pagination: {}};
      httpBackend.whenGET("/files?filters=%7B%7D&from=1&size=20&sort=file_name:asc").respond(fs);

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

    it('should process tsv files', inject(function (FilesService) {
      var regions = FilesService.processBED('chr1\nchr2\t123\t321\nchr3\t5');
      expect(regions).to.deep.equal({regions: ['chr1', 'chr2:123-321', 'chr3:5']});
    }));
  });
});
