describe('Biospecimen:', function () {
  var idFields, participant;

  // Initialization of the AngularJS application before each test case
  beforeEach(module('biospecimen.services'));

  beforeEach(function () {
    idFields = [
      'submitter_id', 'sample_id', 'portion_id',
      'analyte_id', 'slide_id', 'aliquot_id'
    ];

    participant = {
      samples: [{
        submitter_id: 's-foo1',
        portions: [{
          submitter_id: 'p-foo2',
          slides: [{ submitter_id: 'sl-foo2' }],
          analytes: [{
            submitter_id: 'an-foo2',
            aliquots: [{ submitter_id: 'al-foo1' }]
          }]
        }]
      }]
    };
  });

  describe('Service:', function () {
    it('should exist', inject(function (BiospecimenService) {
      expect(BiospecimenService).to.exist;
    }));

    describe('expandAll:', function () {
      it('should exist', inject(function (BiospecimenService) {
        expect(BiospecimenService.expandAll).to.exist;
      }));

      it('should make all participant biospecimen arrays'
        + ' and entities expanded if third arg is true',
        inject(function (BiospecimenService) {
          BiospecimenService.expandAll({ which: 1}, participant, true);
          expect(participant.biospecimenTreeExpanded).to.be.true;
        })
      );
    });

    describe('allExpanded', function () {
      it('should exist', inject(function (BiospecimenService) {
        expect(BiospecimenService.allExpanded).to.exist;
      }));

      it('should return true if all participant entities are expanded', inject(function (BiospecimenService) {
        BiospecimenService.expandAll({ which: 1}, participant, true);
        expect(BiospecimenService.allExpanded(participant)).to.be.true
      }));
    });

    describe('search:', function () {
      it('should exist', inject(function (BiospecimenService) {
        expect(BiospecimenService.search).to.exist;
      }));

      it('should look through the biotree and push entities to the "found" array'
        + ' if the submitter_id contains the searchTerm',
        inject(function (BiospecimenService) {
          var found = BiospecimenService.search('foo1', participant, idFields);
          expect(found).to.have.lengthOf(2);
        })
      );
    });

    describe('stitchPlaceholderChildrenToParents:', function () {
      it('should exist', inject(function (BiospecimenService) {
        expect(BiospecimenService.stitchPlaceholderChildrenToParents).to.exist;
      }));

      it('should shift placeholder children to nearest parent with files',
        inject(function (BiospecimenService) {
          var actual = {
            samples: [
              {
                submitter_id: 's-foo',
                portions: [
                  {
                    analytes: [{
                      aliquots: [{ submitter_id: 'al-foo1' }]
                    }]
                  },
                  {
                    analytes: [{
                      aliquots: [{ submitter_id: 'al-foo2' }]
                    }]
                  }
                ]
              },
              {
                submitter_id: 's-bar',
                portions: [
                  {
                    analytes: [{
                      aliquots: [{ submitter_id: 'al-bar1' }]
                    }]
                  },
                  {
                    analytes: [{
                      aliquots: [{ submitter_id: 'al-bar2' }]
                    }]
                  }
                ]
              }
            ]
          };

          var expected = {
            samples: [
              {
                submitter_id: 's-foo',
                portions: [
                  { analytes: [{ aliquots: [] }] },
                  { analytes: [{ aliquots: [] }] }
                ],
                aliquots: [
                  { submitter_id: 'al-foo1' },
                  { submitter_id: 'al-foo2' }
                ]
              },
              {
                submitter_id: 's-bar',
                portions: [
                  { analytes: [{ aliquots: [] }] },
                  { analytes: [{ aliquots: [] }] }
                ],
                aliquots: [
                  { submitter_id: 'al-bar1' },
                  { submitter_id: 'al-bar2' }
                ]
              }
            ]
          };

          BiospecimenService.stitchPlaceholderChildrenToParents(actual.samples);
          expect(actual).to.deep.eq(expected);
        })
      );

      it('should do nothing if no placeholders found',
        inject(function (BiospecimenService) {
          var expected = _.cloneDeep(participant);
          BiospecimenService.stitchPlaceholderChildrenToParents(participant.samples);
          expect(participant).to.deep.eq(expected);
        })
      );
    });
  });
});
