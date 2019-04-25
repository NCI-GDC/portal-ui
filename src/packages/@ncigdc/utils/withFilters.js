// @flow

import { withPropsOnChange, compose } from 'recompose';

import withRouter from '@ncigdc/utils/withRouter';
import { parseJSONParam } from '@ncigdc/utils/uri';

type TArgs = {
  propName: string,
  defaults: mixed,
};
export default ({ propName = 'filters', defaults = null }: TArgs = {}) => compose(
  withRouter,
  withPropsOnChange(
    ({ location }, { location: previousLocation }) => location.search !== previousLocation.search,
    ({ query: { filters } }) => ({
      [propName]: parseJSONParam(filters, defaults),
    }),
  ),
);
