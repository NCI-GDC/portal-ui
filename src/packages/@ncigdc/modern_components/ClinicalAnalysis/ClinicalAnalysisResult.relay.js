import React from 'react';
import Query from '@ncigdc/modern_components/Query';
import { graphql } from 'react-relay';
import {
  branch,
  compose,
  renderComponent,
  setDisplayName,
  withProps,
  withPropsOnChange,
} from 'recompose';
import { connect } from 'react-redux';

import DeprecatedSetResult from './DeprecatedSetResult';

export default (Component: ReactClass<*>) => compose(
  setDisplayName('EnhancedClinicalAnalysisResult_Relay'),
  connect((state: any, props: any) => ({
    allSets: state.sets,
    currentAnalysis: state.analysis.saved.find(a => a.id === props.id),
  })),
  withProps(({ currentAnalysis }) => ({
    currentSetId: Object.keys(currentAnalysis.sets.case)[0],
  })),
  branch(
    ({ allSets, currentSetId }) => !currentSetId.includes('demo') && !allSets.case[currentSetId],
    renderComponent(({
      allSets, currentAnalysis, dispatch, Icon,
    }) => (
      <DeprecatedSetResult
        allSets={allSets}
        currentAnalysis={currentAnalysis}
        dispatch={dispatch}
        Icon={Icon}
        />
    ))
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
          facets,
          filters: {
            content: [
              {
                content: {
                  field: 'cases.case_id',
                  value: [`set_id:${setId}`],
                },
                op: '=',
              },
            ],
            op: 'and',
          },
        },
      };
    }
  )
)((props: Object) => (
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
        }`}
      variables={props.variables}
      />
));
