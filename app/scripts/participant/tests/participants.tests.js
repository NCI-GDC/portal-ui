describe('Participants:', function () {

  var ParticipantsService, controller, httpBackend;

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.participants'));

  // Injection of dependencies, $http will be mocked with $httpBackend
  beforeEach(inject(function ($httpBackend) {
    httpBackend = $httpBackend;
  }));

  describe('Controller:', function () {
    it('should have participants', inject(function ($controller) {
      // Which HTTP requests do we expect to occur, and how do we response?
      var participants = [
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
      var wc = $controller('ParticipantsController', {participants: participants});

      // We expect the controller to put the right value onto the scope
      expect(wc).to.have.property('participants').with.length(2);
    }));
  });

  describe('Service:', function () {
    it('should get all participants', inject(function (ParticipantsService) {
      sinon.spy(ParticipantsService.ds, 'get');

      var fs = {hits: [], facets: [], pagination: {}};
      httpBackend.whenGET("/participants").respond(fs);

      ParticipantsService.getParticipants();
      httpBackend.flush();

      expect(ParticipantsService.ds.get).to.have.been.calledOnce;
      expect(ParticipantsService.ds.get).to.have.been.calledWith("");
    }));

    it('should get one participant by id', inject(function (ParticipantsService) {
      sinon.spy(ParticipantsService.ds, 'get');

      var f = {};
      httpBackend.whenGET("/participants/1").respond(f);

      ParticipantsService.getParticipant(1);
      httpBackend.flush();

      expect(ParticipantsService.ds.get).to.have.been.calledOnce;
      expect(ParticipantsService.ds.get).to.have.been.calledWith(1);
    }));
  });
});
