describe("Highlight Filter:", function() {
  beforeEach(module("ngApp.components"));

  it ("it should wrap bolded span if the query matches an item in the array",
    inject(function ($filter) {
      expect($filter("highlight")(["foo"], "foo")).to.equal(
        "<span class=\'bolded\'>foo</span>"
      );
    })
  );

  it ("it should never return an array", inject(function ($filter) {
    expect($filter("highlight")(["foo"])).to.equal("foo");
  }));
});
