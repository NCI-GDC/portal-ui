describe("File Size Filter:", function () {

  // Initialization of the AngularJS application before each test case
  beforeEach(module("ngApp.components"));

  it("should have a size filter", inject(function ($filter) {
    expect($filter("size")).not.to.be.null;
  }));

  it("should filter GB when size >= 999500000 bytes ", inject(function ($filter) {
    var formattedSize;
    formattedSize= $filter("size")(1000000000);
    expect(formattedSize).to.equal("1.00 GB");
    formattedSize = $filter("size")(1220000000);
    expect(formattedSize).to.equal("1.22 GB");
    formattedSize = $filter("size")(10510000000);
    expect(formattedSize).to.equal("10.51 GB");
  }));

  it("should filter MB when 999500000 > size >= 999500 bytes ", inject(function ($filter) {
    var formattedSize;
    formattedSize = $filter("size")(1000000);
    expect(formattedSize).to.equal("1.00 MB");
    formattedSize = $filter("size")(1220000);
    expect(formattedSize).to.equal("1.22 MB");
    formattedSize = $filter("size")(999499999);
    expect(formattedSize).to.equal("999.50 MB");
  }));

  it("should filter KB when 999499 > size >= 1000 bytes ", inject(function ($filter) {
    var formattedSize;
    formattedSize = $filter("size")(1000);
    expect(formattedSize).to.equal("1.00 KB");
    formattedSize = $filter("size")(999499);
    expect(formattedSize).to.equal("999.50 KB");
  }));

  it("should filter B when size < 1000 bytes ", inject(function ($filter) {
    var formattedSize;
    formattedSize = $filter("size")(150);
    expect(formattedSize).to.equal("150 B");
    formattedSize = $filter("size")(999);
    expect(formattedSize).to.equal("999 B");
  }));

});
