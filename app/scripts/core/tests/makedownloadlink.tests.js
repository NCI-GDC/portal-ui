describe("makeDownloadLink Filter:", function () {

  // Initialization of the AngularJS application before each test case
  beforeEach(module("ngApp.core"));

  it("should have a makeDownloadLink filter", inject(function ($filter) {
    expect($filter("makeDownloadLink")).not.to.be.null;
  }));

  it("should generate url with annotations and related files flags when given list of ids", inject(function ($filter, $rootScope) {
    var ids = [
      "AAA",
      "BBB",
      "CCC",
      ""
    ];

    var apiUrl = "http://myapi";
    $rootScope.config = { 'api': apiUrl };
    var actual = $filter("makeDownloadLink")(ids);
    var expected = apiUrl + "/data/AAA,BBB,CCC?annotations=1&related_files=1";

    expect(actual).to.equal(expected);
  }));

  it("should generate url without flags when flag params are false", inject(function ($filter, $rootScope) {
    var ids = [
      "AAA",
      "BBB",
      "CCC",
      ""
    ];

    var apiUrl = "http://myapi";
    $rootScope.config = { 'api': apiUrl };
    var actual = $filter("makeDownloadLink")(ids, false, false);
    var expected = apiUrl + "/data/AAA,BBB,CCC";
    expect(actual).to.equal(expected);

    actual = $filter("makeDownloadLink")(ids, true, false);
    expected = apiUrl + "/data/AAA,BBB,CCC?annotations=1";
    expect(actual).to.equal(expected);

    actual = $filter("makeDownloadLink")(ids, false, true);
    expected = apiUrl + "/data/AAA,BBB,CCC?related_files=1";
    expect(actual).to.equal(expected);

  }));

});
