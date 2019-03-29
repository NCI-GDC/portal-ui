import React from 'react';
import Query from '@ncigdc/modern_components/Query';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { connect } from 'react-redux';

export default (Component: ReactClass<*>) =>
  compose(
    connect((state: any, props: any) => ({
      currentAnalysis: state.analysis.saved.find(a => a.id === props.id),
    })),
    withPropsOnChange(
      ['clinicalAnalysisFields', 'currentAnalysis'],
      ({ clinicalAnalysisFields, currentAnalysis }) => {
        const facets = clinicalAnalysisFields
          .map(field => field.name.replace('__', '.'))
          .join(',');
        const setId = Object.keys(currentAnalysis.sets.case)[0];
        return {
          variables: {
            filters: {
              op: 'and',
              content: [
                {
                  op: '=',
                  content: {
                    field: `cases.case_id`,
                    value: [`set_id:${setId}`],
                  },
                },
              ],
            },
            facets,
          },
        };
      }
    )
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        variables={props.variables}
        Component={Component}
        minHeight={800}
        query={graphql`query ClinicalAnalysisResult_relayQuery($filters: FiltersArgument, $facets: [String]!) {
          viewer {
            explore {
              cases {
                facets(facets: $facets filters: $filters)
                hits(first: 0 filters: $filters) {
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
