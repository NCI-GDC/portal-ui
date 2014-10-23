describe("Date Filter:", function () {

  // Initialization of the AngularJS application before each test case
  beforeEach(module("ngApp.components"));

  it("should have a date filter", inject(function($filter) {
    expect($filter("date")).not.to.equal(null);
  }));

  it("should filter date with no given format", inject(function($filter) {
    var date = new Date();
    var formattedDate = $filter("date")(date.toString());
    var expectedDate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();

    expect(formattedDate).to.equal(expectedDate);
  }));

  it("should filter date with to given format", inject(function($filter) {
    var date = new Date();
    var formattedDate = $filter("date")(date.toString(), "DD");

    expect(formattedDate).to.equal(String(date.getDate()));
  }));

});
