'use strict';

var casesRepeater = by.repeater('p in psc.cases.hits');

var CasesPage = function () {
  browser.get('cases');
};

CasesPage.prototype = Object.create({}, {
  header: {
    get: function () {
      return element(by.css('h1'));
    }
  },
  cases: {
    get: function () {
      return element.all(casesRepeater);
    }
  },
  case: {
    value: function (id, field) {
      return element(casesRepeater.row(id).column('p.' + field));
    }
  }
});

module.exports = CasesPage;
