describe('Projects:', function () {

  var httpBackend;

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.projects'));

  // Injection of dependencies, $http will be mocked with $httpBackend
  beforeEach(inject(function ($httpBackend) {
    httpBackend = $httpBackend;

  }));

  describe('Controller:', function () {
    it('should have projects', inject(function ($rootScope, $controller) {
      var scope = $rootScope.$new();
      // Which HTTP requests do we expect to occur, and how do we response?
      var projects = [
        { id: 1 },
        { id: 2 }
      ];

      // Starting the controller
      var wc = $controller('ProjectsController', {$scope: scope, projects: projects});

      // We expect the controller to put the right value onto the scope
      expect(wc).to.have.property('projects').with.length(2);
    }));
  });

  describe('Service:', function () {
    it('should get all projects', inject(function (ProjectsService) {
      sinon.spy(ProjectsService.ds, 'get');

      var fs = {hits: [], facets: [], pagination: {}};
      httpBackend.whenGET("/projects?filters=%7B%7D&from=1&size=10").respond(fs);

      ProjectsService.getProjects();
      httpBackend.flush();

      //expect(ProjectsService.ds.get).to.have.been.calledOnce;
      //expect(ProjectsService.ds.get).to.have.been.calledWith("");
    }));

    it('should get one project by id', inject(function (ProjectsService) {
      sinon.spy(ProjectsService.ds, 'get');

      var f = {};
      httpBackend.whenGET("/projects/1").respond(f);

      ProjectsService.getProject(1);
      httpBackend.flush();

      expect(ProjectsService.ds.get).to.have.been.calledOnce;
      expect(ProjectsService.ds.get).to.have.been.calledWith(1);
    }));
  });
});
