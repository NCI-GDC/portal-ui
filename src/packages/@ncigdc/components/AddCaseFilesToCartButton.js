/* @flow */

import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { compose, withState, withProps, withHandlers } from 'recompose';
import { stringify } from 'query-string';

import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import ShoppingCartIcon from '@ncigdc/theme/icons/ShoppingCart';
import TrashIcon from 'react-icons/lib/fa/trash';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { addAllFilesInCart, removeFilesFromCart } from '@ncigdc/dux/cart';
import withFilters from '@ncigdc/utils/withFilters';
import { fetchApi } from '@ncigdc/utils/ajax';
import { makeFilter, addInFilters } from '@ncigdc/utils/filters';

const styles = {
  dropdownContainer: {
    left: 0,
    right: 'auto',
  },
  icon: {
    marginRight: '1em',
  },
};

const fetchFiles = async (caseId: string, size, filters?: Object) => {
  const search = stringify({
    filters: JSON.stringify(
      addInFilters(
        filters,
        makeFilter(
          [
            {
              field: 'cases.case_id',
              value: [caseId],
            },
          ],
          false,
        ),
      ),
    ),
    size,
    fields: 'acl,state,access,file_id,file_size,cases.project.project_id',
  });

  const { data } = await fetchApi(`files?${search}`);
  const files = data.hits.map(({ cases, ...rest }) => ({
    ...rest,
    projects: cases.map(({ project: { project_id } }) => project_id),
  }));
  return files;
};

const AddCaseFilesToCartButton = compose(
  connect(state => ({ cart: state.cart })),
  withState('isLoading', 'setIsLoading', false),
  withState('fetchedFiles', 'setFetchedFiles', []),
  withState('fetchedFilteredFiles', 'setFetchedFilteredFiles', []),
  withFilters(),
  withProps(
    ({ filters, cart, fetchedFiles = [], fetchedFilteredFiles = [] }) => ({
      filesInCart: _.intersectionBy(cart.files, fetchedFiles, 'file_id'),
      filteredFilesInCart: _.intersectionBy(
        cart.files,
        fetchedFilteredFiles,
        'file_id',
      ),
    }),
  ),
  withHandlers({
    handleDropdownActivate: ({
      setIsLoading,
      setFetchedFiles,
      setFetchedFilteredFiles,
      filters,
      hasFiles,
      caseId,
      fileCount,
    }) => async () => {
      if (!hasFiles) {
        // this case has no files to fetch.
        return;
      }
      setIsLoading(true);
      setFetchedFiles(await fetchFiles(caseId, fileCount));
      if (filters) {
        setFetchedFilteredFiles(await fetchFiles(caseId, fileCount, filters));
      }
      setIsLoading(false);
    },
  }),
)(
  ({
    filters,
    hasFiles,
    fetchedFiles = [],
    fetchedFilteredFiles = [],
    dispatch,
    handleDropdownActivate,
    isLoading,
    filesInCart,
    filteredFilesInCart,
    dropdownStyle = {},
  }) => (
    <Dropdown
      className="test-add-case-files-to-cart-dropdown"
      dropdownStyle={{ ...styles.dropdownContainer, ...dropdownStyle }}
      dropdownClassName={isLoading ? 'hidden' : 'dropdown-menu'}
      isDisabled={!hasFiles}
      button={
        hasFiles ? (
          <button
            className="btn btn-default dropdown-toggle fa fa-shopping-cart"
            style={{ padding: '0 4px' }}
          >
            <span
              className={isLoading ? 'fa fa-spinner fa-spin' : 'caret'}
              style={{ marginLeft: '0.5rem' }}
            />
            <span className="icon-btn-label">Case Actions</span>
          </button>
        ) : (
          <Tooltip Component={<span>This case has no files.</span>}>
            <button
              className="btn disabled fa fa-shopping-cart"
              style={{ padding: '0px 17px 0 4px' }}
              aria-label="This case has no files"
            />
          </Tooltip>
        )
      }
      onActivate={handleDropdownActivate}
    >
      {isLoading && <DropdownItem> Loading case files... </DropdownItem>}
      {!isLoading && [
        !!(fetchedFiles.length && fetchedFiles.length > filesInCart.length) && (
          <DropdownItem
            className="test-add-all-files"
            onClick={() => dispatch(addAllFilesInCart(fetchedFiles))}
            aria-label="Add all Case files to the Cart"
            role="button"
            key="addAll"
          >
            <ShoppingCartIcon style={styles.icon} />
            Add all Case files to the Cart (
            {fetchedFiles.length}
            )
          </DropdownItem>
        ),

        !!(fetchedFiles.length && filesInCart.length) && (
          <DropdownItem
            className="test-remove-all-files"
            onClick={() => dispatch(removeFilesFromCart(fetchedFiles))}
            aria-label="Remove all Case files from the Cart"
            role="button"
            key="removeAll"
          >
            <TrashIcon style={styles.icon} />
            Remove all Case files from the Cart (
            {filesInCart.length}
            )
          </DropdownItem>
        ),

        _.every([
          fetchedFilteredFiles.length,
          fetchedFilteredFiles.length > filteredFilesInCart.length,
          fetchedFilteredFiles.length < fetchedFiles.length,
        ]) && (
          <DropdownItem
            className="test-add-filtered-files"
            onClick={() => dispatch(addAllFilesInCart(fetchedFilteredFiles))}
            aria-label="Add filtered Case files to the Cart"
            role="button"
            key="addFiltered"
          >
            <ShoppingCartIcon style={styles.icon} />
            Add filtered Case files to the Cart (
            {fetchedFilteredFiles.length}
            )
          </DropdownItem>
        ),

        !!(fetchedFilteredFiles.length && filteredFilesInCart.length) && (
          <DropdownItem
            className="test-remove-filtered-files"
            onClick={() => dispatch(removeFilesFromCart(fetchedFilteredFiles))}
            aria-label="Remove filtered Case files from the Cart"
            role="button"
            key="removeFiltered"
          >
            <TrashIcon style={styles.icon} />
            Remove filtered Case files from Cart ({filteredFilesInCart.length})
          </DropdownItem>
        ),
      ]}
    </Dropdown>
  ),
);

export default AddCaseFilesToCartButton;
