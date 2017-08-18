// @flow

import React from 'react';
import { graphql } from 'react-relay';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) => (props: Object) => {
  return (
    <Query
      parentProps={props}
      minHeight={259}
      variables={props.variables}
      Component={Component}
      query={graphql`
        query PortalSummary_relayQuery {
          viewer {
            projects {
              aggregations {
                primary_site {
                  buckets {
                    key
                  }
                }
              }
              hits(first: 0) {
                total
              }
            }
            repository {
              cases {
                hits(first: 0) {
                  total
                }
              }
              files {
                hits(first: 0) {
                  total
                }
              }
            }
            explore {
              genes {
                hits(first: 0) {
                  total
                }
              }
              ssms {
                hits(first: 0) {
                  total
                }
              }
            }
          }
        }
      `}
    />
  );
};
