describe("Humanify Filter:", function () {
  // Initialization of the AngularJS application before each test case
  beforeEach(module("ngApp.components"));

  it("should have a humanify filter", inject(function ($filter) {
    expect($filter("humanify")).not.to.be.null;
  }));
  
  it("should capitalize words by default", inject(function ($filter) {
    var humanified = $filter("humanify")("foo bar");
    expect(humanified).to.equal("Foo Bar");
  }));
  
  it("should not capitalize words if the second arg is false", inject(function ($filter) {
    var humanified = $filter("humanify")("foo bar", false);
    expect(humanified).to.equal("foo bar");
  }));
  
  it("should not capitalize 'miRNA'", inject(function ($filter) {
    var humanified = $filter("humanify")("miRNA");
    expect(humanified).to.equal("miRNA");
  }));
  
  it("should trim", inject(function ($filter) {
    var humanified = $filter("humanify")("  foo  ");
    expect(humanified).to.equal("Foo");
  }));
  
  describe("if given a string that is a facet (third arg is true)", function () {
    it("should put a space between a lowercase char followed by an uppercase char", inject(function ($filter) {
      var humanified = $filter("humanify")("fooBar", false, true);
      expect(humanified).to.eq("foo Bar");
    }));
    
    it("should split on '.'", inject(function ($filter) {
      var humanified = $filter("humanify")("foo.bar", false, true);
      expect(humanified).to.equal("foo bar");
    }));
  });
  
  describe("if given a string that is not a facet", function () {
    it("should split on '.' and use the last element", inject(function ($filter) { 
      var humanified = $filter("humanify")("foo.bar");
      expect(humanified).to.eq("Bar");
    }));
    
    it("should use the last two elements if the last equals 'name'", inject(function ($filter) {
      var humanified = $filter("humanify")("foo.bar.name");
      expect(humanified).to.eq("Bar Name");
    }));
     
    it("should replace '_' with a space", inject(function ($filter) {
      var humanified = $filter("humanify")("_foo_bar_");
      expect(humanified).to.eq("Foo Bar");
    })); 
  });

  it("should return '--' if null, undefined or empty string", inject(function ($filter) {
    var humanified = $filter("humanify")(undefined);
    expect(humanified).to.equal("--");
    humanified = $filter("humanify")(null);
    expect(humanified).to.equal("--");
    humanified = $filter("humanify")("");
    expect(humanified).to.equal("--");
  }));

  it("should return itself if not a string, null or undefined", inject(function ($filter) {
    var humanified = $filter("humanify")(1);
    expect(humanified).to.equal(1);
    var humanified = $filter("humanify")([]);
    expect(humanified).to.be.an('array');
    var humanified = $filter("humanify")(true);
    expect(humanified).to.equal(true);
  }));
});
