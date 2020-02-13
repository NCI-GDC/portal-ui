// @flow
import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
  setDisplayName,
  withHandlers,
  withState,
} from 'recompose';
import ArrangeIcon from 'react-icons/lib/fa/bars';
import SI from 'react-icons/lib/fa/search';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import ArrangeColumns from '@ncigdc/components/ArrangeColumns';
import { restoreColumns } from '@ncigdc/dux/tableColumns';
import Dropdown from '@ncigdc/uikit/Dropdown';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import Hidden from '@ncigdc/components/Hidden';
import styled from '@ncigdc/theme/styled';
import CloseIcon from '@ncigdc/theme/icons/CloseIcon';

const SearchIcon = styled(SI, {
  backgroundColor: ({ theme }) => theme.greyScale5,
  color: ({ theme }) => theme.greyScale2,
  height: '3rem',
  padding: '0.7rem',
  width: '3rem',
});

const RestoreDefaults = styled(Row, {
  ':hover': {
    textDecoration: 'underline',
  },
  color: ({ theme }) => theme.secondaryHighContrast,
  cursor: 'pointer',
  padding: '0.3rem 0.6rem',
});

const ArrangeColumnsButton = ({
  dispatch,
  entityType,
  handleQueryInputChange,
  handleQueryInputClear,
  hideColumns,
  searchTerm,
  style = {},
}) => (
  <Dropdown
    autoclose={false}
    button={(
      <Tooltip Component={<span>Arrange Columns</span>}>
        <Button style={style}>
          <ArrangeIcon />
          <Hidden>Sort Table</Hidden>
        </Button>
      </Tooltip>
    )}
    className="test-arrange-columns-button"
    dropdownStyle={{
      marginTop: 5,
      top: '100%',
      whiteSpace: 'nowrap',
    }}
    >
    <Column style={{ minWidth: '22rem' }}>
      <Row>
        <SearchIcon />

        <input
          aria-label="Filter Columns"
          className="test-filter-columns"
          onChange={handleQueryInputChange}
          onKeyDown={event => {
            searchTerm &&
              (event.key === 'Escape' || event.keyCode === 27) &&
              handleQueryInputClear();
          }}
          placeholder="Filter Columns"
          style={{
            padding: '0.3rem 0.5rem',
            width: '100%',
          }}
          type="text"
          value={searchTerm}
          />

        {searchTerm && (
          <CloseIcon
            onClick={handleQueryInputClear}
            style={{
              cursor: 'pointer',
              outline: 0,
              padding: '10px',
              position: 'absolute',
              right: 0,
              top: '-2px',
              transition: 'all 0.3s ease',
            }}
            />
        )}
      </Row>

      <RestoreDefaults
        className="test-restore-defaults"
        onClick={() => {
          dispatch(restoreColumns(entityType));
          handleQueryInputClear();
        }}
        >
        Restore Defaults
      </RestoreDefaults>

      <ArrangeColumns
        entityType={entityType}
        hideColumns={hideColumns}
        searchTerm={searchTerm}
        />
    </Column>
  </Dropdown>
);

export default compose(
  setDisplayName('EnhancedArrangeColumnsButton'),
  connect(),
  withState('searchTerm', 'setSearchTerm', ''),
  withHandlers({
    handleQueryInputChange: ({
      setSearchTerm,
    }) => event => setSearchTerm(event.target.value),
    handleQueryInputClear: ({
      setSearchTerm,
    }) => () => setSearchTerm(''),
  }),
)(ArrangeColumnsButton);
