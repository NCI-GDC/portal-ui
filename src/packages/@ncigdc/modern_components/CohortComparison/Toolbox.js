import React from 'react';
import { xor } from 'lodash';
import Link from '@ncigdc/components/Links/Link';
import Venn from '@ncigdc/components/Charts/Venn';
import { stringifyJSONParam } from '@ncigdc/utils/uri';
import Alias from '@ncigdc/components/Alias';
import CreateOrOpenAnalysis from '@ncigdc/components/CreateOrOpenAnalysis';
import { withTheme } from '@ncigdc/theme';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import styled from '@ncigdc/theme/styled';
import { Row, Column } from '@ncigdc/uikit/Flex';
import { zDepth1 } from '@ncigdc/theme/mixins';
import { Tooltip } from '@ncigdc/uikit/Tooltip';

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

const LinkAsText = styled(Link, {
  color: ({ theme }) => theme.greyScale1,
  ':link': ({ theme }) => ({
    color: theme.greyScale1,
  }),
  ':visited': ({ theme }) => ({
    color: theme.greyScale1,
  }),
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
    survivalHasData,
    Set1,
    Set2,
    setId1,
    setId2,
    result1,
    result2,
  }) => (
    <div
      style={{
        top: 180,
        bottom: 20,
        overflowY: 'auto',
        padding: 20,
        marginTop: 20,
        width: '20%',
        position: 'fixed',
        backgroundColor: 'white',
        zIndex: 1000,
        minWidth: 220,
        ...zDepth1,
      }}
    >
      <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Column flex={1}>
          <Row style={{ alignItems: 'center', flex: 1 }}>
            <Row style={{ flex: 3, fontWeight: 'bold', fontSize: 16 }}>
              Cohort
            </Row>
            <Row
              style={{
                flex: 2,
                fontWeight: 'bold',
                fontSize: 16,
                justifyContent: 'flex-end',
              }}
            >
              # Cases
            </Row>
          </Row>
          <Row style={{ alignItems: 'center', marginTop: 10 }}>
            <Row style={{ flex: 3, color: SET1_COLOUR }}>
              <Alias i={1} style={{ fontWeight: 'bold' }} />&nbsp;:&nbsp;{Set1}
            </Row>
            <Column flex={1} style={{ alignItems: 'center' }}>
              <ExploreLink
                style={{ fontSize: 16 }}
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
            </Column>
          </Row>
          <Row style={{ alignItems: 'center', marginTop: 10 }}>
            <Row style={{ flex: 3, color: SET2_COLOUR }}>
              <Alias i={2} style={{ fontWeight: 'bold' }} />&nbsp;:&nbsp;{Set2}
            </Row>
            <Column flex={1} style={{ alignItems: 'center' }}>
              <ExploreLink
                style={{ fontSize: 16 }}
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
            </Column>
          </Row>
        </Column>
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
              color: theme.primary,
              fontSize: '0.9em',
              textDecoration: 'underline',
              display: 'inline-block',
            }}
          >
            Open Venn diagram in new tab
          </CreateOrOpenAnalysis>
        </h2>

        <Venn
          type="case"
          ops={ops}
          getFillColor={d => 'rgb(237, 237, 237)'}
          style={{
            fontSize: 12,
            width: '100%',
            margin: 'auto',
            paddingTop: 5,
          }}
        />
      </div>
      <hr style={{ borderWidth: '1px' }} />
      <Column>
        <Item
          onClick={
            survivalHasData
              ? () => toggleSurvival(survivalShowing => !survivalShowing)
              : () => {}
          }
        >
          <input
            readOnly
            style={{ marginRight: 5, pointerEvents: 'none', cursor: 'pointer' }}
            type="checkbox"
            aira-label={`Select survival`}
            checked={showSurvival && survivalHasData}
            disabled={!survivalHasData}
          />
          <Tooltip
            Component={!survivalHasData && 'Not enough data to plot survival'}
          >
            <label
              style={{
                cursor: 'pointer',
                ...(!survivalHasData && { color: theme.greyScale7 }),
              }}
            >
              Survival
            </label>
          </Tooltip>
        </Item>
        {availableFacets.map(([field, label]) => {
          return (
            <Item key={field + label}>
              <LinkAsText
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
              </LinkAsText>
            </Item>
          );
        })}
      </Column>
    </div>
  ),
);
