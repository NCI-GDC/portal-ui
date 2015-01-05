describe("Date Filter:", function () {

  // Initialization of the AngularJS application before each test case
  beforeEach(module("ngApp.components"));

  it("should have a date filter", inject(function ($filter) {
    expect($filter("date")).not.to.equal(null);
  }));

  it("should filter date with no given format", inject(function ($filter) {
    var date = new Date();
    var day = (date.getDate() < 10 ? '0' : '') + date.getDate();
    var month = (date.getMonth() < 10 ? '0' : '') + (date.getMonth() + 1);
    var formattedDate = $filter("date")(date.toString());
    var expectedDate = month + "/" + day + "/" + date.getFullYear();

    expect(formattedDate).to.equal(expectedDate);
  }));

  it("should filter date when given a format", inject(function ($filter) {
    var date = new Date();
    var day = (date.getDate() < 10 ? '0' : '') + date.getDate();
    var formattedDate = $filter("date")(date.toString(), "DD");

    expect(formattedDate).to.equal(day);
  }));

});
