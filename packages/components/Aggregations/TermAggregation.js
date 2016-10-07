/* @flow */

import React from 'react';
import Link from '../Links/Link';

import type { TBucket } from './types';

type TProps = {
  buckets: [TBucket],
  field: string,
};

const TermAggregation = (props: TProps) => {
  const dotField = props.field.replace(/__/g, '.');

  return (
    <div>
      <h3>dotField</h3>
      <div>{
        props.buckets.map(bucket => (
          <div key={bucket.key}>
            <Link
              merge
              query={{
                offset: 0,
                filters: {
                  op: 'and',
                  content: [{
                    op: 'in',
                    content: {
                      field: dotField,
                      value: [bucket.key],
                    },
                  }],
                },
              }}
            >
              {bucket.key}
            </Link>
            <span>{bucket.doc_count}</span>
          </div>
        ))
      }</div>
    </div>
  );
};

export default TermAggregation;
