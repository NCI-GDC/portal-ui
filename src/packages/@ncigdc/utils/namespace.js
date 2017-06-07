// @flow
/* eslint fp/no-rest-parameters:0 */

import { compose, withProps, mapProps } from 'recompose';

const namespace = (ns, ...hocs) =>
  compose(
    withProps(props => ({ $parentProps: props })),
    ...hocs,
    mapProps(props => ({ [ns]: props, ...props.$parentProps })),
  );

export default namespace;
