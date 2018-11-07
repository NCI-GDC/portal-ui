// @flow

// Vendor
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import ShoppingCartIcon from '@ncigdc/theme/icons/ShoppingCart';
import Color from 'color';

// Custom
import { toggleFilesInCart } from '@ncigdc/dux/cart';
import Button from '@ncigdc/uikit/Button';
import { withTheme } from '@ncigdc/theme';
import Hidden from '@ncigdc/components/Hidden';

/*----------------------------------------------------------------------------*/

const styles = {
  button: theme => ({
    padding: '3px 5px',
    height: '22px',
    border: `1px solid ${theme.greyScale4}`,
  }),
  inactive: theme => ({
    backgroundColor: 'white',
    color: theme.greyScale2,
    ':hover': {
      backgroundColor: theme.greyScale6,
    },
  }),
  active: theme => ({
    backgroundColor: theme.success,
    color: '#fff',
    ':hover': {
      backgroundColor: Color(theme.success)
        .darken(0.3)
        .rgbString(),
    },
  }),
};

const fileInCart = (files, file) => files.some(f => f.file_id === file.file_id);

const AddToCartButtonSingle = ({
  dispatch,
  file,
  files,
  theme,
  style,
  asIcon = false,
}) => (
  <Button
    className="test-add-to-cart"
    style={{
      ...styles.button(theme),
      ...(fileInCart(files, file)
        ? style || styles.active(theme)
        : style || styles.inactive(theme)),
    }}
    onClick={() => dispatch(toggleFilesInCart(file))}
    aria-label="Add to cart"
  >
    <ShoppingCartIcon
      style={{
        color: fileInCart(files, file)
          ? asIcon ? '#3c763d' : 'white'
          : 'rgb(0, 80, 131)',
      }}
    />
    <Hidden>Add to cart</Hidden>
  </Button>
);

AddToCartButtonSingle.propTypes = {
  files: PropTypes.array,
  file: PropTypes.object,
  dispatch: PropTypes.func,
};

/*----------------------------------------------------------------------------*/

export default compose(connect(state => state.cart), withTheme)(
  AddToCartButtonSingle,
);
