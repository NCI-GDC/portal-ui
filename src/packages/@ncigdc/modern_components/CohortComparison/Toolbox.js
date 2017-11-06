import React from 'react';
import { xor } from 'lodash';
import Link from '@ncigdc/components/Links/Link';
import Venn from '@ncigdc/components/Charts/Venn';
import { stringifyJSONParam } from '@ncigdc/utils/uri';
import Table, { Tr, Td, Th } from '@ncigdc/uikit/Table';
import Alias from '@ncigdc/components/Alias';
import CreateOrOpenAnalysis from '@ncigdc/components/CreateOrOpenAnalysis';
import { withTheme } from '@ncigdc/theme';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import styled from '@ncigdc/theme/styled';
import { Row, Column } from '@ncigdc/uikit/Flex';
import { zDepth1 } from '@ncigdc/theme/mixins';

const SET1_COLOUR = 'rgb(145, 114, 33)';
const SET2_COLOUR = 'rgb(29, 97, 135)';

let Item = styled.div({
  lineHeight: 2,
  paddingLeft: 5,
  cursor: 'pointer',
  ':hover': {
    backgroundColor: 'rgb(216, 230, 235)',
  },
});

export default withTheme(
  ({
    theme,
    ops,
    sets,
    availableFacets,
    activeFacets,
    showSurvival,
    toggleSurvival,
    Set1,
    Set2,
    setId1,
    setId2,
    result1,
    result2,
  }) => (
    <div
      style={{
        padding: 20,
        marginTop: 20,
        width: '13%',
        position: 'fixed',
        backgroundColor: 'white',
        zIndex: 1000,
        minWidth: 220,
        ...zDepth1,
      }}
    >
      <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Table
            style={{ width: '100%' }}
            headings={[
              <Th key="1" style={{ backgroundColor: 'white' }}>
                Cohorts
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
                  <Td style={{ width: '150px', color: SET1_COLOUR }}>
                    <Alias i={1} style={{ fontWeight: 'bold' }} /> : {Set1}
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
                                value: [`set_id:${setId1}`],
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
                  <Td style={{ width: '150px', color: SET2_COLOUR }}>
                    <Alias i={2} style={{ fontWeight: 'bold' }} /> : {Set2}
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
                                value: [`set_id:${setId2}`],
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
        </div>
      </Row>
      <hr style={{ borderWidth: '1px' }} />
      <div>
        <h2
          style={{
            textAlign: 'center',
            fontSize: 13,
            fontWeight: 'bold',
            margin: 0,
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          }}
        >
          <CreateOrOpenAnalysis
            type="set_operations"
            sets={sets}
            style={{
              color: theme.primary1,
              fontSize: '0.9em',
              textDecoration: 'underline',
              display: 'inline-block',
            }}
          >
            Open venn diagram in new tab
          </CreateOrOpenAnalysis>
        </h2>

        <Venn
          type="case"
          ops={ops}
          getFillColor={d => 'rgb(237, 237, 237)'}
          style={{
            fontSize: 10,
            width: '100%',
            margin: 'auto',
            paddingTop: 5,
          }}
        />
      </div>
      <hr style={{ borderWidth: '1px' }} />
      <Column>
        <Item
          onClick={() => toggleSurvival(survivalShowing => !survivalShowing)}
        >
          <input
            readOnly
            style={{ marginRight: 5, pointerEvents: 'none', cursor: 'pointer' }}
            type="checkbox"
            aira-label={`Select survival`}
            checked={showSurvival}
          />
          <label style={{ cursor: 'pointer' }}>Survival</label>
        </Item>
        {availableFacets.map(([field, label]) => {
          return (
            <Item key={field + label}>
              <Link
                merge
                query={{
                  activeFacets: stringifyJSONParam(xor(activeFacets, [field])),
                }}
              >
                <label style={{ cursor: 'pointer' }}>
                  <input
                    readOnly
                    style={{ marginRight: 5, pointerEvents: 'none' }}
                    type="checkbox"
                    aira-label={`Select ${field}`}
                    checked={activeFacets.includes(field)}
                  />
                  {label}
                </label>
              </Link>
            </Item>
          );
        })}
      </Column>
    </div>
  ),
);
