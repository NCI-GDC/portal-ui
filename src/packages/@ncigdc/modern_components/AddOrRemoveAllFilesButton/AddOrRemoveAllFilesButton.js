import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { removeFilesFromCart, addAllFilesInCart } from '@ncigdc/dux/cart';
import Button from '@ncigdc/uikit/Button';
import ShoppingCartIcon from '@ncigdc/theme/icons/ShoppingCart';

export default compose(
  connect(state => ({ cartFiles: state.cart.files })),
  global.trace('wat'),
)(({ dispatch, cartFiles, filesViewer: { repository: { files: f } } }) => {
  const files = f.hits.edges.map(x => x.node);
  const hasFilesToAdd = files.filter(
    f => !cartFiles.some(cf => cf.file_id === f.file_id),
  ).length;
  const cartOperation = hasFilesToAdd ? addAllFilesInCart : removeFilesFromCart;
  return (
    <Button
      className="test-cart-file-toggle"
      onClick={() => dispatch(cartOperation(files))}
      leftIcon={<ShoppingCartIcon />}
    >
      {hasFilesToAdd
        ? 'Add all files to the cart'
        : 'Remove all files from the cart'}
    </Button>
  );
});
