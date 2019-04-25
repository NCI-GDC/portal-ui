import React from 'react';
import Query from '@ncigdc/modern_components/Query';
import { graphql } from 'react-relay';
import {
  compose,
  withPropsOnChange,
  branch,
  renderComponent,
  withProps,
} from 'recompose';
import { connect } from 'react-redux';

import DeprecatedSetResult from './DeprecatedSetResult';

export default (Component: ReactClass<*>) => compose(
  connect((state: any, props: any) => ({
    currentAnalysis: state.analysis.saved.find(a => a.id === props.id),
    allSets: state.sets,
  })),
  withProps(({ currentAnalysis, allSets }) => ({
    currentSetId: Object.keys(currentAnalysis.sets.case)[0],
  })),
  branch(
    ({ currentSetId, allSets }) => !currentSetId.includes('demo') && !allSets.case[currentSetId],
    renderComponent(({
      currentAnalysis, allSets, dispatch, Icon,
    }) => {
      return (
        <DeprecatedSetResult
          allSets={allSets}
          currentAnalysis={currentAnalysis}
          dispatch={dispatch}
          Icon={Icon} />
      );
    })
  ),
  withPropsOnChange(
    ['clinicalAnalysisFields', 'currentAnalysis'],
    ({ clinicalAnalysisFields, currentAnalysis }) => {
      const facets = clinicalAnalysisFields
        .map(field => field.name.replace(/__/g, '.'))
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
                  field: 'cases.case_id',
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
      Component={Component}
      minHeight={800}
      parentProps={props}
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
      variables={props.variables} />
  );
});
