/* @flow */

import { TGroupFilter } from '../filters/types';
import { TRawQuery } from '../uri/types';

export type TRelayRouteParamsViewer = {
  filters: ?TGroupFilter,
};

export type TRelayRouteParamsNode = {
  filters: ?TGroupFilter,
  id: string,
};

export type TPrepareViewerParams = (o: {
  location: { query: TRawQuery },
}) => TRelayRouteParamsViewer;

export type TPrepareNodeParams = (
  t: string,
) => (o: {
  location: { search: TRawQuery },
  match: { params: { id: string } },
}) => TRelayRouteParamsNode;
