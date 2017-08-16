/* @flow */

import React from 'react';
import _ from 'lodash';
import { NavLink as Link } from 'react-router-dom';
import { stringify } from 'query-string';
import { removeEmptyKeys as rek, stringifyJSONParam } from '@ncigdc/utils/uri';
import validAttributes from '@ncigdc/theme/utils/validAttributes';
import { scrollToId } from '@ncigdc/components/Links/deepLink';

import type { TLinkProps } from './types';

const reactRouterLinkProps = [
  'to',
  'replace',
  'activeClassName',
  'activeStyle',
  'exact',
  'strict',
  'isActive',
];

const InternalLink = ({
  pathname,
  query,
  removeEmptyKeys,
  deepLink,
  ...rest
}: TLinkProps) => {
  const q0 = query || {};
  const f0 = q0.filters ? stringifyJSONParam(q0.filters) : null;

  const q1 = {
    ...q0,
    filters: f0,
  };

  const q = removeEmptyKeys ? removeEmptyKeys(q1) : q1;

  const validAttrProps = validAttributes(rest);
  const validLinkProps = _.pick(rest, reactRouterLinkProps);

  const search = stringify(q);

  return (
    <Link
      to={{
        pathname,
        search,
      }}
      {...validAttrProps}
      {...validLinkProps}
      onClick={event => {
        if (validAttrProps.onClick) {
          validAttrProps.onClick(event);
        }
        if (deepLink) {
          scrollToId(deepLink);
        }
      }}
    />
  );
};

InternalLink.defaultProps = {
  removeEmptyKeys: rek,
};

export default InternalLink;
