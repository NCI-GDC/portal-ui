/* @flow */

import React from 'react';

import Link from '../Links/Link';

export type TProps = {|
  offset: number,
  size: number,
  total: number,
|};

const Pagination = ({ offset, size, total }: TProps) => (
  <div>
    <Link merge query={{ offset: 0 }}>{' << '}</Link>
    <Link merge query={{ offset: offset - size }}>{' < '}</Link>
    <Link merge query={{ offset: offset + size }}>{' > '}</Link>
    <Link merge query={{ offset: total - (total % size) }}>{' >> '}</Link>
  </div>
);

export default Pagination;
