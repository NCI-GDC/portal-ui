/* @flow */

import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { toggleFilesInCart } from '@ncigdc/dux/cart';
import Button from '@ncigdc/uikit/Button';
import { Tooltip } from '@ncigdc/uikit/Tooltip';

const styles = {
  backgroundColor: '#FFF',
  borderColor: '#CCC',
  color: '#333',
  margin: '0 auto',
  padding: '0px 5px',
  ':hover': {
    background:
      'linear-gradient(to bottom, #ffffff 50%, #e6e6e6 100%) repeat scroll 0 0 #E6E6E6',
    borderColor: '#ADADAD',
  },
};

export default compose(
  connect(state => state.cart),
)(({
  dispatch, file, style = {}, ...props
}) => (
  <Button
    aria-label="Remove"
    onClick={() => dispatch(toggleFilesInCart(file))}
    style={styles}>
    <Tooltip Component="Remove">
      <i className="fa fa-trash-o" />
    </Tooltip>
  </Button>
));
