/* @flow */

import { parseIntParam, parseFilterParam } from '@ncigdc/utils/uri';

import type { TPrepareViewerParams, TPrepareNodeParams } from './types';

export const prepareViewerParams: TPrepareViewerParams = ({ location: { query } }) => {
  const q = query || {};
  return {
    offset: parseIntParam(q.offset, 0),
    first: parseIntParam(q.first, 20),
    filters: parseFilterParam(q.filters, null),
    sort: '',
  };
};

export const prepareNodeParams: TPrepareNodeParams = type => ({ location: { query }, params }) => {
  const q = query || {};
  return ({
    id: btoa(`${type}:${params.id}`),
    offset: parseIntParam(q.offset, 0),
    filters: parseFilterParam(q.filters, null),
  });
};

