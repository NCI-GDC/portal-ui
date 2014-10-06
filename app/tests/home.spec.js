'use strict';

var chai, chaiAsPromised, expect, ptor;

chai = require("chai");
chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
expect = chai.expect;

var HomePage = require('./pages/home.po.js');

describe('Home:', function () {
  var page;

  before(function () {
    page = new HomePage();
    ptor = protractor.getInstance();
  });

  it('should have a page title', function () {
    ptor.getTitle().then(function (text) {
      expect(text).to.equal("| GDC");
    });
  });

  it('should have a header', function () {
    page.header.getText().then(function(text){
      expect(text).to.equal('GDC Data Portal');
    });
  });
});