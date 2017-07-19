/* @flow */

import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { compose, withState, withProps, withHandlers } from 'recompose';

import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import ShoppingCartIcon from '@ncigdc/theme/icons/ShoppingCart';
import TrashIcon from 'react-icons/lib/fa/trash';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { addAllFilesInCart, removeFilesFromCart } from '@ncigdc/dux/cart';
import withFilters from '@ncigdc/utils/withFilters';

const styles = {
  dropdownContainer: {
    left: 0,
    right: 'auto',
  },
  icon: {
    marginRight: '1em',
  },
};

const AddCaseFilesToCartButton = compose(
  connect(state => ({ cart: state.cart })),
  withState('isLoading', 'setIsLoading', false),
  withFilters(),
  withProps(({ filters, cart, files = [], filteredFiles = [] }) => ({
    filesInCart: _.intersectionBy(cart.files, files, 'file_id'),
    filteredFilesInCart: _.intersectionBy(cart.files, filteredFiles, 'file_id'),
  })),
  withHandlers({
    handleDropdownActivate: ({
      relay,
      setIsLoading,
      filters,
      hasFiles,
    }) => () => {
      if (!hasFiles) {
        // this case has no files to fetch.
        return;
      }
      setIsLoading(true);
      relay.setVariables(
        {
          isFileDataRequired: true,
          isFilteredFileDataRequired: true,
          filesFilters: filters,
        },
        readyState =>
          _.some([readyState.ready, readyState.aborted, readyState.error]) &&
          setIsLoading(false),
      );
    },
  }),
)(
  ({
    filters,
    hasFiles,
    files = [],
    filteredFiles = [],
    dispatch,
    handleDropdownActivate,
    isLoading,
    filesInCart,
    filteredFilesInCart,
    dropdownStyle = {},
  }) =>
    <Dropdown
      className="test-add-case-files-to-cart-dropdown"
      dropdownStyle={{ ...styles.dropdownContainer, ...dropdownStyle }}
      dropdownClassName={isLoading ? 'hidden' : 'dropdown-menu'}
      isDisabled={!hasFiles}
      button={
        hasFiles
          ? <button
              className="btn btn-default dropdown-toggle fa fa-shopping-cart"
              style={{ padding: '0 4px' }}
            >
              <span
                className={isLoading ? 'fa fa-spinner fa-spin' : 'caret'}
                style={{ marginLeft: '0.5rem' }}
              />
              <span className="icon-btn-label">Case Actions</span>
            </button>
          : <Tooltip Component={<span>This case has no files.</span>}>
              <button
                className="btn disabled fa fa-shopping-cart"
                style={{ padding: '0px 17px 0 4px' }}
                aria-label="This case has no files"
              />
            </Tooltip>
      }
      onActivate={handleDropdownActivate}
    >
      {isLoading && <DropdownItem> Loading case files... </DropdownItem>}
      {!isLoading && [
        !!(files.length && files.length > filesInCart.length) &&
          <DropdownItem
            className="test-add-all-files"
            onClick={() => dispatch(addAllFilesInCart(files))}
            aria-label="Add all Case files to the Cart"
            role="button"
            key="addAll"
          >
            <ShoppingCartIcon style={styles.icon} />
            Add all Case files to the Cart (
            {files.length}
            )
          </DropdownItem>,

        !!(files.length && filesInCart.length) &&
          <DropdownItem
            className="test-remove-all-files"
            onClick={() => dispatch(removeFilesFromCart(files))}
            aria-label="Remove all Case files from the Cart"
            role="button"
            key="removeAll"
          >
            <TrashIcon style={styles.icon} />
            Remove all Case files from the Cart (
            {filesInCart.length}
            )
          </DropdownItem>,

        _.every([
          filteredFiles.length,
          filteredFiles.length > filteredFilesInCart.length,
          filteredFiles.length < files.length,
        ]) &&
          <DropdownItem
            className="test-add-filtered-files"
            onClick={() => dispatch(addAllFilesInCart(filteredFiles))}
            aria-label="Add filtered Case files to the Cart"
            role="button"
            key="addFiltered"
          >
            <ShoppingCartIcon style={styles.icon} />
            Add filtered Case files to the Cart (
            {filteredFiles.length}
            )
          </DropdownItem>,

        !!(filteredFiles.length && filteredFilesInCart.length) &&
          <DropdownItem
            className="test-remove-filtered-files"
            onClick={() => dispatch(removeFilesFromCart(filteredFiles))}
            aria-label="Remove filtered Case files from the Cart"
            role="button"
            key="removeFiltered"
          >
            <TrashIcon style={styles.icon} />
            Remove filtered Case files from Cart ({filteredFilesInCart.length})
          </DropdownItem>,
      ]}
    </Dropdown>,
);

export default AddCaseFilesToCartButton;
