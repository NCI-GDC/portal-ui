/* @flow */
import { parse } from 'query-string';

import CasePage from '@ncigdc/containers/CasePage';
import {
  parseIntParam,
  parseFilterParam,
  parseJSURLParam,
} from '@ncigdc/utils/uri';

import { makeEntityPage } from './utils';

export default makeEntityPage({
  entity: 'Case',
  Page: CasePage,
  prepareParams: ({ match: { params }, location: { search } }) => {
    const q = parse(search);

    const caseFilters = {
      op: 'AND',
      content: [
        {
          op: '=',
          content: {
            field: 'cases.case_id',
            value: params.id,
          },
        },
      ],
    };

    return {
      id: btoa(`Case:${params.id}`),
      files_offset: parseIntParam(q.files_offset, 0),
      files_size: parseIntParam(q.files_size, 20),
      files_sort: parseJSURLParam(q.files_sort, null),
      filters: parseFilterParam(q.filters, null),
      fmTable_offset: parseIntParam(q.fmTable_offset, 0),
      fmTable_size: parseIntParam(q.fmTable_size, 20),
      fmTable_filters: parseFilterParam(q.filters, null),
      caseFilters,
    };
  },
});
