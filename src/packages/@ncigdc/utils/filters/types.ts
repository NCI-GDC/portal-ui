import { IRawQuery, IUriQuery } from '../uri/types';

export interface IValueContent {
  field: string;
  value: string | string[];
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
  q: IGroupFilter,
  c: IGroupFilter
) => IGroupFilter | null;

export type TMergeEnum = boolean | 'toggle' | 'replace' | 'add';

export type TMergeFns = (v: TMergeEnum) => TMergeFilters;

export type TMergeQuery = (
  q: IUriQuery,
  c: IRawQuery,
  t: TMergeEnum,
  w?: string[]
) => IUriQuery;

export type TSortFilters = (a: IValueFilter, b: IValueFilter) => number;

export type TFilterByWhitelist = (o: IRawQuery, w: string[]) => IRawQuery;

export type TRemoveFilter = (
  field: string,
  query: IGroupFilter
) => IGroupFilter | null;
