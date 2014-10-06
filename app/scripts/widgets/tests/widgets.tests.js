describe('Widgets:', function () {

  var WidgetsService, controller, httpBackend;

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.widgets'));

  // Injection of dependencies, $http will be mocked with $httpBackend
  beforeEach(inject(function ($httpBackend) {
    httpBackend = $httpBackend;
  }));

  describe('Controller:', function () {
    it('should have widgets', inject(function ($controller) {
      // Which HTTP requests do we expect to occur, and how do we response?
      var widgets = [
        {"name": "First User"},
        {"name": "Second User"}
      ];

      // Starting the controller
      var wc = $controller('WidgetsController', {widgets: widgets});

      // We expect the controller to put the right value onto the scope
      expect(wc).to.have.property('widgets').with.length(2);
    }));
  });

  describe('Service:', function () {
    it('should get all widgets', inject(function (WidgetsService) {
      sinon.spy(WidgetsService.ds, 'get');

      var ws = {hits:[],facets:[],pagination:{}};
      httpBackend.whenGET("/widgets").respond(ws);

      WidgetsService.getWidgets();
      httpBackend.flush();

      expect(WidgetsService.ds.get).to.have.been.calledOnce;
      expect(WidgetsService.ds.get).to.have.been.calledWith("");
    }));

    it('should get one widget by id', inject(function (WidgetsService) {
      sinon.spy(WidgetsService.ds, 'get');

      var w = {};
      httpBackend.whenGET("/widgets/1").respond(w);

      WidgetsService.getWidget(1);
      httpBackend.flush();

      expect(WidgetsService.ds.get).to.have.been.calledOnce;
      expect(WidgetsService.ds.get).to.have.been.calledWith(1);
    }));
  });
});
