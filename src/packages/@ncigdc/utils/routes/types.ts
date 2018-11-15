import { IGroupFilter } from '../filters/types';
import { IRawQuery } from '../uri/types';

export interface IRelayRouteParamsViewer {
  filters: IGroupFilter | null;
}

export interface IRelayRouteParamsNode {
  filters: IGroupFilter | null;
  id: string;
}

export type TPrepareViewerParams = (
  o: {
    location: { query: IRawQuery };
  }
) => IRelayRouteParamsViewer;

export type TPrepareNodeParams = (
  t: string
) => (
  o: {
    location: { search: string };
    match: { params: { id: string } };
  }
) => IRelayRouteParamsNode;
