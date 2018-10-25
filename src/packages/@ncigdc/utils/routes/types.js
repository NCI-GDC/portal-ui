/* @flow */

import { IGroupFilter } from '../filters/types';
import { IRawQuery } from '../uri/types';

export type TRelayRouteParamsViewer = {
  filters: ?IGroupFilter,
};

export type TRelayRouteParamsNode = {
  filters: ?IGroupFilter,
  id: string,
};

export type TPrepareViewerParams = (o: {
  location: { query: IRawQuery },
}) => TRelayRouteParamsViewer;

export type TPrepareNodeParams = (
  t: string,
) => (o: {
  location: { search: IRawQuery },
  match: { params: { id: string } },
}) => TRelayRouteParamsNode;
