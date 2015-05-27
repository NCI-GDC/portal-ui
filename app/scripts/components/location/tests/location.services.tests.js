describe("Location Service", function () {

  // Initialization of the AngularJS application before each test case
  beforeEach(module("components.location"));

  it("should return path", inject(function ($location, LocationService) {
    var path = "/some/path";
    $location.path(path);
    expect($location.path()).to.eq(path);
    expect(LocationService.path()).to.eq(path);
  }));
  
  describe("Search", function () {
    it("should return search", inject(function ($location, LocationService) {
      var search = {"query": "A = B", "filters": '{"a": 1}'};
      $location.search(search);
      expect($location.search()).to.eql(search);
      expect(LocationService.search()).to.eql(search);
    }));
    it("should clear search", inject(function ($location, LocationService) {
      var search = {"query": "A = B", "filters": '{"a": 1}'};
      $location.search(search);
      expect($location.search()).to.eql(search);
      LocationService.clear();
      expect($location.search()).to.eql({});
    }));
    it("should set search", inject(function ($location, LocationService) {
      var search = {"query": "A = B", "filters": '{"a": 1}'};
      LocationService.setSearch(search);
      $location.search(search);
    }));
    it("should handle keys with empty string values", inject(function ($location, LocationService) {
      var search1 = {"query": "", "filters": '{"a": 1}'};
      var search2 = {"filters": '{"a": 1}'};
      LocationService.setSearch(search1);
      expect($location.search()).to.eql(search2);
    }));
    it("should handle keys with empty object values", inject(function ($location, LocationService) {
      var search1 = {"query": "A = B", "filters": {}};
      var search2 = {"query": "A = B"};
      LocationService.setSearch(search1);
      expect($location.search()).to.eql(search2);
    }));
    it("should handle keys with empty object as strings values", inject(function ($location, LocationService) {
      var search1 = {"query": "A = B", "filters": "{}"};
      var search2 = {"query": "A = B"};
      LocationService.setSearch(search1);
      expect($location.search()).to.eql(search2);
    }));
  });
  describe("Filters", function () {
    it("should return filters", inject(function ($location, LocationService) {
      var search = {"query": "A = B", "filters": '{"a": 1}'};
      $location.search(search);
      expect($location.search()).to.eql(search);
      expect(LocationService.filters()).to.eql(angular.fromJson(search.filters));
    }));
    it("should return empty object when filters missing", inject(function ($location, LocationService) {
      var search = {"query": "A = B"};
      $location.search(search);
      expect($location.search()).to.eql(search);
      expect(LocationService.filters()).to.eql({});
    }));
    it("should set filters", inject(function ($location, LocationService) {
      var f = {"a": 1};
      var s = {"filters": '{"a":1}'};
      LocationService.setFilters(f);
      var filters = $location.search();
      $location.search(s);
      var search = $location.search();
      expect(filters).to.eql(search);
    }));
    it("should remove filters", inject(function ($location, LocationService) {
      var search = {"query": "A = B", "filters": '{"a": 1}'};
      var search2 = {"query": "A = B"};
      $location.search(search);
      expect($location.search()).to.eql(search);
      LocationService.setFilters();
      expect($location.search()).to.eql(search2);
    }));
  });
  describe("Query", function () {
    it("should return query", inject(function ($location, LocationService) {
      var search = {"query": "A = B", "filters": '{"a": 1}'};
      $location.search(search);
      expect($location.search()).to.eql(search);
      expect(LocationService.query()).to.eql(search.query);
    }));
    it("should return empty string when query missing", inject(function ($location, LocationService) {
      var search = {"filters": '{"a": 1}'};
      $location.search(search);
      expect($location.search()).to.eql(search);
      expect(LocationService.query()).to.eql("");
    }));
    it("should set query", inject(function ($location, LocationService) {
      var q = "A = B";
      var s = {"query": q};
      LocationService.setQuery(q);
      var query = $location.search();
      $location.search(s);
      var search = $location.search();
      expect(query).to.eql(search);
    }));
    it("should remove query", inject(function ($location, LocationService) {
      var search = {"query": "A = B", "filters": '{"a": 1}'};
      var search2 = {"filters": '{"a": 1}'};
      $location.search(search);
      expect($location.search()).to.eql(search);
      LocationService.setQuery();
      expect($location.search()).to.eql(search2);
    }));
  });
  describe("Filter -> Query", function () {
    it("should convert filters into query string", inject(function ($location, LocationService) {
      var filters = {
        op:"and", 
        content:[
          {
            op:"in", 
            content: {
              field:"field",
              value: [1,2]
            }
          },
          {
            op:"in", 
            content: {
              field:"field2",
              value: [3,4]
            }
          }
        ]
      };
      var query = "field in [1,2] and field2 in [3,4]";
      expect(LocationService.filter2query(filters)).to.eq(query);
    }));
    it("should handle <= >= op", inject(function ($location, LocationService) {
      var filters = {
        op:"and", 
        content:[
          {
            op:">=", 
            content: {
              field:"field",
              value: [11]
            }
          },
          {
            op:"<=", 
            content: {
              field:"field2",
              value: [25]
            }
          }
        ]
      };
      var query = "field >= 11 and field2 <= 25";
      expect(LocationService.filter2query(filters)).to.eq(query);
    }));
  });
  describe("Pagination", function () {
    it("should return pagination", inject(function ($location, LocationService) {
      var search = {"query": "A = B", "pagination": '{"a": 1}'};
      $location.search(search);
      expect($location.search()).to.eql(search);
      expect(LocationService.pagination()).to.eql(angular.fromJson(search.pagination));
    }));
    it("should return empty object when pagination missing", inject(function ($location, LocationService) {
      var search = {"query": "A = B"};
      $location.search(search);
      expect($location.search()).to.eql(search);
      expect(LocationService.pagination()).to.eql({});
    }));
    it("should set pagination", inject(function ($location, LocationService) {
      var p = {"a":1};
      var s = {"pagination": '{"a":1}'};
      LocationService.setPaging(p);
      var pagination = $location.search();
      $location.search(s);
      var search = $location.search();
      expect(pagination).to.eql(search);
    }));
    it("should clear pagination when given empty object", inject(function ($location, LocationService) {
      var search = {"query": "A = B", "pagination": '{"a": 1}'};
      var search2 = {"query": "A = B"};
      $location.search(search);
      expect($location.search()).to.eql(search);
      LocationService.setPaging({});
      expect($location.search()).to.eql(search2);
    }));
  });
});
