/* @flow */
/* eslint flowtype/no-weak-types: 0 */

import type { TGroupFilter } from '../filters/types';

export type TRawQuery = {
  filters?: string,
};

export type TUriQuery = {
  filters?: ?TGroupFilter,
};

export type TIsEmptyArray = (x: mixed) => boolean;

export type TIsEmptyObject = (x: mixed) => boolean;

export type TRemoveEmptyKeys = (p: Object) => Object;

export type TParseIntParam = (s: ?string, d: number) => number;

export type TParseJSONParam = (s: ?string, d: any) => any;

export type TParseFilterParam = (s: ?string, d: ?TGroupFilter) => ?TGroupFilter;
