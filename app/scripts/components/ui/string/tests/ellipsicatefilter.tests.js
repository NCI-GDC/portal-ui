describe("Ellipsictae Filter:", function() {
  // Initialization of the AngularJS application before each test case
  beforeEach(module("ngApp.components"));

  var sampleString = "Cake liquorice bear claw wafer marzipan pudding. Cupcake chocolate bar dessert wafer. Lemon drops applicake pastry fruitcake pastry icing tart unerdwear.com cotton candy. Donut carrot cake apple pie apple pie jelly-o toffee oat cake cookie lollipop.";

  it("should have an ellipsicate filter", inject(function ($filter) {
    expect($filter("ellipsicate")).not.to.be.null;
  }));

  it("should truncate to default length+1 chars with no length param", inject(function ($filter) {
    var ellipsicated = $filter("ellipsicate")(sampleString);
    expect(ellipsicated).to.have.length(51);
  }));

  it("should truncate to 1 char (the length of …) with length 0", inject(function ($filter) {
    var ellipsicated = $filter("ellipsicate")(sampleString, 0);
    expect(ellipsicated).to.have.length(1);
  }));

  it("should truncate to the specified length + 1 (the length of …)", inject(function ($filter) {
    var length = Math.floor((Math.random() * 100) + 1);
    var ellipsicated = $filter("ellipsicate")(sampleString, length);
    expect(ellipsicated).to.have.length(length + 1);
  }));

  it("should not do anything if the string is shorter or equal to the than the truncate length", inject(function ($filter) {
    var fullstring = "Chocolate"
    var ellipsicated = $filter("ellipsicate")(fullstring, 50);
    expect(ellipsicated).to.have.length(fullstring.length);
    ellipsicated = $filter("ellipsicate")(fullstring, fullstring.length);
    expect(ellipsicated).to.have.length(fullstring.length);
  }));

});
