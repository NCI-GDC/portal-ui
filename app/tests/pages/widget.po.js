'use strict';

var WidgetPage = function () {
  browser.get('widgets/PR1');
};

WidgetPage.prototype = Object.create({}, {
  header: {
    get: function () {
      return element(by.css('h1'));
    }}
});

module.exports = WidgetPage;