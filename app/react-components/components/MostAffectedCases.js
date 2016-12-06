import React from 'react';

import Column from '../uikit/Flex/Column';
import Row from '../uikit/Flex/Row';
import BarChart from '../charts/BarChart';
import theme from '../theme';
import EntityPageHorizontalTable from './EntityPageHorizontalTable';
import ageDisplay from '../utils/ageDisplay';
import { DATA_CATEGORIES } from '../utils/constants';
import Tooltip from '../uikit/Tooltip';
import makeFilter from '../utils/makeFilter';

let MostAffectedCases = ({
  mostAffectedCases,
  project
}) => (
  <Column>
    {!!mostAffectedCases.length &&
      <div>
        <div style={{ padding: `0 2rem` }}>
          <BarChart
            data={mostAffectedCases.map(c => ({
              label: `${c.case_id.substring(0, 14)}\u2026`,
              value: c.gene.length,
              tooltip: `${c.case_id}<br />${c.gene.length} Genes Affected`,
              href: `cases/${c.case_id}`
            }))}
            margin={{ top: 30, right: 50, bottom: 105, left: 30 }}
            height={250}
            yAxis={{ title: '# Genes Affected' }}
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
            { key: 'id', title: 'UUID' },
            { key: 'primary_site', title: 'Site' },
            { key: 'gender', title: 'Gender' },
            { key: 'age_at_diagnosis', title: 'Age at Diagnosis'},
            { key: 'tumor_stage', title: 'Stage'},
            { key: 'days_to_death',
              title: <Tooltip innerHTML='Survival (days)'>Survival</Tooltip>
            },
            { key: 'days_to_last_follow_up',
              title: <Tooltip innerHTML='Days to Last Follow Up'>Last Follow<br />Up</Tooltip>,
              style: { textAlign: 'right' },
            },
            { key: 'data_types',
              title: 'Available Files per Data Category',
              style: { textAlign: 'right' },
              subheadings: Object.keys(DATA_CATEGORIES).map(
                k => (
                  <abbr key={DATA_CATEGORIES[k].abbr}>
                    <Tooltip innerHTML={DATA_CATEGORIES[k].full}>
                      {DATA_CATEGORIES[k].abbr}
                    </Tooltip>
                  </abbr>)
              )
            },
            {
              key: 'num_mutations', title: '#Mutations',
              style: { textAlign: 'right' },
            },
            {
              key: 'num_genes', title: '#Genes',
              style: { textAlign: 'right' },
            },
          ]}
          data={mostAffectedCases.map(c => {
            const dataCategorySummary = c.summary.data_categories.reduce((acc, c) => ({ ...acc, [c.data_category]: c.file_count }), {});
            return {
              id: <a href={`/cases/${c.case_id}`}>{c.case_id}</a>,
              primary_site: c.project.primary_site,
              gender: c.demographic.gender,
              age_at_diagnosis: ageDisplay(c.diagnoses[0].age_at_diagnosis),
              tumor_stage: c.diagnoses[0].tumor_stage,
              days_to_last_follow_up: c.diagnoses[0].days_to_last_follow_up,
              num_mutations: c.gene.reduce((sum, g) => sum + g.ssm.length, 0),
              num_genes: c.gene.length,
              data_types: Object.keys(DATA_CATEGORIES).map(k => (
                dataCategorySummary[DATA_CATEGORIES[k].full] ?
                  <a href={
                    `/search/f?filters=${ makeFilter([
                      { field: 'cases.case_id', value: c.case_id},
                      { field: 'files.data_category', value: DATA_CATEGORIES[k].full},
                    ]) }`
                  }>{dataCategorySummary[DATA_CATEGORIES[k].full]}</a> :
                  '--'
              )
            )};
          })}
        />
      </div>
    }
    {!mostAffectedCases.length &&
      <span style={{padding: `2rem`}}>No most affected case data to display</span>
    }
  </Column>
);

export default MostAffectedCases;
