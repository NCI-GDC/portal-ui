// @flow
import React from 'react';
import { withState, compose } from 'recompose';

import UnstyledButton from '@ncigdc/uikit/UnstyledButton';
import { CaretIcon } from '@ncigdc/theme/icons';
import { withTheme } from '@ncigdc/theme/index';

const enhance = compose(
  withTheme,
  withState('expanded', 'toggleExpand', false),
);
export default enhance(
  ({ invalidGenes, hasGenes, expanded, toggleExpand, theme }) => {
    if (!invalidGenes.length) return null;

    return (
      <div>
        <div style={{ color: theme.error }}>
          {hasGenes &&
            <UnstyledButton onClick={() => toggleExpand(v => !v)}>
              {invalidGenes.length} submitted gene{invalidGenes.length > 1 ? 's' : ''}{' '}
              not recognized{' '}
              <CaretIcon direction={expanded ? 'down' : 'left'} />
            </UnstyledButton>}

          {!hasGenes && 'No recognized genes submitted'}
        </div>

        {expanded &&
          <ul
            style={{
              listStyle: 'none',
              paddingLeft: '2rem',
              marginBottom: 0,
              display: 'block',
            }}
          >
            {invalidGenes.map((d, i) => <li key={`${d}-${i}`}>{d}</li>)}
          </ul>}
      </div>
    );
  },
);
