/* @flow */
/* eslint flowtype/no-weak-types: 0 */

import type { TGroupFilter } from '../filters/types';

export type TRawQuery = {|
  filters?: string,
  first?: string,
  offset?: string,
  sort?: string,
|};

export type TUriQuery = {|
  filters?: ?TGroupFilter,
  first?: number,
  offset?: number,
  sort?: string,
|};

export type TIsEmptyArray = (x: mixed) => boolean;

export type TIsEmptyObject = (x: mixed) => boolean;

export type TRemoveEmptyKeys = (p: Object) => Object;

export type TConvertRawToUri = (s: ?TRawQuery) => TUriQuery;

export type TParseIntParam = (s: ?string, d: number) => number;

export type TParseFilterParam = (s: ?string, d: ?TGroupFilter) => ?TGroupFilter;
