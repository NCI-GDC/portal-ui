'use strict';

var chai, chaiAsPromised, expect, ptor;

chai = require("chai");
chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
expect = chai.expect;

var ParticipantsPage = require('./pages/participants.po.js');

describe('Participants:', function () {
  var page;

  before(function () {
    page = new ParticipantsPage();
    ptor = protractor.getInstance();
  });

  it('should have a page title', function () {
    ptor.getTitle().then(function (text) {
      expect(text).to.equal("| GDC");
    });
  });

  it('should have a header', function () {
    page.header.getText().then(function (text) {
      expect(text).to.equal('Participants');
    });
  });

  describe('List:', function () {
    it('should show a list participants', function () {
      page.participants.then(function (rows) {
        expect(rows.length).to.equal(5);
      });

      page.participant(0, 'id').getText().then(function (row) {
        expect(row).to.equal('P1');
      });
    });
  });
});