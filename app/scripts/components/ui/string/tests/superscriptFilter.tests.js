describe("Superscript Filter:", function () {
  // Initialization of the AngularJS application before each test case
  beforeEach(module("ngApp.components"));

  it("should have a superscript filter", inject(function ($filter) {
    expect($filter("superscript")).not.to.be.null;
  }));

  it("should transform caret exponent notation to superscript",
    inject(function ($filter) {
      var actual = $filter("superscript")("kg/m^2");
      expect(actual).to.eq("kg/m<sup>2</sup>");
    })
  );

  it("should return original if doesn't contain caret exponent",
    inject(function ($filter) {
      var actual = $filter("superscript")("foo");
      expect(actual).to.eq("foo");
    })
  );

});
