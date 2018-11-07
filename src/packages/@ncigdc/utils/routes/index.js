/* @flow */
import { parse } from 'query-string';

import { TPrepareNodeParams } from './types';

import { parseFilterParam } from '../uri';

export const prepareNodeParams: TPrepareNodeParams = type => ({
  location: { search },
  match: { params },
}) => {
  const q = parse(search);
  const qq: Object = {
    ...q,
    filters: parseFilterParam(q.filters, null),
  };

  return {
    id: btoa(`${type}:${params.id}`),
    ...qq,
  };
};
