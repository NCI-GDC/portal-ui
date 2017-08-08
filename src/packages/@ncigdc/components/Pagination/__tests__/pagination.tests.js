/* @flow */
import { calculatePages, getPaginationRange } from '../';

describe('Pagination', () => {
  it('calculates pages', () => {
    const props = {
      params: {
        files_offset: 0,
        files_size: 20,
        files_sort: null,
        filters: null,
        fmTable_filters: null,
        fmTable_offset: 0,
        fmTable_size: 20,
      },
      total: 37,
      prefix: 'fmTable',
    };
    const { totalPages } = calculatePages(props);
    expect(totalPages).toEqual(2);
  });
});

describe('generates a pagination range', () => {
  it('displays all pages if total pages is less than 10', () => {
    expect(getPaginationRange(0, 2)).toEqual([1, 2]);
  });
  it('displays only 10 pages if more than 10 pages', () => {
    expect(getPaginationRange(0, 300)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(getPaginationRange(10, 300)).toEqual([
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
    ]);
  });
});

describe('last page is correct', () => {
  it('last page offset is < then total', () => {
    const total = 37;
    const props = {
      params: {
        files_offset: 0,
        files_size: 20,
        files_sort: null,
        filters: null,
        fmTable_filters: null,
        fmTable_offset: 0,
        fmTable_size: 20,
      },
      total,
      prefix: 'fmTable',
    };
    const { last } = calculatePages(props);
    expect(last < total).toEqual(true);
  });

  it('last page offset + first is >= total', () => {
    const total = 37;
    const first = 20;
    const props = {
      params: {
        files_offset: 0,
        files_size: 20,
        files_sort: null,
        filters: null,
        fmTable_filters: null,
        fmTable_offset: 0,
        fmTable_size: first,
      },
      total,
      prefix: 'fmTable',
    };
    const { last } = calculatePages(props);
    expect(last + first >= total).toEqual(true);
  });
});
