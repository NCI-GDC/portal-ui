describe('Annotations:', function () {

  var AnnotationsService, controller, httpBackend;

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.annotations', 'core.services', 'ngProgressLite'));
  beforeEach(module(function ($provide) {
     $provide.value('AuthRestangular', {});
     $provide.value('config', {});
  }));

  // Injection of dependencies, $http will be mocked with $httpBackend
  beforeEach(inject(function ($httpBackend) {
    httpBackend = $httpBackend;
  }));

  describe('Service:', function () {
    it('should get all annotations', inject(function (AnnotationsService) {
      sinon.spy(AnnotationsService.ds, 'get');

      var fs = {hits: [], facets: [], pagination: {}};
      httpBackend.whenGET("/annotations?filters=%7B%7D&from=1&size=20&sort=entity_type:asc").respond(fs);

      AnnotationsService.getAnnotations();
      httpBackend.flush();

      expect(AnnotationsService.ds.get).to.have.been.calledOnce;
      expect(AnnotationsService.ds.get).to.have.been.calledWith("");
    }));

    it('should get one annotation by id', inject(function (AnnotationsService) {
      sinon.spy(AnnotationsService.ds, 'get');

      var f = {};
      httpBackend.whenGET("/annotations/1").respond(f);

      AnnotationsService.getAnnotation(1);
      httpBackend.flush();

      expect(AnnotationsService.ds.get).to.have.been.calledOnce;
      expect(AnnotationsService.ds.get).to.have.been.calledWith(1);
    }));
  });
});
