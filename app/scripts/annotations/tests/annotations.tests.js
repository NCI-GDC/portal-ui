describe('Annotations:', function () {

  var AnnotationsService, controller, httpBackend;

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.annotations'));

  // Injection of dependencies, $http will be mocked with $httpBackend
  beforeEach(inject(function ($httpBackend) {
    httpBackend = $httpBackend;
  }));

  describe('Controller:', function () {
    it('should have annotations', inject(function ($controller) {
      // Which HTTP requests do we expect to occur, and how do we response?
      var annotations = [
        { id: 1 },
        { id: 2 }
      ];

      // Starting the controller
      var wc = $controller('AnnotationsController', {annotations: annotations});

      // We expect the controller to put the right value onto the scope
      expect(wc).to.have.property('annotations').with.length(2);
    }));
  });

  describe('Service:', function () {
    it('should get all annotations', inject(function (AnnotationsService) {
      sinon.spy(AnnotationsService.ds, 'get');

      var fs = {hits:[],facets:[],pagination:{}};
      httpBackend.whenGET("/annotations").respond(fs);

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
