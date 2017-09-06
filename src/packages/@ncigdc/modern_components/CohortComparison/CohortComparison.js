import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withProps } from 'recompose';
import Table, { Tr, Td, Th } from '@ncigdc/uikit/Table';
import { withTheme } from '@ncigdc/theme';
import { Row } from '@ncigdc/uikit/Flex';
import SurvivalPlotWrapper from '@ncigdc/components/SurvivalPlotWrapper';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
import { getDefaultCurve } from '@ncigdc/utils/survivalplot';
import FacetTable from './FacetTable';

const mapping = {
  'demographic.gender': 'Gender',
  'diagnoses.vital_status': 'Vital Status',
  'demographic.race': 'Race',
};

const initialState = {
  loading: true,
};

const Alias = ({ i, style = { fontWeight: 'bold' } }) =>
  <span style={style}><em>S</em><sub>{i}</sub></span>;

export default compose(
  connect(({ sets }) => ({ sets })),
  withState('defaultSurvivalData', 'setDefaultSurvivalData', {}),
  withState('selectedSurvivalData', 'setSelectedSurvivalData', {}),
  withState('state', 'setState', initialState),
  withProps(
    ({
      set1,
      set2,
      selectedSurvivalData,
      defaultSurvivalData,
      setDefaultSurvivalData,
      setSelectedSurvivalData,
      setState,
    }) => ({
      survivalData: {
        legend: selectedSurvivalData.legend || defaultSurvivalData.legend,
        rawData: selectedSurvivalData.rawData || defaultSurvivalData.rawData,
      },
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

        setDefaultSurvivalData(survivalData);
        setSelectedSurvivalData({});

        setState(s => ({
          ...s,
          loading: false,
        }));
      },
    }),
  ),
  withPropsOnChange(['set1', 'set2'], ({ updateData }) => {
    updateData();
  }),
  withTheme,
)(
  ({
    facets,
    sets,
    set1,
    set2,
    theme,
    survivalData,
    viewer: { repository: { result1, result2 } },
  }) => {
    const data1 = JSON.parse(result1.facets);
    const data2 = JSON.parse(result2.facets);

    const set1_name = sets.case[set1];
    const set1_colour = 'rgb(158, 124, 36)';
    const set2_name = sets.case[set2];
    const set2_colour = 'rgb(29, 97, 135)';

    return (
      <Row style={{ margin: '0 3rem' }}>
        <div style={{ flex: 8 }}>
          <h1>Cohort Comparison</h1>
          <Table
            headings={[
              <Th key="1" style={{ backgroundColor: 'white' }}>
                Selected Cohorts
              </Th>,
              <Th
                key="2"
                style={{ textAlign: 'right', backgroundColor: 'white' }}
              >
                # of cases
              </Th>,
            ]}
            body={
              <tbody>
                <Tr>
                  <Td style={{ width: '150px', color: set1_colour }}>
                    <Alias i={1} /> : {set1_name}
                  </Td>
                  <Td style={{ textAlign: 'right' }}>{result1.hits.total}</Td>
                </Tr>
                <Tr>
                  <Td style={{ width: '150px', color: set2_colour }}>
                    <Alias i={2} /> : {set2_name}
                  </Td>
                  <Td style={{ textAlign: 'right' }}>{result2.hits.total}</Td>
                </Tr>
              </tbody>
            }
          />

          <h2>Survival Analysis</h2>
          <div style={{ width: '50%' }}>
            <SurvivalPlotWrapper {...survivalData} height={240} />
            {survivalData.rawData &&
              <Table
                headings={[
                  <Th>Cases included in Analysis</Th>,
                  <Th style={{ textAlign: 'right' }}>
                    # of items in <Alias i={1} />
                  </Th>,
                  <Th style={{ textAlign: 'right' }}>%</Th>,
                  <Th style={{ textAlign: 'right' }}>
                    # of items in <Alias i={2} />
                  </Th>,
                  <Th style={{ textAlign: 'right' }}>%</Th>,
                ]}
                body={
                  <tbody>
                    <Tr>
                      <Td width={250}>Overall Survival Analysis</Td>
                      <Td style={{ textAlign: 'right' }}>
                        {survivalData.rawData.results[0] &&
                          survivalData.rawData.results[0].donors.length}
                      </Td>
                      <Td style={{ textAlign: 'right' }}>
                        {survivalData.rawData.results[0] &&
                          (survivalData.rawData.results[0].donors.length /
                            result1.hits.total *
                            100).toFixed(0)}%
                      </Td>
                      <Td style={{ textAlign: 'right' }}>
                        {survivalData.rawData.results[1] &&
                          survivalData.rawData.results[1].donors.length}
                      </Td>
                      <Td style={{ textAlign: 'right' }}>
                        {survivalData.rawData.results[1] &&
                          (survivalData.rawData.results[1].donors.length /
                            result2.hits.total *
                            100).toFixed(0)}%
                      </Td>
                    </Tr>
                  </tbody>
                }
              />}
          </div>

          {facets.map(field =>
            FacetTable({
              mapping,
              field,
              data1,
              data2,
              result1,
              result2,
              Alias,
            }),
          )}
        </div>
        <div style={{ flex: 4 }} />
      </Row>
    );
  },
);
