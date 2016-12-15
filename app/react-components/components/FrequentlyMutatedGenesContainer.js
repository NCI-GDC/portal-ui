import React from 'react';
import { withState, withProps, lifecycle, compose } from 'recompose';
import FrequentlyMutatedGenes from './FrequentlyMutatedGenes';
import { PaginationContainer } from '../uikit/Pagination';

export default
compose(
  withState('data', 'setState', {}),
  withProps({
    fetchData: async props => {
      const url =
        `${props.config.es_host}/${props.config.es_index_version}-gene-centric/gene-centric/_search`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: {
            nested: {
              path: 'case',
              score_mode: 'sum',
              query: {
                function_score: {
                  query: {
                    terms: {
                      'case.project.project_id': [
                        props.projectId,
                      ],
                    },
                  },
                  boost_mode: 'replace',
                  script_score: {
                    script: "doc['case.project.project_id'].empty ? 0 : 1",
                  },
                },
              },
            },
          },
        }),
      });

      const { hits } = await res.json();
      props.setState(() => hits);
    },
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchData(this.props);
    },
  })
)(props => {
  if (!props.data.hits) return null;

  const mutatedGenesChartData = props.data.hits.map(({ _source: g }) => ({
    gene_id: g.gene_id,
    symbol: g.symbol,
    cytoband: g.cytoband,
    num_affected_cases_project: g.case.filter(c => c.project.project_id === props.projectId).length,
    num_affected_cases_all: g.case.length,
    num_affected_cases_by_project: g.case.reduce((acc, c) => ({
      ...acc,
      [c.project.project_id]: acc[c.project.project_id] ? acc[c.project.project_id] + 1 : 1,
    }), {}),
    num_mutations: g.case.reduce((acc, c) => acc + c.ssm.length, 0),
  }));

  return (
    <PaginationContainer
      total={props.fm.total}
      onChange={pageInfo => props.fetchData({ ...props, ...pageInfo })}
      entityType="Genes"
    >
      <FrequentlyMutatedGenes
        mutatedGenesChartData={mutatedGenesChartData}
        numCasesAggByProject={props.numCasesAggByProject}
        survivalData={props.survivalData}
        setSelectedSurvivalData={props.setSelectedSurvivalData}
        selectedSurvivalData={props.selectedSurvivalData}
        width={props.width}
        totalNumCases={props.totalNumCases}
        projectId={props.projectId}
        api={props.api}
      />
    </PaginationContainer>
  );
});
