/* @flow */
import React from 'react';
import { replaceFilters } from '@ncigdc/utils/filters';
import Link from './Link';

const ExploreSSMLink = ({
  children,
  filters,
  searchTableTab,
  merge = false,
}) => {
  return (
    <Link
      merge={merge}
      pathname="/exploration"
      query={{
        searchTableTab,
        filters: replaceFilters(
          {
            op: 'and',
            content: [
              {
                op: 'NOT',
                content: {
                  field: 'ssms.ssm_id',
                  value: 'MISSING',
                },
              },
              {
                op: 'in',
                content: {
                  field: 'cases.available_variation_data',
                  value: ['ssm'],
                },
              },
            ],
          },
          filters,
        ),
      }}>
      {children}
    </Link>
  );
};

export default ExploreSSMLink;
