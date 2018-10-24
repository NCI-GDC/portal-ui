/* @flow */

import { IGroupFilter } from '../filters/types';
import { TRawQuery } from '../uri/types';

export type TRelayRouteParamsViewer = {
  filters: ?IGroupFilter,
};

export type TRelayRouteParamsNode = {
  filters: ?IGroupFilter,
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
