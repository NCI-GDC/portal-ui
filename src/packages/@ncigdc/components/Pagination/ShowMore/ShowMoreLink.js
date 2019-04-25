// @flow
import React from 'react';

import Link from '@ncigdc/components/Links/Link';

export default ({
  prefix,
  offset,
  size = 10,
  children,
  ...props
}: {
  prefix: string,
  offset: number,
  size: number,
  children: any,
}) => (
  <Link
    query={{
      [`${prefix}_offset`]: offset + size,
      [`${prefix}_size`]: size,
    }}
    {...props}
    merge>
    {children || 'Show more'}
  </Link>
);
