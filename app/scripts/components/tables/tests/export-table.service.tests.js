describe('Export Table:', function () {
  var headings;

  beforeEach(module('export-table.service'));
  beforeEach(function () {
    headings = [
      { id: 'foo', isField: true },
      { id: 'fuz', isField: false },
      { id: 'bar', hidden: true },
      { id: 'baz', children: [] },
    ]
  });

  beforeEach(module(function ($provide) {
    $provide.value('AuthRestangular', {});
    $provide.value('notify', {});
    $provide.value('config', {});
  }));

  describe('getFieldsAndExpand:', function () {
    it('should exist', inject(function (ExportTableService) {
      expect(ExportTableService.getFieldsAndExpand).to.exist;
    }));

    it('should transform headings into a params fragment',
      inject(function (ExportTableService) {
        var expected = {
          fields: ['foo'],
          expand: ['baz']
        }

        expect(ExportTableService.getFieldsAndExpand(headings)).to.deep.eq(expected);
      })
    );
  });

  describe('buildParams:', function () {
    it('should exist', inject(function (ExportTableService) {
      expect(ExportTableService.buildParams).to.exist;
    }));

    it('should return download params compatible object from various fields',
      inject(function (ExportTableService) {
        var paramsSpec = {
          endpoint: 'cases',
          format: 'JSON',
          headings: headings,
          fields: undefined,
          expand: undefined,
          size: '1000',
        };

        var actual = ExportTableService.buildParams(paramsSpec);

        expect(actual.size).to.eq('1000');
        expect(actual.filters).to.exist;
        expect(actual.fields).to.be.ok;
        expect(actual.expand).to.eq('baz');
        expect(actual.attachment).to.eq(true);
        expect(actual.flatten).to.eq(true);
        expect(actual.pretty).to.eq(true);
      })
    );
  });

  describe('exportTable:', function () {
    it('should exist', inject(function (ExportTableService) {
      expect(ExportTableService.exportTable).to.exist;
    }));
  });
});
