'use strict';

var ParticipantPage = function () {
  browser.get('cases/P1');
};

ParticipantPage.prototype = Object.create({}, {
  header: {
    get: function () {
      return element(by.css('h1'));
    }}
});

module.exports = ParticipantPage;