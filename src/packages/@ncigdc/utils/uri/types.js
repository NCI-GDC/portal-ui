/* @flow */
/* eslint flowtype/no-weak-types: 0 */

import { TGroupFilter } from '../filters/types';

export type TRawQuery = {
  filters?: string,
};

export type TUriQuery = {
  filters?: ?TGroupFilter,
};

export type TParseIntParam = (s: any, d?: number) => number;

export type TParseJSONParam = (s: any, d?: any) => any;

export type TParseFilterParam = (s: any, d?: TGroupFilter) => ?TGroupFilter;
