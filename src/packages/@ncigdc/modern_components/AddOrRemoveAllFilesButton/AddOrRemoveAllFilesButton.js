import React from 'react';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import { get } from 'lodash';

import { removeFilesFromCart, addAllFilesInCart } from '@ncigdc/dux/cart';
import Button from '@ncigdc/uikit/Button';
import ShoppingCartIcon from '@ncigdc/theme/icons/ShoppingCart';
import { SpinnerIcon } from '../../theme/icons/index';

export default compose(
  connect(state => ({ cartFiles: state.cart.files })),
  withProps(props => {
    return {
      files: get(props, 'filesViewer.repository.files.hits.edges', []).map(
        x => x.node,
      ),
    };
  }),
)(({
  dispatch, cartFiles, style, loading, files, ...props
}) => {
  const hasFilesToAdd = files.filter(
    f => !cartFiles.some(cf => cf.file_id === f.file_id),
  ).length;
  const cartOperation = hasFilesToAdd ? addAllFilesInCart : removeFilesFromCart;

  return (
    <Button
      className="test-cart-file-toggle"
      leftIcon={loading ? <SpinnerIcon /> : <ShoppingCartIcon />}
      onClick={() => !loading && dispatch(cartOperation(files))}
      style={style}>
      {loading
        ? 'Loading files'
        : hasFilesToAdd
          ? 'Add all files to the cart'
          : 'Remove all files from the cart'}
    </Button>
  );
});
