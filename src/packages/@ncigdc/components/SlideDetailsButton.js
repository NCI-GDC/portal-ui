// @flow

import React from 'react';
import { withTheme } from '@ncigdc/theme';
import EntityPageVerticalTable from '@ncigdc/components/EntityPageVerticalTable';
import Dropdown from '@ncigdc/uikit/Dropdown';
import { compose } from 'recompose';

export default compose(withTheme)(({ theme, slide }) => {
  return (
    <div id="details-button">
      <Dropdown
        style={{
          margin: 0,
          border: 'none',
          display: 'block',
        }}
        dropdownStyle={{
          marginTop: '15px',
          borderBottomLeftRadius: '5px',
          borderBottomRightRadius: '5px',
        }}
        button={
          <div
            style={{
              background: theme.primary,
              color: 'white',
              borderRadius: '5px',
              cursor: 'pointer',
              maxWidth: '70px',
              padding: '3px 10px',
              textAlign: 'center',
            }}
          >
            Details
          </div>
        }
      >
        <div
          className="details-container"
          style={{
            position: 'absolute',
            padding: '5px',
            background: 'white',
            border: `1px solid ${theme.greyScale4}`,
          }}
        >
          <EntityPageVerticalTable
            thToTd={[
              ...Object.entries(slide).map(([key, value]) => ({
                th: key,
                td: value,
              })),
            ]}
          />
        </div>
      </Dropdown>
    </div>
  );
});
