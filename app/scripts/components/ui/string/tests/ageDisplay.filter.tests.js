describe("AgeDisplay Filter:", function() {
  beforeEach(module("ngApp.components"));

  it ("should display ages less than 365 days in days", inject(function ($filter) {
    var age1 = 20;
    expect($filter("ageDisplay")(age1)).to.equal(age1 + "ds");
    var age2 = 364;
    expect($filter("ageDisplay")(age2)).to.equal(age2 + "ds");
  }));

  it ("should display ages greather than or equal to 365 as YYys DDds", inject(function ($filter) {
    var age1 = 2248;
    expect($filter("ageDisplay")(age1)).to.equal("6ys 58ds");
  }));

  it ("should handle plurals/singulars properly", inject(function ($filter) {
    var age1 = 1;
    expect($filter("ageDisplay")(age1)).to.equal(age1 + "d");
    var age2 = 2;
    expect($filter("ageDisplay")(age2)).to.equal(age2 + "ds");

    var age3 = 366;
    expect($filter("ageDisplay")(age3)).to.equal("1y 1d");
    var age4 = 730;
    expect($filter("ageDisplay")(age4)).to.equal("2ys");
    var age5 = 731
    expect($filter("ageDisplay")(age5)).to.equal("2ys 1d");

  }));

});
