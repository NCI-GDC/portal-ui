describe('Pagination:', function () {

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.components', 'location.services'));

  describe('PagingController:', function () {

    it('should update url with paging changes with no update', inject(function ($rootScope, $controller, LocationService) {
      var scope = $rootScope.$new();
      scope.paging = {
        page: 1,
        size: 10,
        from: 1
      };
      scope.page = "test";

      var wc = $controller('PagingController', { $scope: scope, LocationService: LocationService });
      wc.refresh();

      var paging = LocationService.pagination()[scope.page];
      expect(paging.size).to.equal(10);
      expect(paging.from).to.equal(1);
    }));

    it('should update paging size', inject(function ($rootScope, $controller, LocationService) {
      var scope = $rootScope.$new();
      scope.paging = {
        page: 1,
        size: 10,
        from: 1
      };
      scope.page = "test";

      var wc = $controller('PagingController', { $scope: scope, LocationService: LocationService });
      var refreshCallBack = sinon.spy(wc, "refresh");
      wc.setCount({}, 25);
      expect(refreshCallBack).to.have.been.calledOnce;
      expect(scope.paging.size).to.equal(25);
    }));

  });

});
