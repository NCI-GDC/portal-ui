import React from 'react';
import { compose } from 'recompose';
import SurvivalPlotWrapper from '@ncigdc/components/SurvivalPlotWrapper';
import Table, { Tr, Td, Th } from '@ncigdc/uikit/Table';
import { Row } from '@ncigdc/uikit/Flex';
import Tooltip from '@ncigdc/uikit/Tooltip/Tooltip';
import { tableToolTipHint } from '@ncigdc/theme/mixins';
import { stringifyJSONParam } from '@ncigdc/utils/uri';
import CreateExploreCaseSetButton from '@ncigdc/modern_components/setButtons/CreateExploreCaseSetButton';
import withRouter from '@ncigdc/utils/withRouter';

const survivalFilters = [
  {
    op: 'or',
    content: [
      { op: 'not', content: { field: 'diagnoses.days_to_death' } },
      { op: 'not', content: { field: 'diagnoses.days_to_last_follow_up' } },
    ],
  },
  { op: 'not', content: { field: 'diagnoses.vital_status' } },
];

export default compose(
  withRouter,
)(
  ({
    survivalData,
    result1,
    result2,
    Set1,
    Set2,
    palette,
    set1id,
    set2id,
    push,
    CaseSetButton = props =>
      <CreateExploreCaseSetButton
        filters={{
          op: 'AND',
          content: [
            ...survivalFilters,
            {
              op: 'IN',
              content: {
                field: `cases.case_id`,
                value: [`set_id:${props.setId}`],
              },
            },
          ],
        }}
        onComplete={setId => {
          push({
            pathname: '/exploration',
            query: {
              searchTableTab: 'cases',
              filters: stringifyJSONParam({
                op: 'AND',
                content: [
                  {
                    op: 'IN',
                    content: {
                      field: `cases.case_id`,
                      value: [`set_id:${setId}`],
                    },
                  },
                ],
              }),
            },
          });
        }}
        Component={p =>
          <span
            {...p}
            style={{
              cursor: 'pointer',
              color: 'rgb(43, 118, 154)',
              textDecoration: 'underline',
            }}
          >
            {props.count}
          </span>}
      />,
  }) =>
    <span style={{ marginTop: 10 }}>
      <Row>
        <h2>Survival Analysis</h2>
      </Row>
      <div>
        <SurvivalPlotWrapper {...survivalData} palette={palette} height={240} />
        {survivalData.rawData &&
          <Table
            headings={[
              <Th key="1">
                <Tooltip
                  style={tableToolTipHint()}
                  Component={
                    <span>
                      Criteria to include Case from your sets in the survival
                      analysis:<br />
                      - Case does not overlap between your selected sets<br />
                      - Case has complete data for the purpose of the analysis
                      (event and time-to-event)
                    </span>
                  }
                >
                  Cases included in Analysis
                </Tooltip>
              </Th>,
              <Th key="2" style={{ textAlign: 'right' }}>
                # Cases
              </Th>,
              <Th key="3" style={{ textAlign: 'right' }}>%</Th>,
              <Th key="4" style={{ textAlign: 'right' }}>
                # Cases
              </Th>,
              <Th key="5" style={{ textAlign: 'right' }}>%</Th>,
            ]}
            body={
              <tbody>
                <Tr index={0}>
                  <Td width={250}>Overall Survival Analysis</Td>
                  <Td style={{ textAlign: 'right' }}>
                    {survivalData.rawData.results[0] &&
                      !survivalData.rawData.results[0].donors.length > 0
                      ? 0
                      : <CaseSetButton
                          setId={set1id}
                          count={survivalData.rawData.results[0].donors.length.toLocaleString()}
                        />}
                  </Td>
                  <Td style={{ textAlign: 'right' }}>
                    {survivalData.rawData.results[0] &&
                      (survivalData.rawData.results[0].donors.length /
                        result1.hits.total *
                        100).toFixed(0)}%
                  </Td>
                  <Td style={{ textAlign: 'right' }}>
                    {survivalData.rawData.results[1] &&
                      !survivalData.rawData.results[1].donors.length > 0
                      ? 0
                      : <CaseSetButton
                          setId={set2id}
                          count={survivalData.rawData.results[1].donors.length.toLocaleString()}
                        />}
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
    </span>,
);
