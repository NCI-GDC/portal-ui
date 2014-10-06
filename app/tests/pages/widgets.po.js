'use strict';

var widgetsRepeater = by.repeater('w in wsc.widgets.hits');

var WidgetsPage = function () {
  browser.get('widgets');
};

WidgetsPage.prototype = Object.create({}, {
  header: {
    get: function () {
      return element(by.css('h1'));
    }},
  widgets: {
    get: function () {
      return element.all(widgetsRepeater);
    }},
  widget: {
    value: function (id, field) {
      return element(widgetsRepeater.row(id).column('w.' + field));
    }}
});

module.exports = WidgetsPage;