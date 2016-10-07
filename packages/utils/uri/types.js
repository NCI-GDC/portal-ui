/* @flow */

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


