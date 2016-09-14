import Relay from 'react-relay';
import { Link } from 'react-router';
import { div, h } from 'react-hyperscript-helpers';
import { prepareJsonParam } from 'routes/utils';

export const Pagination = props => {
  console.log('Pagination', props);

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

  return div([
    h(Link, { to: to(0) }, ' << '),
    h(Link, { to: to(params.offset - params.first) }, ' < '),
    h(Link, { to: to(params.offset + params.first) }, ' > '),
    h(Link, { to: to(pagination.total - pagination.total % pagination.size) }, ' >> '),
  ]);
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
