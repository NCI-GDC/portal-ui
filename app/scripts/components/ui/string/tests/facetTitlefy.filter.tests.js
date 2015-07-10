describe("FacetTitlefy Filter:", function () {
  // Initialization of the AngularJS application before each test case
  beforeEach(module("ngApp.components"));

  it("should have a facetTitlefy filter", inject(function ($filter) {
    expect($filter("facetTitlefy")).not.to.be.null;
  }));

  it("should capitalize", inject(function ($filter) {
    var humanified = $filter("facetTitlefy")("foo bar");
    expect(humanified).to.equal("Foo Bar");
  }));

  it("should not capitalize 'miRNA'", inject(function ($filter) {
    var humanified = $filter("facetTitlefy")("miRNA");
    expect(humanified).to.equal("miRNA");
  }));

  it("should trim", inject(function ($filter) {
    var humanified = $filter("facetTitlefy")("  foo  ");
    expect(humanified).to.equal("Foo");
  }));

  describe("should format facets", function () {
    it("should put a space between a lowercase char followed by an uppercase char", inject(function ($filter) {
      var humanified = $filter("facetTitlefy")("FooBar");
      expect(humanified).to.eq("Foo Bar");
    }));

    it("should split on '.'", inject(function ($filter) {
      var humanified = $filter("facetTitlefy")("foo.bar");
      expect(humanified).to.equal("Foo Bar");
    }));

    it("chop to last biospec entity", inject(function ($filter) {
      var n = $filter("facetTitlefy")(" samples.portions.analytes.aliquots.center.namespace");
      expect(n).to.equal("Aliquots Center Namespace");
    }));

  });

});
