import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { compose, withState, withProps } from 'recompose';
import Table, { Tr, Td, Th } from '@ncigdc/uikit/Table';
import { withTheme } from '@ncigdc/theme';
import { Row } from '@ncigdc/uikit/Flex';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
import { getDefaultCurve } from '@ncigdc/utils/survivalplot';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import Venn, { buildOps } from '@ncigdc/components/Charts/Venn';
import withSize from '@ncigdc/utils/withSize';
import CreateOrOpenAnalysis from '@ncigdc/components/CreateOrOpenAnalysis';
import FacetTable from './FacetTable';
import Survival from './Survival';

const mapping = {
  'demographic.gender': 'Gender',
  'diagnoses.vital_status': 'Vital Status',
  'demographic.race': 'Race',
};

const initialState = {
  loading: true,
};

const Alias = ({ i, style = { fontWeight: 'bold' } }) => (
  <span style={style}>
    <em>S</em>
    <sub>{i}</sub>
  </span>
);

export default compose(
  connect(({ sets }) => ({ sets })),
  withState('survivalData', 'setSurvivalData', {}),
  withState('state', 'setState', initialState),
  withProps(({ set1, set2, setSurvivalData, setState }) => ({
    updateData: async () => {
      const survivalData = await getDefaultCurve({
        currentFilters: [
          {
            op: 'in',
            content: { field: 'cases.case_id', value: `set_id:${set1}` },
          },
          {
            op: 'in',
            content: { field: 'cases.case_id', value: `set_id:${set2}` },
          },
        ],
      });

      setSurvivalData(survivalData);

      setState(s => ({
        ...s,
        loading: false,
      }));
    },
  })),
  withPropsOnChange(['set1', 'set2'], ({ updateData }) => {
    updateData();
  }),
  withTheme,
  withSize(),
)(
  ({
    facets,
    sets,
    set1,
    set2,
    theme,
    survivalData,
    viewer: { repository: { result1, result2 } },
    size: { width },
  }) => {
    const data1 = JSON.parse(result1.facets);
    const data2 = JSON.parse(result2.facets);

    const set1_name = _.truncate(sets.case[set1], { length: 50 });
    const set1_colour = 'rgb(158, 124, 36)';
    const set2_name = _.truncate(sets.case[set2], { length: 50 });
    const set2_colour = 'rgb(29, 97, 135)';
    const Set1 = (
      <span style={{ color: set1_colour, fontWeight: 'bold' }}>
        {set1_name}
      </span>
    );
    const Set2 = (
      <span style={{ color: set2_colour, fontWeight: 'bold' }}>
        {set2_name}
      </span>
    );
    const ops = buildOps({ setIds: [set1, set2], type: 'case' });

    return (
      <div style={{ width: '90%', padding: '0 3rem 2rem' }}>
        <h1>Cohort Comparison</h1>
        <Table
          style={{ width: '400px' }}
          headings={[
            <Th key="1" style={{ backgroundColor: 'white' }}>
              Selected Cohorts
            </Th>,
            <Th
              key="2"
              style={{ textAlign: 'right', backgroundColor: 'white' }}
            >
              # Cases
            </Th>,
          ]}
          body={
            <tbody>
              <Tr>
                <Td style={{ width: '150px', color: set1_colour }}>
                  <Alias i={1} /> : {Set1}
                </Td>
                <Td style={{ textAlign: 'right' }}>
                  <ExploreLink
                    query={{
                      searchTableTab: 'cases',
                      filters: {
                        op: 'AND',
                        content: [
                          {
                            op: 'IN',
                            content: {
                              field: `cases.case_id`,
                              value: [`set_id:${set1}`],
                            },
                          },
                        ],
                      },
                    }}
                  >
                    {result1.hits.total.toLocaleString()}
                  </ExploreLink>
                </Td>
              </Tr>
              <Tr>
                <Td style={{ width: '150px', color: set2_colour }}>
                  <Alias i={2} /> : {Set2}
                </Td>
                <Td style={{ textAlign: 'right' }}>
                  <ExploreLink
                    query={{
                      searchTableTab: 'cases',
                      filters: {
                        op: 'AND',
                        content: [
                          {
                            op: 'IN',
                            content: {
                              field: `cases.case_id`,
                              value: [`set_id:${set2}`],
                            },
                          },
                        ],
                      },
                    }}
                  >
                    {result2.hits.total.toLocaleString()}
                  </ExploreLink>
                </Td>
              </Tr>
            </tbody>
          }
        />
        <Row>
          <Survival
            survivalData={survivalData}
            result1={result1}
            Alias={Alias}
            result2={result2}
            set1id={set1}
            set2id={set2}
            palette={[set1_colour, set2_colour]}
            style={{ flex: 1, width: 100 }}
          />
          <div style={{ marginLeft: 50, flex: 1, width: 100 }}>
            <h2>
              <span style={{ marginRight: 10 }}>Cohorts Venn Diagram</span>
              <CreateOrOpenAnalysis
                type="set_operations"
                sets={{ case: [set1, set2] }}
                style={{
                  color: 'rgb(43, 118, 154)',
                  fontSize: '0.6em',
                  textDecoration: 'underline',
                  display: 'inline-block',
                }}
              >
                Open in new tab
              </CreateOrOpenAnalysis>
            </h2>

            <Venn
              type="case"
              width={width / 2 - 50}
              data={[set1, set2]}
              ops={ops}
              getFillColor={d => 'rgb(237, 237, 237)'}
            />
          </div>
        </Row>

        {facets.map(field =>
          FacetTable({
            key: field,
            Alias,
            mapping,
            field,
            data1,
            data2,
            result1,
            result2,
            Set1,
            Set2,
            set1,
            set2,
            palette: [set1_colour, set2_colour],
          }),
        )}
      </div>
    );
  },
);
