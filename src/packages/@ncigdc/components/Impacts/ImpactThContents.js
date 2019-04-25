// @flow

import React from 'react';
import { compose } from 'recompose';

import { withTheme } from '@ncigdc/theme';
import styled from '@ncigdc/theme/styled';
import { tableToolTipHint } from '@ncigdc/theme/mixins';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { Row, Column } from '@ncigdc/uikit/Flex';
import { bubbleStyle } from '@ncigdc/theme/icons/BubbleIcon';
import { IMPACT_SHORT_FORMS } from '@ncigdc/utils/constants';

const Box = styled.div(bubbleStyle);

export const ImpactThContents = compose(
  withTheme,
)(({ extraText, theme }: { extraText: string, theme: Object }) => (
  <Tooltip
    style={tableToolTipHint()}
    Component={
      <Column>
        <b>{extraText}</b>
        {['VEP', 'SIFT', 'PolyPhen'].map((impactType: string) => (
          <Row style={{ paddingTop: '5px' }} key={impactType}>
            <b style={{ textTransform: 'capitalize' }}>{impactType}</b>:{' '}
            {Object.entries(
              IMPACT_SHORT_FORMS[impactType.toLowerCase()],
            ).map(([full, short]) => (
              <div style={{ marginRight: '2px' }} key={full}>
                <Box
                  style={{
                    backgroundColor: theme[impactType.toLowerCase()][full],
                  }}
                >
                  {short}
                </Box>{' '}
                {full}
              </div>
            ))}
          </Row>
        ))}
      </Column>
    }
  >
    Impact
  </Tooltip>
));

export default ImpactThContents;
