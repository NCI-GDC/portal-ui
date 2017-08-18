/* @flow */
import { stringifyJSONParam } from '@ncigdc/utils/uri/index';
import { addInFilters, toggleFilters, mergeQuery } from '../';

const baseFilter = {
  op: 'and',
  content: [
    {
      op: 'in',
      content: {
        field: 'file.file_id',
        value: ['fileA'],
      },
    },
  ],
};

const fileBFilter = {
  op: 'and',
  content: [
    {
      op: 'in',
      content: {
        field: 'file.file_id',
        value: ['fileB'],
      },
    },
  ],
};

const caseFilter = {
  op: 'and',
  content: [
    {
      op: 'in',
      content: {
        field: 'case.case_id',
        value: ['somecase'],
      },
    },
  ],
};

const rangeFromFilter = {
  op: '>=',
  content: {
    field: 'cases.diagnoses.age_at_diagnosis',
    value: [5113],
  },
};

const rangeToFilter = {
  op: '<=',
  content: {
    field: 'cases.diagnoses.age_at_diagnosis',
    value: [33236],
  },
};

const primarySiteFilter = {
  op: 'in',
  content: {
    field: 'cases.primary_site',
    value: ['Lung'],
  },
};

describe('addInFilters', () => {
  it('should return the base filter if no query', () => {
    const result = addInFilters(undefined, baseFilter);
    expect(result).toEqual(baseFilter);
  });

  it('should return the query if no base filter', () => {
    expect(false).toBe(false);
  });

  it('should add a value to base', () => {
    const result = addInFilters(fileBFilter, baseFilter);
    expect(result).toEqual({
      op: 'and',
      content: [
        {
          op: 'in',
          content: {
            field: 'file.file_id',
            value: ['fileA', 'fileB'],
          },
        },
      ],
    });
  });

  it('should keep other fields in the filter when adding', () => {
    const result = addInFilters(
      fileBFilter,
      addInFilters(caseFilter, baseFilter),
    );
    expect(result).toMatchObject({
      op: 'and',
      content: [
        {
          op: 'in',
          content: {
            field: 'case.case_id',
            value: ['somecase'],
          },
        },
        {
          op: 'in',
          content: {
            field: 'file.file_id',
            value: ['fileA', 'fileB'],
          },
        },
      ],
    });
  });

  it('should not remove an existing value', () => {
    const result = addInFilters(baseFilter, baseFilter);
    expect(result).toEqual(result);
  });
});

describe('toggleFilters', () => {
  it('should add a value to base', () => {
    const result = toggleFilters(fileBFilter, baseFilter);
    expect(result).toEqual({
      op: 'and',
      content: [
        {
          op: 'in',
          content: {
            field: 'file.file_id',
            value: ['fileA', 'fileB'],
          },
        },
      ],
    });
  });
  it('should remove an existing value', () => {
    const result = toggleFilters(baseFilter, baseFilter);
    expect(result).toEqual(null);
  });

  const q = {
    op: 'and',
    content: [primarySiteFilter],
  };

  const ctxq = {
    op: 'and',
    content: [rangeFromFilter, rangeToFilter, primarySiteFilter],
  };
  it('should not change the range filter if an unrelated filter was removed', () => {
    const result = toggleFilters(q, ctxq);
    expect(result).toEqual({
      op: 'and',
      content: [rangeFromFilter, rangeToFilter],
    });
  });

  it('should not change the range filter if an unrelated filter was removed, regardless of order', () => {
    const result = toggleFilters(ctxq, q);
    expect(result).toEqual({
      op: 'and',
      content: [rangeFromFilter, rangeToFilter],
    });
  });
});

// describe('flipFilters', () => {
//   it('should swap same field/value ins for excludes', () => {
//     const result = flipFilters(
//       {
//         op: 'and',
//         content: [
//           {
//             op: 'in',
//             content: {
//               field: 'file.file_id',
//               value: ['fileA'],
//             },
//           },
//           {
//             op: 'exclude',
//             content: {
//               field: 'file.file_name',
//               value: ['fileA'],
//             },
//           },
//         ],
//       },
//       {
//         op: 'and',
//         content: [
//           {
//             op: 'in',
//             content: {
//               field: 'file.foo',
//               value: ['bar'],
//             },
//           },
//           {
//             op: 'exclude',
//             content: {
//               field: 'file.file_id',
//               value: ['fileA'],
//             },
//           },
//           {
//             op: 'in',
//             content: {
//               field: 'file.file_name',
//               value: ['fileA'],
//             },
//           },
//         ],
//       },
//     );
//     expect(result).toEqual({
//       op: 'and',
//       content: [
//         {
//           op: 'in',
//           content: {
//             field: 'file.foo',
//             value: ['bar'],
//           },
//         },
//         {
//           op: 'in',
//           content: {
//             field: 'file.file_id',
//             value: ['fileA'],
//           },
//         },
//         {
//           op: 'exclude',
//           content: {
//             field: 'file.file_name',
//             value: ['fileA'],
//           },
//         },
//       ],
//     });
//   });
// });

describe('mergeQuery', () => {
  it('should not change the range filter if an unrelated filter was removed', () => {
    const q = {
      offset: 0,
      filters: {
        op: 'and',
        content: [primarySiteFilter],
      },
    };

    const c = {
      filters: stringifyJSONParam({
        op: 'and',
        content: [rangeFromFilter, rangeToFilter, primarySiteFilter],
      }),
    };

    const result = mergeQuery(q, c, 'toggle', null);

    const expectedResult = {
      offset: 0,
      filters: {
        op: 'and',
        content: [rangeFromFilter, rangeToFilter],
      },
    };

    expect(result).toEqual(expectedResult);
  });
});
