describe('Participants:', function () {

  var ParticipantsService, controller, httpBackend;

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.participants'));

  // Injection of dependencies, $http will be mocked with $httpBackend
  beforeEach(inject(function ($httpBackend) {
    httpBackend = $httpBackend;
  }));

  describe('Service:', function () {
    it('should get all participants', inject(function (ParticipantsService) {
      sinon.spy(ParticipantsService.ds, 'get');

      var fs = {hits: [], facets: [], pagination: {}};
      httpBackend.whenGET("/participants?filters=%7B%7D&from=1&size=10").respond(fs);

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
