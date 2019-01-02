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
  y: IValueFilter,
  t: TMergeEnum
) => IValueFilter;

export type TMergeFilters = (q: IGroupFilter, c: IGroupFilter) => IGroupFilter;

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
  q: IUriQuery,
  c: IRawQuery,
  t: TMergeEnum,
  w?: string[]
) => IUriQuery;

export type TSortFilters = (a: IValueFilter, b: IValueFilter) => number;

export type TFilterByWhitelist = (o: IRawQuery, w: string[]) => IRawQuery;

export type TRemoveFilter = (
  field: string | ((x: any) => boolean) | null,
  query: IGroupFilter | IValueFilter | null
) => any; // todo - address this at some point

// Todo: look at filterFunc (or just this whole thing in general)
export type TRemoveFilterWithOp = (
  filterFunc: any,
  query: IGroupFilter | IValueFilter | null
) => any; // todo - address this at some point
