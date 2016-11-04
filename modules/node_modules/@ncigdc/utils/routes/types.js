/* @flow */

import type { TGroupFilter } from '../filters/types';
import type { TRawQuery } from '../uri/types';

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

export type TPrepareViewerParams = (
  o: { location: { query: TRawQuery } }
) => TRelayRouteParamsViewer;

export type TPrepareNodeParams = (t: string) => (
  o: { location: { query: TRawQuery },
  params: {id: string}}
) => TRelayRouteParamsNode;
