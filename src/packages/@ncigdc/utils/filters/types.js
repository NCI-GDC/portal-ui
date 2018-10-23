/* @flow */

import { TRawQuery, TUriQuery } from '../uri/types';

export type TValueContent = {
  field: string,
  value: Array<mixed>,
};
export type TValueOp = 'in';
export type TValueFilter = {
  content: TValueContent,
  op: TValueOp,
};

export type TGroupContent = Array<TValueFilter>;
export type TGroupOp = 'and';
export type TGroupFilter = {
  content: TGroupContent,
  op: TGroupOp,
};

export type TCombineValues = (
  x: TValueFilter,
  y: TValueFilter,
) => ?TValueFilter;

export type TMergeFilters = (
  q: ?TGroupFilter,
  c: ?TGroupFilter,
) => ?TGroupFilter;

export type TMergeEnum = boolean | 'toggle' | 'replace';

export type TMergeFns = (v: TMergeEnum) => TMergeFilters;

export type TMergeQuery = (
  q: ?TUriQuery,
  c: TRawQuery,
  t: TMergeEnum,
) => TUriQuery;

export type TSortFilters = (a: TValueFilter, b: TValueFilter) => number;

export type TFilterByWhitelist = (
  o: ?TRawQuery,
  w: ?Array<string>,
) => TRawQuery;

export type TRemoveFilter = (
  field: string,
  query: TGroupFilter,
) => ?TGroupFilter;
