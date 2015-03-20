describe('Projects:', function () {

  var httpBackend;

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.projects'));
  beforeEach(module('ngProgressLite'));


  // Injection of dependencies, $http will be mocked with $httpBackend
  beforeEach(inject(function ($httpBackend) {
    httpBackend = $httpBackend;

  }));

  describe('Controller:', function () {
    it('should have projects', inject(function ($rootScope, $controller) {
//      var scope = $rootScope.$new();
//      // Starting the controller
//      var wc = $controller('ProjectsController', {$scope: scope});
    }));
  });

  describe('Service:', function () {
    it('should get all projects', inject(function (ProjectsService) {
      sinon.spy(ProjectsService.ds, 'get');

      var fs = {data: { hits: [], facets: [], pagination: {} }};
      httpBackend.whenGET("/projects?filters=%7B%7D&from=1&size=20&sort=summary.participant_count:desc").respond(fs);

      ProjectsService.getProjects();
      httpBackend.flush();

      expect(ProjectsService.ds.get).to.have.been.calledOnce;
      expect(ProjectsService.ds.get).to.have.been.calledWith("");
    }));

    it('should get one project by id', inject(function (ProjectsService) {
      sinon.spy(ProjectsService.ds, 'get');

      var f = {data: {}};
      httpBackend.whenGET("/projects/1").respond(f);

      ProjectsService.getProject(1);
      httpBackend.flush();

      expect(ProjectsService.ds.get).to.have.been.calledOnce;
      expect(ProjectsService.ds.get).to.have.been.calledWith(1);
    }));
    
     it('title of table should match spec', inject(function (ProjectsService) {
       assert.equal(ProjectsService.getTableHeading(),'Participant count per data type');
    }));
  });
});
