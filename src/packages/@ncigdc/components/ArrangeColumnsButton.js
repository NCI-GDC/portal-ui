// @flow
import React from 'react';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
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

const SearchIcon = styled(SI, {
  backgroundColor: ({ theme }) => theme.greyScale5,
  color: ({ theme }) => theme.greyScale2,
  padding: '0.7rem',
  width: '3rem',
  height: '3rem',
});

const RestoreDefaults = styled(Row, {
  color: ({ theme }) => theme.secondaryHighContrast,
  padding: '0.3rem 0.6rem',
  cursor: 'pointer',
  ':hover': {
    textDecoration: 'underline',
  },
});

const ArrangeColumnsButton = compose(
  connect(),
  withState('searchTerm', 'setSearchTerm', '')
)(
  class extends React.Component {
    searchInput;

    render() {
      const {
        searchTerm,
        setSearchTerm,
        dispatch,
        entityType,
        style = {},
        hideColumns,
      } = this.props;
      return (
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
            top: '100%',
            marginTop: 5,
            whiteSpace: 'nowrap',
          }}>
          <Column style={{ minWidth: '22rem' }}>
            <Row>
              <SearchIcon />
              <input
                aria-label="Filter Columns"
                className="test-filter-columns"
                onChange={() => setSearchTerm(() => this.searchInput.value)}
                placeholder="Filter Columns"
                ref={node => {
                  this.searchInput = node;
                }}
                style={{
                  width: '100%',
                  padding: '0.3rem 0.5rem',
                }}
                type="text" />
            </Row>
            <RestoreDefaults
              className="test-restore-defaults"
              onClick={() => {
                dispatch(restoreColumns(entityType));
                setSearchTerm(() => '');
                this.searchInput.value = '';
              }}>
              Restore Defaults
            </RestoreDefaults>
            <ArrangeColumns
              entityType={entityType}
              hideColumns={hideColumns}
              searchTerm={searchTerm} />
          </Column>
        </Dropdown>
      );
    }
  }
);

export default ArrangeColumnsButton;
