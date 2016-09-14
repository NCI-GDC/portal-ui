import { Link } from 'react-router';
import { div, span, h3, h } from 'react-hyperscript-helpers';

const TermFacet = props => {
  const wrapAnd = {
    op: 'and',
    content: [],
  };
  const dotField = props.field.replace(/__/g, '.');
  return div([
    h3(dotField),
    div(props.buckets.map(bucket => {
      const mergeFilters = (filters, b) => {
        console.log(filters, b);
        return {
          op: 'and',
          content: [
            ...filters.content,
            {
              op: 'in',
              content: {
                field: dotField,
                value: [b.key],
              },
            },
          ],
        };
      };

      const mergedFilters = mergeFilters(props.params.filters || wrapAnd, bucket);
      return div([
        h(Link, {
          to: {
            pathname: props.pathname,
            query: {
              ...props.params,
              offset: 0,
              filters: JSON.stringify(mergedFilters),
            },
          },
        }, bucket.key),
        span([bucket.doc_count]),
      ]);
    })),
  ]);
};

export default TermFacet;
