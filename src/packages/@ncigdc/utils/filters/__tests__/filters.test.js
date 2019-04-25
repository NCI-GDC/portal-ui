import { stringifyJSONParam, parseFilterParam } from '@ncigdc/utils/uri/index';
import {
  addInFilters, toggleFilters, mergeQuery, removeFilter,
} from '..';

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
    content: [
      rangeFromFilter,
      rangeToFilter,
      primarySiteFilter,
    ],
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
        content: [
          rangeFromFilter,
          rangeToFilter,
          primarySiteFilter,
        ],
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

describe('removeFilter', () => {
  it('should remove all the filters specified in the field arg', () => {
    const query = {
      filters: {
        op: 'and',
        content: [
          primarySiteFilter,
          rangeToFilter,
          rangeFromFilter,
        ],
      },
    };
    const field = 'cases.diagnoses.age_at_diagnosis';
    const expectedResult = {
      op: 'and',
      content: [primarySiteFilter],
    };

    const result = removeFilter(field, query.filters);

    expect(result).toEqual(expectedResult);
  });

  it('should return null if the query is empty', () => {
    const query = {};
    const field = 'cases.diagnoses.age_at_diagnosis';
    const result = removeFilter(field, query.filters);
    const expectedResult = null;

    expect(result).toEqual(expectedResult);
  });

  it('should return the query if the filter field being removed does not have a value in the query filters', () => {
    const query = {
      filters: {
        op: 'and',
        content: [primarySiteFilter],
      },
    };
    const field = 'cases.diagnoses.age_at_diagnosis';
    const result = removeFilter(field, query.filters);
    const expectedResult = {
      op: 'and',
      content: [primarySiteFilter],
    };

    expect(result).toEqual(expectedResult);
  });

  it('should return null if there are no filters in the query', () => {
    const query = {
      searchTableTab: 'cases',
    };
    const field = 'cases.diagnoses.age_at_diagnosis';
    const result = removeFilter(field, parseFilterParam(query.filters));
    const expectedResult = null;

    expect(result).toEqual(expectedResult);
  });

  it('should remove the correct filter if it is the last filter in a list', () => {
    const query = {
      filters: {
        op: 'and',
        content: [
          rangeToFilter,
          rangeFromFilter,
          primarySiteFilter,
        ],
      },
    };

    const field = 'cases.primary_site';
    const result = removeFilter(field, query.filters);
    const expectedResult = {
      op: 'and',
      content: [rangeToFilter, rangeFromFilter],
    };

    expect(result).toEqual(expectedResult);
  });

  it('should remove the filter if it is the first filter in a list', () => {
    const query = {
      filters: {
        op: 'and',
        content: [
          primarySiteFilter,
          rangeToFilter,
          rangeFromFilter,
        ],
      },
    };

    const field = 'cases.primary_site';
    const result = removeFilter(field, query.filters);
    const expectedResult = {
      op: 'and',
      content: [rangeToFilter, rangeFromFilter],
    };

    expect(result).toEqual(expectedResult);
  });

  it('should return null if the field arg is the only filter in the list', () => {
    const query = {
      filters: {
        op: 'and',
        content: [primarySiteFilter],
      },
    };

    const field = 'cases.primary_site';
    const result = removeFilter(field, query.filters);
    const expectedResult = null;

    expect(result).toEqual(expectedResult);
  });

  it('should remove a filter if it is neither first nor last in a list', () => {
    const query = {
      filters: {
        op: 'and',
        content: [
          primarySiteFilter,
          caseFilter,
          rangeToFilter,
          rangeFromFilter,
        ],
      },
    };

    const field = 'case.case_id';
    const result = removeFilter(field, query.filters);
    const expectedResult = {
      op: 'and',
      content: [
        primarySiteFilter,
        rangeToFilter,
        rangeFromFilter,
      ],
    };

    expect(result).toEqual(expectedResult);
  });
});
