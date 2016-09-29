/* @flow */

import React from 'react';
import { location as RRLocationPropType } from 'react-router/PropTypes';
import { compose, getContext } from 'recompose';
import InternalLink from 'components/Links/InternalLink';

import type { LinkPropsType } from './types';

type LocationType = {|
  pathname: string,
|};

type PropsType = {|
  location: LocationType,
|} & LinkPropsType;

const mergeQuery = () => ({});
const diffQuery = () => ({});

const InternalLinkWithContext = ({ pathname, query, merge, diff, location, ...rest }: PropsType) => {
  const pn = pathname || location.pathname;

  const q = (merge || diff)
    ? merge
      ? mergeQuery()
      : diffQuery()
    : query;

  return (
    <InternalLink
      pathname={pn}
      query={q}
      {...rest}
    />
  );
};

export default compose(
  getContext({ location: RRLocationPropType })
)(InternalLinkWithContext);
