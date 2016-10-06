/* @flow */
/* eslint flowtype/no-weak-types: 0 */

import type { TViewerParams, TNodeParams, TUriQuery } from 'utils/uri/types';

type TParseIntParam = (s: ?string, d: number) => number;
export const parseIntParam: TParseIntParam = (str, defaults) => (
  str ? Math.max(parseInt(str, 10), 0) : defaults
);

type TParseJsonParam = (s: ?string, d: ?Object) => ?Object;
export const parseJsonParam: TParseJsonParam = (str, defaults) => (
  str ? JSON.parse(str) : defaults
);

type TPrepareViewerParams = (o: { location: { query: TUriQuery } }) => TViewerParams;
export const prepareViewerParams: TPrepareViewerParams = ({ location: { query = {} } }) => {
  const q = query || {};
  return ({
    offset: parseIntParam(q.offset, 0),
    first: parseIntParam(q.first, 20),
    filters: parseJsonParam(q.filters, null),
  });
};

type TPrepareNodeParams = (t: string) => (p: { params: {id: string}}) => TNodeParams;
export const prepareNodeParams: TPrepareNodeParams = type => ({ params }) => ({
  id: btoa(`${type}:${params.id}`),
});
