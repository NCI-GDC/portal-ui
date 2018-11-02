import { IRawQuery, IUriQuery } from '../uri/types';

export type TFilterValue = Array<string | number | boolean>;

export interface IValueContent {
  field: string;
  value: TFilterValue;
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
) => IGroupFilter;

export type TMergeFiltersNullable = (
  q: IGroupFilter | null,
  c: IGroupFilter | null
) => IGroupFilter | null;

export type TMergeEnum = boolean | 'toggle' | 'replace' | 'add';

export type TFilterOperation = (
  t: TMergeEnum,
  x: IGroupFilter | null,
  y: IGroupFilter | null
) => IGroupFilter | null;

export type TMergeFns = (v: TMergeEnum) => TMergeFiltersNullable;

export type TMergeQuery = (
  q: IUriQuery | void,
  c: IRawQuery,
  t: TMergeEnum,
  w?: string[]
) => IUriQuery;

export type TSortFilters = (a: IValueFilter, b: IValueFilter) => number;

export type TFilterByWhitelist = (
  o: IRawQuery | void,
  w: string[] | void
) => IRawQuery;

export type TRemoveFilter = (
  field: string,
  query: IGroupFilter
) => IGroupFilter | null;
