'use strict';

var chai, chaiAsPromised, expect, ptor;

chai = require("chai");
chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
expect = chai.expect;

var WidgetsPage = require('./pages/widgets.po.js');

describe('Widgets:', function () {
  var page;

  before(function () {
    page = new WidgetsPage();
    ptor = protractor.getInstance();
  });

  it('should have a page title', function () {
    ptor.getTitle().then(function (text) {
      expect(text).to.equal("| GDC");
    });
  });

  it('should have a header', function () {
    page.header.getText().then(function (text) {
      expect(text).to.equal('Widgets');
    });
  });

  describe('List:', function () {
    it('should show a list widgets', function () {
      page.widgets.then(function (rows) {
        expect(rows.length).to.equal(5);
      });

      page.widget(0, 'id').getText().then(function (row) {
        expect(row).to.equal('PR1');
      });
    });
  });
});