import { TRawQuery, TUriQuery } from '../uri/types';

export interface IValueContent {
  field: string;
  value: any[];
}

export type TValueOp = 'in';
export interface IValueFilter {
  content: IValueContent;
  op: TValueOp;
}

export type TGroupContent = IValueFilter[];
export type TGroupOp = 'and';
export interface IGroupFilter {
  content: TGroupContent;
  op: TGroupOp;
}

export type TCombineValues = (
  x: IValueFilter,
  y: IValueFilter
) => IValueFilter | null;

export type TMergeFilters = (
  q: IGroupFilter | null,
  c: IGroupFilter | null
) => IGroupFilter | null;

export type TMergeEnum = boolean | 'toggle' | 'replace';

export type TMergeFns = (v: TMergeEnum) => TMergeFilters;

export type TMergeQuery = (
  q: TUriQuery | null,
  c: TRawQuery,
  t: TMergeEnum
) => TUriQuery;

export type TSortFilters = (a: IValueFilter, b: IValueFilter) => number;

export type TFilterByWhitelist = (
  o: TRawQuery | null,
  w: string[] | null
) => TRawQuery;

export type TRemoveFilter = (
  field: string,
  query: IGroupFilter
) => IGroupFilter | null;
