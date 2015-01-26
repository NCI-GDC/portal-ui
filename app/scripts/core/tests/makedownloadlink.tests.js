describe("makeDownloadLink Filter:", function () {

  // Initialization of the AngularJS application before each test case
  beforeEach(module("ngApp.core"));

  it("should have a makeDownloadLink filter", inject(function ($filter) {
    expect($filter("makeDownloadLink")).not.to.be.null;
  }));

  it("should generate url when given list of ids", inject(function ($filter) {
    var ids = [
      "AAA",
      "BBB",
      "CCC"
    ];

    var actual = $filter("makeDownloadLink")(ids);
    var expected = "/api/data/" + ids.join(",");

    expect(actual).to.equal(expected);
  }));

});
