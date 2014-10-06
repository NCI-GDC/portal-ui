'use strict';

var HomePage = function () {
  browser.get('');
};

HomePage.prototype = Object.create({}, {
  header: {
    get: function () {
      return element(by.css('h1'));
    }}
});

module.exports = HomePage;