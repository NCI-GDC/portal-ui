'use strict';

var filesRepeater = by.repeater('f in fsc.files.hits');

var FilesPage = function () {
  browser.get('files');
};

FilesPage.prototype = Object.create({}, {
  header: {
    get: function () {
      return element(by.css('h1'));
    }
  },
  files: {
    get: function () {
      return element.all(filesRepeater);
    }
  },
  file: {
    value: function (id, field) {
      return element(filesRepeater.row(id).column('f.' + field));
    }
  }
});

module.exports = FilesPage;