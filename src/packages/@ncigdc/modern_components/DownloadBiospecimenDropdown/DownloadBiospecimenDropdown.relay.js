// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { parse } from 'query-string';
import { parseFilterParam } from '@ncigdc/utils/uri';
import { replaceFilters } from '@ncigdc/utils/filters';
import { compose, withPropsOnChange } from 'recompose';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    withPropsOnChange(['filters'], ({ filters }) => {
      return {
        variables: {
          filters,
        },
      };
    }),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        minHeight={53}
        style={{ width: 'auto' }}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query DownloadBiospecimenDropdown_relayQuery(
            $filters: FiltersArgument
          ) {
            viewer {
              repository {
                cases {
                  hits(first: 0, filters: $filters) {
                    total
                  }
                }
              }
            }
          }
        `}
      />
    );
  });
