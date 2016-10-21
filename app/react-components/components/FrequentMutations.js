import React from 'react';

import Column from '../uikit/Flex/Column';
import Row from '../uikit/Flex/Row';
import BarChart from '../charts/BarChart';
import theme from '../theme';
import EntityPageHorizontalTable from './EntityPageHorizontalTable';

let FrequentMutations = ({
  frequentMutations,
  numCasesAggByProject,
  project,
  totalNumCases,
}) => (
  <Column style={{ paddingBottom: '2.5rem' }}>
    {!!frequentMutations.length &&
      <div>
        <div style={{ padding: `0 10px` }}>
          <BarChart
            data={frequentMutations.map(x => ({
              label: x.genomic_dna_change,
              value: (x.score),
              tooltip:
                `<b>${x.genomic_dna_change}</b><br />
                ${(x.num_affected_cases_project / numCasesAggByProject[project] * 100).toFixed(2)}%`
            }))}
            yAxis={{ title: 'Cases' }}
            height={300}
            styles={{
              xAxis: {stroke: theme.greyScale4, textFill: theme.greyScale3},
              yAxis: {stroke: theme.greyScale4, textFill: theme.greyScale3},
              bars: {fill: theme.secondary},
              tooltips: {
                fill: '#fff',
                stroke: theme.greyScale4,
                textFill: theme.greyScale3
              }
            }}
          />
        </div>

        <EntityPageHorizontalTable
          headings={[
            { key: 'genomic_dna_change', title: 'DNA Change' },
            { key: 'mutation_subtype', title: 'Type' },
            { key: 'consequence_type', title: 'Consequences' },
            {
              key: 'num_affected_cases_project',
              title: project
                ? <span># Affected Cases<br />in {project}</span>
                : <span># Affected Cases</span>,
            },
            ...(project ? {
              key: 'num_affected_cases_all',
              title: <span># Affected Cases<br />in All Projects</span>,
            } : {}),
          ]}
          data={frequentMutations.map(x => ({
            ...x,
            genomic_dna_change: <a href={`/mutations/${x.ssm_id}`}>{x.genomic_dna_change}</a>,
            num_affected_cases_project:
              `${x.num_affected_cases_project} / ${numCasesAggByProject[project]}
              (${(x.num_affected_cases_project/numCasesAggByProject[project]*100).toFixed(2)}%)`,
            num_affected_cases_all:
              `${x.num_affected_cases_all} / ${totalNumCases}
              (${(x.num_affected_cases_all/totalNumCases * 100).toFixed(2)}%)`,
          }))}
        />
      </div>
    }
    {!frequentMutations.length && 'No mutation data to display'}
  </Column>
);

export default FrequentMutations;
