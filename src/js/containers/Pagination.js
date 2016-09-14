import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import { prepareJsonParam } from 'routes/utils';

export const Pagination = props => {
  const filters = (
    props.relay.route.params.filters
      ? prepareJsonParam(props.relay.route.params.filters)
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
      <Link to={to(0)}>{' << '}</Link>
      <Link to={to(params.offset - params.first)}>{' < '}</Link>
      <Link to={to(params.offset + params.first)}>{' > '}</Link>
      <Link to={to(pagination.total - (pagination.total % pagination.size))}>{' >> '}</Link>
    </div>
  );
};

export default Relay.createContainer(Pagination, {
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
});
