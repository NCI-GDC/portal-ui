// @flow

import { withPropsOnChange, compose } from "recompose";
import JSURL from "jsurl";
import withRouter from "@ncigdc/utils/withRouter";

type TArgs = {
  propName: string,
  defaults: mixed,
};
export default ({ propName = "filters", defaults = null }: TArgs = {}) =>
  compose(
    withRouter,
    withPropsOnChange(
      ({ location }, { location: previousLocation }) =>
        location.search !== previousLocation.search,
      ({ query: { filters } }) => ({
        [propName]: JSURL.parse(filters) || defaults,
      }),
    ),
  );
