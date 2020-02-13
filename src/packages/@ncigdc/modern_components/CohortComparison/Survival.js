import React from 'react';
import { compose } from 'recompose';
import SurvivalPlotWrapper from '@ncigdc/components/SurvivalPlotWrapper';
import Table, { Tr, Td, Th } from '@ncigdc/uikit/Table';
import { Row } from '@ncigdc/uikit/Flex';
import Tooltip from '@ncigdc/uikit/Tooltip/Tooltip';
import { tableToolTipHint } from '@ncigdc/theme/mixins';
import { stringifyJSONParam } from '@ncigdc/utils/uri';
import { CreateExploreCaseSetButton } from '@ncigdc/modern_components/withSetAction';
import withRouter from '@ncigdc/utils/withRouter';
import Alias from '@ncigdc/components/Alias';
import { withTheme } from '@ncigdc/theme';
import {
  get,
  omit,
} from 'lodash';

const survivalDataCompletenessFilters = [
  {
    op: 'or',
    content: [
      {
        op: 'and',
        content: [
          {
            op: '>',
            content: {
              field: 'demographic.days_to_death',
              value: 0,
            },
          },
        ],
      },
      {
        op: 'and',
        content: [
          {
            op: '>',
            content: {
              field: 'diagnoses.days_to_last_follow_up',
              value: 0,
            },
          },
        ],
      },
    ],
  },
  {
    op: 'not',
    content: { field: 'demographic.vital_status' },
  },
];

export const makeSurvivalCurveFilter = (setId, otherSetId) => ({
  op: 'and',
  content: [
    ...survivalDataCompletenessFilters,
    {
      op: 'and',
      content: [
        {
          op: 'in',
          content: {
            field: 'cases.case_id',
            value: `set_id:${setId}`,
          },
        },
        {
          op: 'excludeifany',
          content: {
            field: 'cases.case_id',
            value: `set_id:${otherSetId}`,
          },
        },
      ],
    },
  ],
});

const SurvivalAnalysisCard = ({
  loading,
  survivalData,
  result1,
  result2,
  palette,
  set1id,
  set2id,
  push,
  style,
  theme,
  CaseSetButton = props => (
    <CreateExploreCaseSetButton
      Component={compProps => (
        <span
          {...omit(compProps, ['leftIcon'])}

          style={{
            cursor: 'pointer',
            color: theme.primary,
            textDecoration: 'underline',
          }}
          >
          {props.count}
        </span>
      )}
      filters={makeSurvivalCurveFilter(props.setId, props.otherSetId)}
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
                    field: 'cases.case_id',
                    value: [`set_id:${setId}`],
                  },
                },
              ],
            }),
          },
        });
      }}
      />
  ),
}) => (
  <div style={style}>
      <Row>
        <h2>Survival Analysis</h2>
      </Row>
      {loading ||
        get(survivalData, 'rawData.results[0].donors.length', 0) ||
        get(survivalData, 'rawData.results[1].donors.length', 0) ? (
          <div>
            <SurvivalPlotWrapper
              plotType="mutation"
              survivalDataLoading={loading}
              {...survivalData}
              height={240}
              palette={palette}
              />
            {survivalData.rawData && (
              <Table
                body={(
                  <tbody>
                    <Tr index={0}>
                      <Td width={250}>Overall Survival Analysis</Td>
                      <Td style={{ textAlign: 'right' }}>
                        {get(
                          survivalData,
                          'rawData.results[0].donors.length',
                          0
                        ) > 0 ? (
                          <CaseSetButton
                              count={survivalData.rawData.results[0].donors.length.toLocaleString()}
                              otherSetId={set2id}
                              setId={set1id}
                              />
                          ) : (
                            'No Survival Data'
                          )}
                      </Td>
                      <Td style={{ textAlign: 'right' }}>
                        {survivalData.rawData.results[0] &&
                          (survivalData.rawData.results[0].donors.length /
                            result1.hits.total *
                            100
                          ).toFixed(0)}
                        %
                      </Td>
                      <Td style={{ textAlign: 'right' }}>
                        {get(
                          survivalData,
                          'rawData.results[1].donors.length',
                          0
                        ) > 0 ? (
                          <CaseSetButton
                              count={survivalData.rawData.results[1].donors.length.toLocaleString()}
                              otherSetId={set1id}
                              setId={set2id}
                              />
                          ) : (
                            'No Survival Data'
                          )}
                      </Td>
                      <Td style={{ textAlign: 'right' }}>
                        {survivalData.rawData.results[1] &&
                          (survivalData.rawData.results[1].donors.length /
                            result2.hits.total *
                            100
                          ).toFixed(0)}
                        %
                      </Td>
                    </Tr>
                  </tbody>
                )}
                headings={[
                  <Th key="1">
                    <Tooltip
                      Component={(
                        <span>
                          Criteria to include Case from your sets in the survival
                          analysis:
                          <br />
                          - Case does not overlap between your selected sets
                          <br />
                          - Case has complete data for the purpose of the analysis
                          (event and time-to-event)
                        </span>
                      )}
                      style={tableToolTipHint()}
                      >
                      Cases included in Analysis
                    </Tooltip>
                  </Th>,
                  <Th key="2" style={{ textAlign: 'right' }}>
                    # Cases
                    {' '}
                    <Alias i={1} />
                  </Th>,
                  <Th key="3" style={{ textAlign: 'right' }}>
                    %
                  </Th>,
                  <Th key="4" style={{ textAlign: 'right' }}>
                    # Cases
                    {' '}
                    <Alias i={2} />
                  </Th>,
                  <Th key="5" style={{ textAlign: 'right' }}>
                    %
                  </Th>,
                ]}
                />
            )}
          </div>
        ) : (
          <div>No Survival data available for this Cohort Comparison</div>
        )}
    </div>
);

export default compose(
  withTheme,
  withRouter
)(SurvivalAnalysisCard);
