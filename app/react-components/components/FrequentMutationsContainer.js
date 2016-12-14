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

export default
compose(
  withState('fm', 'setState', {}),
  withProps({
    fetchData: async props => {
      const url =
        `${props.$scope.config.es_host}/${props.$scope.config.es_index_version}-ssm-centric/ssm-centric/_search`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: props.offset || 0,
          query: {
            nested: {
              path: 'occurrence',
              score_mode: 'sum',
              query: {
                function_score: {
                  query: {
                    terms: {
                      'occurrence.case.project.project_id': [
                        props.$scope.project.project_id,
                      ],
                    },
                  },
                  boost_mode: 'replace',
                  script_score: {
                    script: "doc['occurrence.case.project.project_id'].empty ? 0 : 1",
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
  if (!props.fm.hits) return null;

  const frequentMutations = props.fm.hits.map(g => Object.assign({}, g._source, { score: g._score })).map(x => {
    const consequence = x.consequence.find(c => c.transcript.is_canonical);

    return {
      ...x,
      num_affected_cases_project: x.occurrence.filter(o =>
        o.case.project.project_id === props.$scope.project.project_id
      ).length,
      num_affected_cases_by_project: x.occurrence.reduce((acc, o) => ({
        ...acc,
        [o.case.project.project_id]: acc[o.case.project.project_id] ? acc[o.case.project.project_id] + 1 : 1,
      }), {}),
      num_affected_cases_all: x.occurrence.length,
      impact: consequence.transcript.annotation.impact,
      consequence_type: (
        <span>
          <b>{_.startCase(consequence.transcript.consequence_type.replace('variant', ''))}</b>
          <span style={{ marginLeft: '5px' }}>
            <a href={`/genes/${consequence.transcript.gene.gene_id}`}>
              {consequence.transcript.gene_symbol}
            </a>
          </span>
          <span
            style={{
              marginLeft: '5px',
              color: impactColors[consequence.transcript.annotation.impact] || 'inherit',
            }}
          >
            {_.truncate(consequence.transcript.aa_change)}
          </span>
        </span>
      ),
    };
  });
  return (
    <PaginationContainer
      total={props.fm.total}
      onChange={pageInfo => props.fetchData({ ...props, ...pageInfo })}
      entityType="Mutations"
    >
      <FrequentMutations
        frequentMutations={frequentMutations}
        numCasesAggByProject={props.numCasesAggByProject}
        totalNumCases={props.totalNumCases}
        project={props.$scope.project.project_id}
        survivalData={props.survivalData}
        width={props.width}
      />
    </PaginationContainer>
  );
});
