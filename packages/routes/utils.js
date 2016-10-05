/* @flow */
/* eslint flowtype/no-weak-types: 0 */

import type { ViewerParamsType, NodeParamsType, UriQueryType } from 'utils/uri/types';

type ParseIntParamType = (s: ?string, d: number) => number;
export const parseIntParam: ParseIntParamType = (str, defaults) => (
  str ? Math.max(parseInt(str, 10), 0) : defaults
);

type ParseJsonParamType = (s: ?string, d: ?Object) => ?Object;
export const parseJsonParam: ParseJsonParamType = (str, defaults) => (
  str ? JSON.parse(str) : defaults
);

type PrepareViewerParamsType = (o: { location: { query: UriQueryType } }) => ViewerParamsType;
export const prepareViewerParams: PrepareViewerParamsType = ({ location: { query = {} } }) => {
  const q = query || {};
  return ({
    offset: parseIntParam(q.offset, 0),
    first: parseIntParam(q.first, 20),
    filters: parseJsonParam(q.filters, null),
  });
};

type PrepareNodeParamsType = (t: string) => (p: { params: {id: string}}) => NodeParamsType;
export const prepareNodeParams: PrepareNodeParamsType = type => ({ params }) => ({
  id: btoa(`${type}:${params.id}`),
});
