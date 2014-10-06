'use strict';

var chai, chaiAsPromised, expect, ptor;

chai = require("chai");
chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
expect = chai.expect;

var FilesPage = require('./pages/files.po.js');

describe('Files:', function () {
  var page;

  before(function () {
    page = new FilesPage();
    ptor = protractor.getInstance();
  });

  it('should have a page title', function () {
    ptor.getTitle().then(function (text) {
      expect(text).to.equal("| GDC");
    });
  });

  it('should have a header', function () {
    page.header.getText().then(function (text) {
      expect(text).to.equal('Files');
    });
  });

  describe('List:', function () {
    it('should show a list files', function () {
      page.files.then(function (rows) {
        expect(rows.length).to.equal(5);
      });

      page.file(0, 'id').getText().then(function (row) {
        expect(row).to.equal('F1');
      });
    });
  });
});