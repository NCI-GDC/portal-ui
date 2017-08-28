/* @flow */
import 'babel-polyfill';

import filtersToName from '../filtersToName';

const sets = {
  case: {
    '24601': 'Set Name',
  },
};

const filterEq = {
  op: 'in',
  content: { field: 'field', value: ['one'] },
};

const filterIn2 = {
  op: 'in',
  content: { field: 'field', value: ['one', 'two'] },
};

const filterIn6 = {
  op: 'in',
  content: {
    field: 'field',
    value: ['one', 'two', 'three', 'four', 'five', 'six'],
  },
};

const filterIn7 = {
  op: 'in',
  content: {
    field: 'field',
    value: ['one', 'two', 'three', 'four', 'five', 'six', 'seven'],
  },
};

describe('filtersToName', () => {
  it('should return an empty string when passed empty filters', () => {
    expect(filtersToName({ filters: null, sets })).toEqual('');
    expect(filtersToName({ sets })).toEqual('');
    expect(filtersToName({ filters: {}, sets })).toEqual('');
    expect(
      filtersToName({
        filters: { op: 'in', content: { field: 'field', value: [] } },
        sets,
      }),
    ).toEqual('');
    expect(
      filtersToName({ filters: { op: 'and', content: [] }, sets }),
    ).toEqual('');
  });
  it('should join same value by "/", different values by ","', () => {
    expect(filtersToName({ filters: filterIn2, sets })).toEqual('one / two');
    expect(
      filtersToName({
        filters: {
          op: 'and',
          content: [filterIn2, filterIn2],
        },
        sets,
      }),
    ).toEqual('one / two, one / two');
  });
  it('should handle ops with single value', () => {
    expect(filtersToName({ filters: filterEq, sets })).toEqual('one');

    expect(
      filtersToName({
        filters: {
          op: 'and',
          content: [filterEq, filterIn2],
        },
        sets,
      }),
    ).toEqual('one, one / two');
  });
  it('should truncate to 6 values', () => {
    expect(filtersToName({ filters: filterIn6, sets })).toEqual(
      'one / two / three / four / five / six',
    );

    expect(filtersToName({ filters: filterIn7, sets })).toEqual(
      'one / two / three / four / five / six...',
    );

    expect(
      filtersToName({
        filters: {
          op: 'and',
          content: [filterIn2, filterEq, filterIn2, filterEq],
        },
        sets,
      }),
    ).toEqual('one / two, one, one / two, one');

    expect(
      filtersToName({
        filters: {
          op: 'and',
          content: [filterIn2, filterEq, filterIn2, filterIn6],
        },
        sets,
      }),
    ).toEqual('one / two, one, one / two, one...');

    expect(
      filtersToName({
        filters: {
          op: 'and',
          content: [filterIn2, filterEq, filterIn2, filterEq, filterIn2],
        },
        sets,
      }),
    ).toEqual('one / two, one, one / two, one...');
  });
  it('should use set name instead of id', () => {
    expect(
      filtersToName({
        filters: {
          op: 'in',
          content: { field: 'field', value: ['set_id:24601'] },
        },
        sets,
      }),
    ).toEqual('Set Name');
    expect(
      filtersToName({
        filters: {
          op: 'in',
          content: { field: 'field', value: ['set_id:25631'] },
        },
        sets,
      }),
    ).toEqual('input set');
  });
});
