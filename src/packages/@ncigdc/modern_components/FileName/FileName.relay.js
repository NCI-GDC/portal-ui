// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { makeFilter } from '@ncigdc/utils/filters';
import { compose, withPropsOnChange, branch, renderComponent } from 'recompose';
import { BaseQuery } from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    branch(
      ({ fileId }) => !fileId,
      renderComponent(() => <div><pre>fileId</pre> must be provided</div>),
    ),
    withPropsOnChange(['fileId'], ({ fileId }) => {
      return {
        variables: {
          filters: makeFilter([
            {
              field: 'files.file_id',
              value: [fileId],
            },
          ]),
        },
      };
    }),
  )((props: Object) => {
    return (
      <BaseQuery
        parentProps={props}
        name="FileName"
        variables={props.variables}
        Component={Component}
        query={graphql`
        query FileName_relayQuery(
          $filters: FiltersArgument
        ) {
          viewer {
            repository {
              files {
                hits(filters: $filters first: 1) {
                  edges {
                    node {
                      file_name
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
  });
