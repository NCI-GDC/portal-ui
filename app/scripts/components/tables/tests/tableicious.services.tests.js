describe('Tableicious:', function () {
  var headings;

  beforeEach(module('tableicious.services'));
  beforeEach(function () {
    headings = [
      {},
      { children: [ {} ] },
      { hidden: true }
    ];
  });

  describe('refresh:', function () {
    it('should exist', inject(function (TableiciousService) {
      expect(TableiciousService.refresh).to.exist;
    }));
  });

  describe('rejectHidden:', function () {
    it('should remove objects with hidden: true',
      inject(function (TableiciousService) {
        expect(TableiciousService.rejectHidden(headings)).to.have.lengthOf(2);
      })
    );
  });

  describe('flattenChildren:', function () {
    it('should flatten children if they exist and discard the rest',
      inject(function (TableiciousService) {
        expect(TableiciousService.flattenChildren(headings)).to.have.lengthOf(1);
      })
    );

    it('should flatten children if they exist and keep the rest if second arg is true',
      inject(function (TableiciousService) {
        expect(TableiciousService.flattenChildren(headings, true)).to.have.lengthOf(3);
      })
    );
  });
});
