// @flow

// Vendor
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import XIcon from 'react-icons/lib/fa/close';
import DownCaretIcon from 'react-icons/lib/fa/caret-down';
import TrashIcon from 'react-icons/lib/fa/trash-o';

// Custom
import Button from '@ncigdc/uikit/Button';
import Dropdown from '@ncigdc/uikit/Dropdown';
import { Column, Row } from '@ncigdc/uikit/Flex';

import { withTheme } from '@ncigdc/theme';

import { toggleFilesInCart } from '@ncigdc/dux/cart';

/*----------------------------------------------------------------------------*/

const styles = {
  row: theme => ({
    backgroundColor: 'transparent',
    color: theme.greyScale2,
    justifyContent: 'flex-start',
    borderRadius: '0px',
    marginLeft: '0px',
    padding: '0.6rem 1rem',
    ':hover': {
      backgroundColor: theme.greyScale6,
    },
  }),
  iconSpacing: {
    marginRight: '0.6rem',
  },
};

const getUnauthorizedFiles = (files) => files.filter((file) => file.access === 'controlled');

const RemoveFromCartButton = ({
  style,
  files,
  theme,
  dispatch
}) => (
  <Row>
    <Dropdown
      dropdownStyle={{
        marginTop: '2px',
        borderRadius: '4px',
        minWidth: '22rem',
      }}
      dropdownItemClass={false}
      button={
        <Button
          style={{
            backgroundColor: '#A62924',
            marginLeft: '10px',
            ':hover': {
              backgroundColor: '#7C1F1B',
            },
          }}
          leftIcon={<TrashIcon />}
          rightIcon={<DownCaretIcon />}
        >
           Remove From Cart
        </Button>
      }
    >
      <Column>
        <Button
          style={styles.row(theme)}
          onClick={() => dispatch(toggleFilesInCart(files))}
          leftIcon={<XIcon />}
        >
          <span>
            All Files ({files.length})
          </span>
        </Button>
        <Button
          style={styles.row(theme)}
          onClick={() => dispatch(toggleFilesInCart(getUnauthorizedFiles(files)))}
          leftIcon={<XIcon />}
        >
          Unauthorized Files ({getUnauthorizedFiles(files).length})
        </Button>
      </Column>
    </Dropdown>
  </Row>
);

/*----------------------------------------------------------------------------*/

export default compose(
  connect(state => state.cart),
  withTheme
)(RemoveFromCartButton);

