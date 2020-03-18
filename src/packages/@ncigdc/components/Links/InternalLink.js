import React from 'react';
import _ from 'lodash';
import { NavLink as Link } from 'react-router-dom';
import { stringify } from 'query-string';

import { stringifyJSONParam } from '@ncigdc/utils/uri';
import removeEmptyKeys from '@ncigdc/utils/removeEmptyKeys';
import validAttributes from '@ncigdc/theme/utils/validAttributes';
import { scrollToId } from '@ncigdc/components/Links/deepLink';

import { TLinkProps } from './types';

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
  deepLink,
  pathname = '',
  query,
  search,
  testTag = 'unnamed-component',
  ...rest
}: TLinkProps) => {
  const q0 = query || {};
  const f0 = q0.filters ? stringifyJSONParam(q0.filters) : null;

  const q1 = {
    ...q0,
    filters: f0,
  };

  const q = removeEmptyKeys(q1);

  const validAttrProps = validAttributes(rest);
  const validLinkProps = _.pick(rest, reactRouterLinkProps);

  return (
    <Link
      data-test={testTag}
      to={{
        pathname,
        search: search || stringify(q),
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
      >
      {validAttrProps.children}
    </Link>
  );
};

export default InternalLink;
