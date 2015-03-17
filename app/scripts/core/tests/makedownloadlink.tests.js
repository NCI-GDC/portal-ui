describe("makeDownloadLink Filter:", function () {

  // Initialization of the AngularJS application before each test case
  beforeEach(module("ngApp.core"));

  it("should have a makeDownloadLink filter", inject(function ($filter) {
    expect($filter("makeDownloadLink")).not.to.be.null;
  }));

  it("should generate url when given list of ids", inject(function ($filter, $rootScope) {
    var ids = [
      "AAA",
      "BBB",
      "CCC"
    ];

    var apiUrl = "http://myapi";
    $rootScope.config = { 'api': apiUrl };
    var actual = $filter("makeDownloadLink")(ids, apiUrl);
    var expected = apiUrl + "/data/" + ids.join(",") + "?annotations=1";

    expect(actual).to.equal(expected);
  }));

});
