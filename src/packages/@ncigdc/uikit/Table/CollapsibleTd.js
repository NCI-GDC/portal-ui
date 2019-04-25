// @flow

// Vendor
import React from 'react';
import { withState } from 'recompose';

import styled from '@ncigdc/theme/styled';

/*----------------------------------------------------------------------------*/

const Td = styled.td({
  padding: '3px',
  whiteSpace: 'nowrap',
});

const Toggle = styled.div({
  textAlign: 'right',
  fontStyle: 'italic',
  color: ({ theme }) => theme.primary,
});

const enhance = withState('expanded', 'toggleExpand', false);
const CollapsibleTd = enhance(
  ({
    style, text, expanded, toggleExpand, ...props
  }) => (
    <Td style={style || {}} {...props}>
      <div>
        {expanded || text.length <= 250
          ? text
          : `${text.substring(0, 250)}\u2026`}
      </div>
      {text.length > 250 && (
        <Toggle onClick={() => toggleExpand(v => !v)}>
          {expanded ? '\u25B4 less' : '\u25BE more'}
        </Toggle>
      )}
    </Td>
  ),
);

/*----------------------------------------------------------------------------*/

export default CollapsibleTd;
