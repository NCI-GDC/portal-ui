/* @flow */

import React from 'react';
import Relay from 'react-relay';

import Link from '@ncigdc/components/Links/Link';

export type TProps = {|
  pagination: {|
    offset: number,
    size: number,
    total: number,
  |},
|};

export const PaginationComponent = (props: TProps) => {
  const pagination = props.pagination;

  return (
    <div>
      <Link merge query={{ offset: 0 }}>{' << '}</Link>
      <Link merge query={{ offset: pagination.offset - pagination.size }}>{' < '}</Link>
      <Link merge query={{ offset: pagination.offset + pagination.size }}>{' > '}</Link>
      <Link merge query={{ offset: pagination.total - (pagination.total % pagination.size) }}>{' >> '}</Link>
    </div>
  );
};

export const PaginationQuery = {
  fragments: {
    pagination: () => Relay.QL`
      fragment on ESPagination {
        total
        size
        offset
      }
    `,
  },
};

const Pagination = Relay.createContainer(
  PaginationComponent,
  PaginationQuery
);

export default Pagination;
