import React from 'react';
import _ from 'lodash';
import { withState, withProps, lifecycle, compose } from 'recompose';
import FrequentMutations from './FrequentMutations';
import { PaginationContainer } from '../uikit/Pagination';

const impactColors = {
  HIGH: 'rgb(185, 36, 36)',
  MODERATE: 'rgb(193, 158, 54)',
  LOW: 'rgb(49, 161, 60)',
};

const initialState = {
  data: {
    hits: [],
    pagination: { total: 0 },
  },
  loading: true,
};

export default
compose(
  withState('state', 'setState', initialState),
  withProps({
    fetchData: async ({ api, projectId, offset = 0, setState }) => {
      setState(s => ({ ...s, loading: true }));
      const url = `${api}/analysis/frequent_mutations_by_project`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_ids: projectId,
          from: offset,
          fields: [
            'genomic_dna_change',
            'mutation_subtype',
            'ssm_id',
            'consequence.transcript.is_canonical',
            'impact',
            'consequence.transcript.consequence_type',
            'consequence.transcript.gene.gene_id',
            'consequence.transcript.gene_symbol',
            'consequence.transcript.aa_change',
            'occurrence.case.project.project_id',
          ].join(),
        }),
      });
      const { data } = await res.json();
      setState(() => ({ data, loading: false }));
    },
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchData(this.props);
    },
  })
)(({ state, ...props }) => {
  const frequentMutations = state.data.hits
    .map((hit) => {
      const { transcript } = hit.consequence.find(c => c.transcript.is_canonical);
      const { annotation = {}, consequence_type, gene, gene_symbol, aa_change } = transcript;
      const impact = annotation.impact;

      return {
        ...hit,
        score: hit._score,
        num_affected_cases_all: hit.occurrence.length,
        num_affected_cases_project: hit.occurrence.filter(o =>
          o.case.project.project_id === props.projectId
        ).length,
        num_affected_cases_by_project: hit.occurrence.reduce((acc, o) => ({
          ...acc,
          [o.case.project.project_id]: acc[o.case.project.project_id] ? acc[o.case.project.project_id] + 1 : 1,
        }), {}),
        impact,
        consequence_type: (
          <span>
            <b>{_.startCase(consequence_type.replace('variant', ''))}</b>
            <span style={{ marginLeft: '5px' }}>
              <a href={`/genes/${gene.gene_id}`}>
                {gene_symbol}
              </a>
            </span>
            <span
              style={{
                marginLeft: '5px',
                color: impactColors[impact] || 'inherit',
              }}
            >
              {_.truncate(aa_change)}
            </span>
          </span>
        ),
      };
    });

  return (
    <PaginationContainer
      total={state.data.pagination.total}
      onChange={pageInfo => props.fetchData({ ...props, ...pageInfo })}
      entityType="Mutations"
      loading={state.loading}
    >
      <FrequentMutations
        frequentMutations={frequentMutations}
        numCasesAggByProject={props.numCasesAggByProject}
        totalNumCases={props.totalNumCases}
        projectId={props.projectId}
        defaultSurvivalRawData={props.defaultSurvivalRawData}
        defaultSurvivalLegend={props.defaultSurvivalLegend}
        api={props.api}
        width={props.width}
        showSurvivalPlot={props.showSurvivalPlot}
      />
    </PaginationContainer>
  );
});
