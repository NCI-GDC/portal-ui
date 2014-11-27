describe("File Size Filter:", function () {

  // Initialization of the AngularJS application before each test case
  beforeEach(module("ngApp.components"));

  it("should have a size filter", inject(function ($filter) {
    expect($filter("size")).not.to.equal(null);
  }));

  it("should filter GB when size >= 1000000000 bytes ", inject(function ($filter) {
    var formattedSize = $filter("size")(10000000002);

    expect(formattedSize).to.equal("10.00 GB");
  }));

  it("should filter MB when size >= 1000000 bytes ", inject(function ($filter) {
    var formattedSize = $filter("size")(10000002);

    expect(formattedSize).to.equal("10.00 MB");
  }));

  it("should filter KB when size >= 1000 bytes ", inject(function ($filter) {
    var formattedSize = $filter("size")(10002);

    expect(formattedSize).to.equal("10.00 KB");
  }));

  it("should filter B when size < 1000 bytes ", inject(function ($filter) {
    var formattedSize = $filter("size")(102);

    expect(formattedSize).to.equal("102 B");
  }));

});
