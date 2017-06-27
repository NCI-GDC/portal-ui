/* @flow */
import { parse } from 'query-string';

import GenePage from '@ncigdc/containers/GenePage';
import { parseIntParam, parseFilterParam } from '@ncigdc/utils/uri';

import { makeEntityPage } from './utils';

export default makeEntityPage({
  entity: 'Gene',
  Page: GenePage,
  prepareParams: ({ location: { search }, match: { params } }) => {
    const q = parse(search);
    const qq: Object = {
      ...q,
      filters: parseFilterParam(q.filters, null),
    };

    return {
      id: btoa(`Gene:${params.id}`),
      fmTable_offset: parseIntParam(q.fmTable_offset, 0),
      fmTable_size: parseIntParam(q.fmTable_size, 10),
      fmTable_filters: parseFilterParam(q.fmTable_filters, null),
      ...qq,
    };
  },
});
