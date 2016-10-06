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
  pathname: string,
  relay: {
    route: {
      params: {
        filters: mixed,
        first: number,
        offset: number,
      },
    },
  },
};

const Pagination = (props: TProps) => {
  const filters = (
    props.relay.route.params.filters
      ? props.relay.route.params.filters
      : null
  );

  const merge = query => ({
    ...props.relay.route.params,
    ...query,
  });

  const to = offset => ({
    pathname: props.pathname,
    query: merge({
      offset,
      filters,
    }),
  });

  const params = props.relay.route.params;
  const pagination = props.pagination;

  return (
    <div>
      <Link merge query={{ to: to(0) }}>{' << '}</Link>
      <Link merge query={{ to: to(params.offset - params.first) }}>{' < '}</Link>
      <Link merge query={{ to: to(params.offset + params.first) }}>{' > '}</Link>
      <Link merge query={{ to: to(pagination.total - (pagination.total % pagination.size)) }}>{' >> '}</Link>
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
