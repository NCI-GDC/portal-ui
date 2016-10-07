/* @flow */

import type { TGroupFilter } from '@ncigdc/utils/filters/types';

export type TRelayRouteParamsViewer = {|
  filters: ?TGroupFilter,
  first: number,
  offset: number,
  sort: string,
|};

export type TRelayRouteParamsNode = {|
  filters: ?TGroupFilter,
  id: string,
  offset: number,
|};
