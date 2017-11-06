import React from 'react';
import { xor } from 'lodash';
import Link from '@ncigdc/components/Links/Link';
import Venn from '@ncigdc/components/Charts/Venn';
import { stringifyJSONParam } from '@ncigdc/utils/uri';
import CreateOrOpenAnalysis from '@ncigdc/components/CreateOrOpenAnalysis';
import { withTheme } from '@ncigdc/theme';
import styled from '@ncigdc/theme/styled';
import { Column } from '@ncigdc/uikit/Flex';

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
  }) => (
    <div style={{ padding: 20, width: '20%', position: 'fixed' }}>
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
          Cohorts Venn Diagram<br />
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
            Open in new tab
          </CreateOrOpenAnalysis>
        </h2>

        <Venn
          type="case"
          ops={ops}
          getFillColor={d => 'rgb(237, 237, 237)'}
          style={{
            fontSize: 10,
            width: 200,
            margin: 'auto',
            paddingTop: 5,
          }}
        />
      </div>
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
