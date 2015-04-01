describe('Tables:', function () {

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.components', 'location.services'));

  describe('TableSortController:', function () {

    it('should process sorting from url on load', inject(function ($rootScope, $controller, LocationService) {
      var scope = $rootScope.$new();
      scope.paging = {
        sort: "file_size:asc,file_name:desc"
      };
      scope.config = {
        headings:[{
          name: 'File Size',
          id:'file_size',
          sortable:true
        },
        {
          name: 'File Count',
          id: 'file_name',
          sortable: true
        }]
      };

      var wc = $controller('TableSortController', { $scope: scope, LocationService: LocationService });
      expect(wc.$scope.sortColumns[0].sort).to.equal(true);
      expect(wc.$scope.sortColumns[1].sort).to.equal(true);
      expect(wc.$scope.sortColumns[0].order).to.equal("asc");
      expect(wc.$scope.sortColumns[1].order).to.equal("desc");
    }));

    it('should update sorting', inject(function ($rootScope, $controller, LocationService) {
      var scope = $rootScope.$new();
      scope.paging = {};
      scope.page = "test";
      scope.config = {
        headings:[
          {
            name: 'File Size',
            id:'file_size',
            sortable: true
          },
          {
            name: 'File Name',
            id:'file_name',
            sortable: true
          }
        ]
      };


      var wc = $controller('TableSortController', { $scope: scope, LocationService: LocationService });
      wc.toggleSorting(wc.$scope.sortColumns[1]);

      var paging = LocationService.pagination()[wc.$scope.page];

      expect(paging.sort).to.equal("file_size:asc,file_name:asc");
    }));

  });

});
