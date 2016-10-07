/* @flow */

import React from 'react';
import Relay from 'react-relay';
import { compose } from 'recompose';
import { createContainer } from 'recompose-relay';

import Link from '@ncigdc/components/Links/Link';

type TProps = {
  pagination: {
    count: number,
    offset: number,
    size: number,
    sort: string,
    total: number,
  },
};

const Pagination = (props: TProps) => {
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

const PaginationQuery = {
  fragments: {
    pagination: () => Relay.QL`
      fragment on ESPagination {
        total
        size
        count
        offset
        sort
      }
    `,
  },
};

export default compose(
  createContainer(PaginationQuery)
)(Pagination);
