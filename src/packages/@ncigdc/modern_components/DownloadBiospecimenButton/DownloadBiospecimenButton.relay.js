// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { parse } from 'query-string';
import { withRouter } from 'react-router-dom';
import { parseFilterParam } from '@ncigdc/utils/uri';
import { replaceFilters } from '@ncigdc/utils/filters';
import { compose, withPropsOnChange } from 'recompose';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    withPropsOnChange(
      ['location'],
      ({ location: { search }, match: { params } }) => {
        const q = parse(search);
        const f = {
          op: 'AND',
          content: [
            {
              op: 'NOT',
              content: {
                field: 'cases.samples.sample_id',
                value: 'MISSING',
              },
            },
          ],
        };
        const projectFilter = {
          op: 'AND',
          content: [
            {
              op: 'in',
              content: {
                field: 'project.project_id',
                value: [params.id],
              },
            },
          ],
        };
        return {
          variables: {
            filters: replaceFilters(
              replaceFilters(projectFilter, f),
              parseFilterParam(q.filters, null),
            ),
          },
        };
      },
    ),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        minHeight={53}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query DownloadBiospecimenButton_relayQuery(
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
