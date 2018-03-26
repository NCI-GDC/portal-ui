// @flow

import React from 'react';
import { connect } from 'react-redux';

import { parseFilterParam } from '@ncigdc/utils/uri';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';
import Hidden from '@ncigdc/components/Hidden';
import DownCaretIcon from 'react-icons/lib/fa/caret-down';
import TrashIcon from 'react-icons/lib/fa/trash';

import {
  addAllFilesInCart,
  fetchFilesAndAdd,
  fetchFilesAndRemove,
  toggleFilesInCart,
} from '@ncigdc/dux/cart';

import Row from '@ncigdc/uikit/Flex/Row';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Button from '@ncigdc/uikit/Button';
import ShoppingCartIcon from '@ncigdc/theme/icons/ShoppingCart';
import { iconButton } from '@ncigdc/theme/mixins';

import styled from '@ncigdc/theme/styled';

import type { TCartFile } from '@ncigdc/dux/cart';

type TProps = {
  edges: Array<TCartFile>,
  files: Array<TCartFile>,
  total: number,
  dispatch: Function,
};

const DropDownCaret = styled.span({
  backgroundColor: '#FFF',
  borderTopRightRadius: '4px',
  borderBottomRightRadius: '4px',
});

const DropDownStyle = {
  position: 'absolute',
  right: 'initial',
  left: '-25px',
  marginTop: '5px',
  borderRadius: '4px',
};

const DropDownItemStyle = {
  padding: '3px 20px',
  margin: '5px 0',
  fontWeight: 'normal',
};

const CartButton = styled(Button, {
  padding: '0 5px',
  color: '#FFF',
  borderRadius: '4px',
  borderTopRightRadius: '0px',
  borderBottomRightRadius: '0px',
  cursor: 'pointer',
  backgroundColor: ({ active }) => (active ? '#255425' : 'rgb(0, 80, 131)'),
  ':hover': {
    backgroundColor: ({ active }) => (active ? '#255425' : 'rgb(0, 80, 131)'),
  },
});

const filesInCart = (edges, files) => {
  if (files.length < edges.length) return false;
  return edges.every(edge => files.some(file => file.file_id === edge.file_id));
};

const AddToCartButtonAll = ({
  edges,
  files,
  total,
  dispatch,
  asIcon = false,
}: TProps) => (
  <LocationSubscriber>
    {ctx => {
      const { filters } = ctx.query || {};
      const currentFilters = parseFilterParam(filters, null);
      const inCart = filesInCart(edges, files);

      return asIcon ? (
        <span style={{ marginLeft: '0.5rem' }}>
          <ShoppingCartIcon
            className="test-toggle-all-files-in-cart"
            active={inCart}
            onClick={() =>
              inCart
                ? dispatch(toggleFilesInCart(edges))
                : dispatch(addAllFilesInCart(edges))}
            aria-label="Add files to cart"
            role="button"
            style={iconButton}
          />
          <Hidden>
            {inCart ? 'Remove all files from cart' : 'Add all files to cart'}
          </Hidden>
        </span>
      ) : (
        <Row>
          <CartButton
            className="test-toggle-all-files-in-cart"
            active={inCart}
            onClick={() =>
              inCart
                ? dispatch(toggleFilesInCart(edges))
                : dispatch(addAllFilesInCart(edges))}
            aria-label="Add files to cart"
          >
            <ShoppingCartIcon />
            <Hidden>
              {inCart ? 'Remove all files from cart' : 'Add all files to cart'}
            </Hidden>
          </CartButton>
          <Dropdown
            dropdownStyle={DropDownStyle}
            className="test-add-to-cart-dropdown"
            button={
              <Row>
                <DropDownCaret>
                  <DownCaretIcon style={{ marginLeft: 'auto' }} />
                </DropDownCaret>
              </Row>
            }
          >
            <DropdownItem
              className="test-add-all-files"
              onClick={() => dispatch(fetchFilesAndAdd(currentFilters, total))}
              aria-label="Add all files to cart"
              style={DropDownItemStyle}
            >
              <ShoppingCartIcon style={{ marginRight: '1em' }} /> Add all files
              to the Cart
            </DropdownItem>
            <DropdownItem
              className="test-remove-all-files"
              onClick={() =>
                dispatch(fetchFilesAndRemove(currentFilters, total))}
              aria-label="Remove all files from cart"
              style={DropDownItemStyle}
            >
              <TrashIcon style={{ marginRight: '1em' }} /> Remove all from the
              Cart
            </DropdownItem>
          </Dropdown>
        </Row>
      );
    }}
  </LocationSubscriber>
);

export default connect(state => state.cart)(AddToCartButtonAll);
