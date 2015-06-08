describe('Tables:', function () {

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.components', 'location.services'));

  describe('TableSortController:', function () {

    beforeEach(inject(function ($window) {
      // Clear localStorage system to prevent oddities from tests.
      $window.localStorage.setItem("test-sort", "[]");
    }));

    it('should process sorting from url on load', inject(function ($rootScope, $controller, LocationService) {
      var scope = $rootScope.$new();
      scope.saved= [];
      scope.paging = {
        sort: "file_size:asc,file_name:desc",
      };
      scope.config = {
        title: 'test',
        headings:[{
          displayName: 'File Size',
          id:'file_size',
          sortable:true
        },
        {
          displayName: 'File Count',
          id: 'file_name',
          sortable: true
        }]
      };
      var wc = $controller('TableSortController', { $scope: scope, LocationService: LocationService });
      var fileSizeSort = _.find(wc.$scope.sortColumns, function(col) { return col.id === 'file_size'; });
      var fileNameSort = _.find(wc.$scope.sortColumns, function(col) { return col.id === 'file_name'; });
      expect(fileSizeSort.sort).to.equal(true);
      expect(fileNameSort.sort).to.equal(true);
      expect(fileSizeSort.order).to.equal("asc");
      expect(fileNameSort.order).to.equal("desc");
    }));

    it('should update sorting', inject(function ($rootScope, $controller, LocationService) {
      var scope = $rootScope.$new();
      scope.paging = {};
      scope.saved = [];
      scope.page = "test";
      scope.config = {
        title: "test",
        headings:[
          {
            displayName: 'File Size',
            id:'file_size',
            sortable: true
          },
          {
            displayName: 'File Name',
            id:'file_name',
            sortable: true
          }
        ]
      };


      var wc = $controller('TableSortController', { $scope: scope, LocationService: LocationService });
      wc.toggleSorting(wc.$scope.sortColumns[1]);

      var paging = LocationService.pagination()[wc.$scope.page];
      expect(paging.sort).to.equal("file_name:asc");
    }));

  });

});
