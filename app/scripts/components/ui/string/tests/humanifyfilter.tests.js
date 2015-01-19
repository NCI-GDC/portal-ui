describe("Humanify Filter:", function() {
// Initialization of the AngularJS application before each test case
beforeEach(module("ngApp.components"));

var sampleString = "file.archive.archive_uuid";
var startsWith_ = "_missing";

it("should have a humanify filter", inject(function ($filter) {
  expect($filter("humanify")).not.to.equal(null);
}));

it("should split on . ", inject(function ($filter) {
  var humanified = $filter("humanify")(sampleString);
  expect(humanified).to.not.contain(".");
}));

it("should replace _ with spaces", inject(function ($filter) {
  var humanified = $filter("humanify")(sampleString);
  expect(humanified).to.not.contain("_");
}));

it("should remove _ if it is the first character", inject(function($filter) {
  var humanified2 = $filter("humanify")(startsWith_);
  expect(humanified2).to.not.contain("_");
  expect(humanified2[0]).to.not.equal(" ");
}));

it("capitalize the first letter", inject(function ($filter) {
  var humanified = $filter("humanify")(sampleString);
  var split = sampleString.split(".");
  expect(humanified[0]).to.equal(split[split.length-1].charAt(0).toUpperCase());
}));

});
