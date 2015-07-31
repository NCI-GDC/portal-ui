describe("makeFilter Filter:", function () {
  var baseFields = [
    {
      "field": "participants.bcr_patient_uuid",
      "value":"b64bfca1-033c-4501-a900-103ac105c084"
    },
    {
      "field":"files.data_type",
      "value":"DNA methylation"
    }
  ];

  var expectedBase = {
    "op": "and",
    "content":[
      {
        "op": "in",
        "content": {
          "field": "participants.bcr_patient_uuid",
          "value":["b64bfca1-033c-4501-a900-103ac105c084"]
        }
      },
      {
        "op": "in",
        "content": {
          "field": "files.data_type",
          "value":["DNA methylation"]
        }
      }
    ]
  };

  // Initialization of the AngularJS application before each test case
  beforeEach(module("ngApp.core"));

  it("should have a makeFilter filter", inject(function ($filter) {
    expect($filter("makeFilter")).not.to.be.null;
  }));

  it("should not double escape if noEscape is true", inject(function ($filter) {
    var actual = $filter("makeFilter")(baseFields, true);
    var expected = JSON.stringify(expectedBase);

    expect(actual).to.equal(expected);
  }));

  it("should double escape if noEscape is false", inject(function ($filter) {
    var actual = $filter("makeFilter")(baseFields);
    var expected = JSON.stringify(JSON.stringify(expectedBase));

    expect(actual).to.equal(expected);
  }));

});
