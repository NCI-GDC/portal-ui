/* @flow */

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import Query from '@ncigdc/modern_components/Query';
import significantConsequences from '@ncigdc/utils/filters/prepared/significantConsequences';
import withFilters from '@ncigdc/utils/withFilters';
import withRouter from '@ncigdc/utils/withRouter';

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    withFilters(),
    withPropsOnChange(
      ['activeTranscript', 'filters', 'location'],
      ({ activeTranscript, filters }) => {
        return {
          variables: {
            score: 'occurrence.case.project.project_id',
            first: 10000,
            filters: {
              op: 'and',
              content: [
                significantConsequences,
                {
                  op: '=',
                  content: {
                    field: 'consequence.transcript.transcript_id',
                    value: [activeTranscript.transcript_id],
                  },
                },
                ...(filters ? filters.content : []),
              ],
            },
          },
        };
      },
    ),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        name="Lolliplot"
        minHeight={387}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query Lolliplot_relayQuery(
            $filters: FiltersArgument
            $first: Int
            $score: String
          ) {
            analysis {
              protein_mutations {
                data(
                  first: $first
                  score: $score
                  filters: $filters
                  fields: [
                    "ssm_id"
                    "genomic_dna_change"
                    "consequence.transcript.aa_change"
                    "consequence.transcript.aa_start"
                    "consequence.transcript.consequence_type"
                    "consequence.transcript.is_canonical"
                    "consequence.transcript.transcript_id"
                    "consequence.transcript.annotation.impact"
                    "consequence.transcript.gene.gene_id"
                    "consequence.transcript.gene.symbol"
                  ]
                )
              }
            }
          }
        `}
      />
    );
  });
