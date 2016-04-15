describe('Summary Card Controller:', function () {

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.components', 'location.services'));
  beforeEach(module(function ($stateProvider) { $stateProvider.state('state-two', { url: '/' }); }));

  beforeEach(module(function ($provide) {
    $provide.value('AuthRestangular', {});
    $provide.value('config', {});
  }));

  describe('addFilters:', function () {

    it('should return undefined if no filters in config',
      inject(function ($rootScope, $controller, LocationService) {
        var scope = $rootScope.$new();
        scope.config = {};
        var summaryCard = $controller('SummaryCardController', {
          $scope: scope, LocationService: LocationService
        });
        expect(summaryCard.addFilters()).to.be.undefined;
      })
    );

    it('should be called correctly',
      inject(function ($rootScope, $controller, LocationService) {
        var scope = $rootScope.$new();
        scope.config = {
          default: { filters: function () {} }
        };
        var summaryCard = $controller('SummaryCardController', {
          $scope: scope, LocationService: LocationService
        });
        var addFiltersCallBack = sinon.spy(summaryCard, "addFilters");
        summaryCard.addFilters();
        expect(addFiltersCallBack).to.have.been.calledOnce;
      })
    );
  });
});
