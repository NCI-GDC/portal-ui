import React from 'react';
import { Link } from 'react-router';

const TermFacet = props => {
  const wrapAnd = {
    op: 'and',
    content: [],
  };
  const dotField = props.field.replace(/__/g, '.');
  return (
    <div>
      <h3>{dotField}</h3>
      <div>
        {props.buckets.map(bucket => {
          const mergeFilters = (filters, b) => (
            {
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
            }
          );

          const mergedFilters = mergeFilters(props.params.filters || wrapAnd, bucket);
          return (
            <div key={bucket.key.replace(' ', '_')}>
              <Link
                to={{
                  pathname: props.pathname,
                  query: {
                    ...props.params,
                    offset: 0,
                    filters: JSON.stringify(mergedFilters),
                  },
                }}
              >
                {bucket.key}
              </Link>
              <span>{bucket.doc_count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TermFacet;
