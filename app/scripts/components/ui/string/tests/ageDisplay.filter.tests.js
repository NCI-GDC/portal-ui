describe("AgeDisplay Filter:", function() {
  beforeEach(module("ngApp.components"));

  var age = 20

  it ("it should display '--' for undefined days", inject(function ($filter) {
    expect($filter("ageDisplay")(undefined)).to.equal('--');
  }));

  it ("it should display supplied default value undefined days when default value supplied", inject(function ($filter) {
    expect($filter("ageDisplay")(undefined, false, 0)).to.equal(0);
  }));

  it ("should display ages less than 365 days in days", inject(function ($filter) {
    expect($filter("ageDisplay")(age)).to.equal(age + " days");
    age = 364;
    expect($filter("ageDisplay")(age)).to.equal(age + " days");
  }));

  it ("should display ages greather than or equal to 365 as YYys DDds", inject(function ($filter) {
    age = 2248;
    expect($filter("ageDisplay")(age)).to.equal("6 years 57 days");
    age = 2249;
    expect($filter("ageDisplay")(age)).to.equal("6 years 58 days");
  }));

  it ("should handle plurals/singulars properly", inject(function ($filter) {
    age = 1;
    expect($filter("ageDisplay")(age)).to.equal(age + " day");
    age = 2;
    expect($filter("ageDisplay")(age)).to.equal(age + " days");
    age = 366;
    expect($filter("ageDisplay")(age)).to.equal("1 year 1 day");
    age = 729;
    expect($filter("ageDisplay")(age)).to.equal("1 year 364 days");
    age = 730;
    expect($filter("ageDisplay")(age)).to.equal("2 years");
    age = 730.5;
    expect($filter("ageDisplay")(age)).to.equal("2 years");
    age = 731;
    expect($filter("ageDisplay")(age)).to.equal("2 years 1 day");
  }));

  it ("should display years only without units for that option", inject(function ($filter) {
    age = 1;
    expect($filter("ageDisplay")(age, true)).to.equal("0");
    age = 2;
    expect($filter("ageDisplay")(age, true)).to.equal("0");
    age = 366;
    expect($filter("ageDisplay")(age, true)).to.equal("1");
    age = 729;
    expect($filter("ageDisplay")(age, true)).to.equal("1");
    age = 730;
    expect($filter("ageDisplay")(age, true)).to.equal("2");
    age = 730.5;
    expect($filter("ageDisplay")(age, true)).to.equal("2");
    age = 731;
    expect($filter("ageDisplay")(age, true)).to.equal("2");
  }));



});
