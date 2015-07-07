'use strict';

var CasePage = function () {
  browser.get('cases/P1');
};

CasePage.prototype = Object.create({}, {
  header: {
    get: function () {
      return element(by.css('h1'));
    }}
});

module.exports = CasePage;
