/* @flow */

import JSURL from 'jsurl';

import type { TGroupFilter } from '@ncigdc/utils/filters/types';
import type { TRawQuery } from '@ncigdc/utils/uri/types';

import type { TRelayRouteParamsViewer, TRelayRouteParamsNode } from './types';


type TParseIntParam = (s: ?string, d: number) => number;
export const parseIntParam: TParseIntParam = (str, defaults) => (
  str ? Math.max(parseInt(str, 10), 0) : defaults
);

type TParseFilterParam = (s: ?string, d: ?TGroupFilter) => ?TGroupFilter;
export const parseFilterParam: TParseFilterParam = (str, defaults) => (
  str ? JSURL.parse(str) : defaults
);

type TPrepareViewerParams = (o: { location: { query: TRawQuery } }) => TRelayRouteParamsViewer;
export const prepareViewerParams: TPrepareViewerParams = ({ location: { query } }) => {
  const q = query || {};
  return {
    offset: parseIntParam(q.offset, 0),
    first: parseIntParam(q.first, 20),
    filters: parseFilterParam(q.filters, null),
    sort: '',
  };
};

type TPrepareNodeParams = (t: string) => (o: { location: { query: TRawQuery }, params: {id: string}}) => TRelayRouteParamsNode;
export const prepareNodeParams: TPrepareNodeParams = type => ({ location: { query = {} }, params }) => ({
  id: btoa(`${type}:${params.id}`),
  offset: parseIntParam(query.offset, 0),
  filters: parseFilterParam(query.filters, null),
});

