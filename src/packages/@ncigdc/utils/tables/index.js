import {
  compose,
  setDisplayName,
  withPropsOnChange,
} from 'recompose';
import { isEqual } from 'lodash';
import { parse } from 'query-string';

import withRouter from '@ncigdc/utils/withRouter';
import { parseJSONParam } from '@ncigdc/utils/uri';

export const withSort = (sortField, defaults = []) => compose(
  setDisplayName('withSortEnhancer'),
  withRouter,
  withPropsOnChange(
    ({ location }, { location: previousLocation }) => !(isEqual(location, previousLocation)),
    ({ location: { search } }) => ({
      sort: parseJSONParam(parse(search)[sortField], defaults),
    }),
  ),
);

export const isSortedColumn = (sort, id) => sort.reduce(
  (column, { field, order }) => (
    id === field
      ? order
      : column),
  false,
);
