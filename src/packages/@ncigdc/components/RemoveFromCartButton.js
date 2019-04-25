// @flow

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import XIcon from 'react-icons/lib/fa/close';
import DownCaretIcon from 'react-icons/lib/fa/caret-down';
import TrashIcon from 'react-icons/lib/fa/trash-o';
import { userCanDownloadFile } from '@ncigdc/utils/auth';
import Button from '@ncigdc/uikit/Button';
import Dropdown from '@ncigdc/uikit/Dropdown';
import { Column, Row } from '@ncigdc/uikit/Flex';

import { withTheme } from '@ncigdc/theme';

import { toggleFilesInCart } from '@ncigdc/dux/cart';

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

const RemoveFromCartButton = ({ style, files, theme, dispatch, user }) => (
  <Row className="test-remove-from-cart-button-container">
    <Dropdown
      dropdownStyle={{
        marginTop: '2px',
        borderRadius: '4px',
        minWidth: '22rem',
      }}
      dropdownItemClass={false}
      button={
        <Button
          className="test-remove-from-cart"
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
          className="test-remove-all-files"
          style={styles.row(theme)}
          onClick={() => dispatch(toggleFilesInCart(files))}
          leftIcon={<XIcon />}
        >
          <span>All Files ({files.length})</span>
        </Button>
        <Button
          className="test-remove-unauthorized-files"
          style={styles.row(theme)}
          onClick={() =>
            dispatch(
              toggleFilesInCart(
                files.filter(file => !userCanDownloadFile({ user, file })),
              ),
            )}
          leftIcon={<XIcon />}
        >
          Unauthorized Files ({
            files.filter(file => !userCanDownloadFile({ user, file })).length
          })
        </Button>
      </Column>
    </Dropdown>
  </Row>
);

/*----------------------------------------------------------------------------*/

export default compose(connect(state => state.cart), withTheme)(
  RemoveFromCartButton,
);
