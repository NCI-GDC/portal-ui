describe('Search:', function () {

  var SearchService, controller, httpBackend;

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.search'));

  // Injection of dependencies, $http will be mocked with $httpBackend
  beforeEach(inject(function ($httpBackend) {
    httpBackend = $httpBackend;
  }));

  describe('Controller:', function () {
    it('should have participants', inject(function ($controller) {
      // Which HTTP requests do we expect to occur, and how do we response?
      var search = [
        { 
          id: 1,
          number: "gerg23fg"
        },
        {
          id: 2,
          number: "gerg23fg"
        }
      ];

      // Starting the controller
      var wc = $controller('SearchController', {files: {}, participants: search});

      // We expect the controller to put the right value onto the scope
      expect(wc).to.have.property('participants').with.length(2);
    }));
    it('should have files', inject(function ($controller) {
      // Which HTTP requests do we expect to occur, and how do we response?
      var search = [
        {
          id: 1,
          number: "gerg23fg"
        },
        {
          id: 2,
          number: "gerg23fg"
        }
      ];

      // Starting the controller
      var wc = $controller('SearchController', {files: search, participants: {}});

      // We expect the controller to put the right value onto the scope
      expect(wc).to.have.property('files').with.length(2);
    }));
  });
});
