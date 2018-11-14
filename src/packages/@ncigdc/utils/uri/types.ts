import { IGroupFilter } from '../filters/types';

export interface IRawQuery {
  filters?: string;
}

export interface IUriQuery {
  filters?: IGroupFilter | null;
}

export type TParseIntParam = (s: any, d?: number | null) => number | null;

export type TParseJSONParam = (s: any, d?: any) => any;

export type TParseFilterParam = (s: any, d?: {}) => IGroupFilter | null;
