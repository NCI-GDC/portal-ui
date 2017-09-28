// @flow

import React from 'react';
import { graphql } from 'react-relay';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) => (props: Object) => {
  return (
    <Query
      parentProps={props}
      name="PrimarySitesRing"
      minHeight={200}
      variables={props.variables}
      Component={Component}
      query={graphql`
        query PrimarySitesRing_relayQuery {
          viewer {
            repository {
              cases {
                aggregations {
                  primary_site {
                    buckets {
                      doc_count
                      key
                    }
                  }
                }
              }
            }
          }
        }
      `}
    />
  );
};
