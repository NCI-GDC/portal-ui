'use strict';

var participantsRepeater = by.repeater('p in psc.participants.hits');

var ParticipantsPage = function () {
  browser.get('participants');
};

ParticipantsPage.prototype = Object.create({}, {
  header: {
    get: function () {
      return element(by.css('h1'));
    }
  },
  participants: {
    get: function () {
      return element.all(participantsRepeater);
    }
  },
  participant: {
    value: function (id, field) {
      return element(participantsRepeater.row(id).column('p.' + field));
    }
  }
});

module.exports = ParticipantsPage;