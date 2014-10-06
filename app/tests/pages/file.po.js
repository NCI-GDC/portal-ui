'use strict';

var FilePage = function () {
  browser.get('files/F1');
};

FilePage.prototype = Object.create({}, {
  header: {
    get: function () {
      return element(by.css('h1'));
    }}
});

module.exports = FilePage;