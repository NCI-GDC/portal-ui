/* @flow */

import React from 'react';
import Link from 'react-router-dom/Link';
import JSURL from 'jsurl';
import { stringify } from 'query-string';
import { removeEmptyKeys as rek } from '@ncigdc/utils/uri';
import validAttributes from '@ncigdc/theme/utils/validAttributes';
import { scrollToId } from '@ncigdc/components/Links/deepLink';

import type { TLinkProps } from './types';

const InternalLink = ({ pathname, query, removeEmptyKeys, deepLink, ...rest }: TLinkProps) => {
  const q0 = query || {};
  const f0 = q0.filters
    ? JSURL.stringify(q0.filters)
    : null;

  const q1 = {
    ...q0,
    filters: f0,
  };

  const q = removeEmptyKeys
    ? removeEmptyKeys(q1)
    : q1;

  const validAttrProps = validAttributes(rest);

  const search = stringify(q);

  return (
    <Link
      to={{
        pathname,
        search,
      }}
      {...validAttrProps}
      onClick={(event) => {
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

InternalLink.defaultProps = { // eslint-disable-line fp/no-mutation
  removeEmptyKeys: rek,
};

export default InternalLink;
