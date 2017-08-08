// @flow
import React from 'react';
import { css } from 'glamor';
import { withTheme } from '@ncigdc/theme';

const styles = {
  tableActionButtons: theme =>
    css({
      outline: 'none',
      width: '30px',
      height: '30px',
      padding: '0.6rem',
      backgroundColor: 'white',
      fontSize: '10px',
      color: theme.greyScale1,
      border: `1px solid ${theme.greyScale4}`,
      '.inactive': {
        ':hover': {
          backgroundColor: theme.greyScale6,
        },
      },
      '.active': {
        backgroundColor: theme.secondaryHighContrast,
        color: 'white',
      },
    }),
};

const PaginationButton = withTheme(
  ({ className, children, theme, active = false, ...props }) =>
    <button
      className={`
      ${styles.tableActionButtons(theme)}
      ${className || (active ? 'active' : 'inactive')}
    `}
      {...props}
    >
      {children}
    </button>,
);

export default PaginationButton;
