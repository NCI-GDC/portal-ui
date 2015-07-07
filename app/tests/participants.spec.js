'use strict';

var chai, chaiAsPromised, expect, ptor;

chai = require("chai");
chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
expect = chai.expect;

var CasesPage = require('./pages/cases.po.js');

describe('Cases:', function () {
  var page;

  before(function () {
    page = new CasesPage();
    ptor = protractor.getInstance();
  });

  it('should have a page title', function () {
    ptor.getTitle().then(function (text) {
      expect(text).to.equal("| GDC");
    });
  });

  it('should have a header', function () {
    page.header.getText().then(function (text) {
      expect(text).to.equal('Cases');
    });
  });

  describe('List:', function () {
    it('should show a list cases', function () {
      page.cases.then(function (rows) {
        expect(rows.length).to.equal(5);
      });

      page.case(0, 'id').getText().then(function (row) {
        expect(row).to.equal('P1');
      });
    });
  });
});
