/* @flow */

import React from 'react';
import {
  compose,
  branch,
  mapProps,
  withState,
  renderNothing,
  setDisplayName,
} from 'recompose';
import { connect } from 'react-redux';
import { Row } from '@ncigdc/uikit/Flex';
import LocalPaginationTable from '@ncigdc/components/LocalPaginationTable';
import tableModels from '@ncigdc/tableModels';
import Table, { Tr, Td } from '@ncigdc/uikit/Table';
import styled from '@ncigdc/theme/styled';
import SearchIcon from 'react-icons/lib/fa/search';
import Input from '@ncigdc/uikit/Form/Input';
import CloseIcon from '@ncigdc/theme/icons/CloseIcon';
import { trim } from 'lodash';
import { withTheme } from '@ncigdc/theme';

const Header = styled(Row, {
  padding: '1rem',
  color: ({ theme }) => theme.greyScale7 || 'silver',
  fontSize: '1.7rem',
});

const PrimarySitesTable = ({ data, tableInfo, projectId }) => (
  <Table
    body={(
      <tbody>
        {data.length >= 1 ? (
          data.map((primarySite, i) => {
            return (
              <Tr index={i} key={i}>
                {tableInfo
                  .filter(x => x.td)
                  .map(x => (
                    <x.td
                      key={x.id}
                      primarySite={primarySite}
                      projectId={projectId} />
                  ))}
              </Tr>
            );
          })
        ) : (
          <Tr>
            <Td style={{ padding: '10px' }}>
              There are no results for that query
            </Td>
          </Tr>
        )}
      </tbody>
    )}
    headings={tableInfo
      .filter(x => !x.subHeading)
      .map(x => <x.th key={x.id} />)}
    id="project-primary-site-table"
    subheadings={tableInfo
      .filter(x => x.subHeading)
      .map(x => <x.th key={x.id} />)} />
);

export default compose(
  setDisplayName('ProjectPrimarySitesTablePresentation'),
  branch(
    ({ viewer }) => !viewer.projects.hits.edges ||
      viewer.projects.hits.edges[0].node.primary_site.length < 2,
    () => renderNothing()
  ),
  withTheme,
  withState('searchValue', 'setSearchValue', ''),
  connect(state => ({
    tableColumns: state.tableColumns.projectPrimarySites,
  })),
  mapProps(props => ({
    ...props,
    edges: props.viewer.projects.hits.edges,
  }))
)(
  ({
    edges,
    entityType = 'projectPrimarySites',
    tableColumns,
    tableHeader = 'Primary Sites',
    projectId,
    searchValue,
    setSearchValue,
    theme,
    loading,
  }) => {
    const project = edges[0].node;
    const tableInfo = tableColumns.slice().filter(x => !x.hidden);

    const primarySiteData = project.primary_site
      .filter(site => site.toLowerCase().includes(searchValue.toLowerCase()))
      .sort();

    const paginationPrefix = 'primarySites';
    return (
      <div>
        <Row
          style={{
            backgroundColor: 'white',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }} />
        <Row>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              backgroundColor: 'white',
              padding: '1rem 1rem 0 1rem',
            }}>
            <Row>{tableHeader && <Header>{tableHeader}</Header>}</Row>
            <Row>
              <label htmlFor="filter-input">
                <div
                  style={{
                    borderTop: `1px solid ${theme.greyScale5}`,
                    borderLeft: `1px solid ${theme.greyScale5}`,
                    borderBottom: `1px solid ${theme.greyScale5}`,
                    borderRight: 0,
                    borderRadius: '4px 0 0 4px',
                    backgroundColor: `${theme.greyScale4}`,
                    width: '38px',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <SearchIcon size={14} />
                </div>
              </label>
              <Input
                disabled={loading}
                id="filter-input"
                onChange={e => {
                  const trimmed = trim(e.target.value);
                  setSearchValue(trimmed);
                }}
                placeholder="Search"
                style={{
                  fontSize: '14px',
                  paddingLeft: '1rem',
                  border: `1px solid ${theme.greyScale5}`,
                  width: '25rem',
                  borderRadius: '0 4px 4px 0',
                }}
                type="text"
                value={searchValue} />
              {!!searchValue.length && (
                <CloseIcon
                  onClick={() => {
                    setSearchValue('');
                  }}
                  style={{
                    position: 'absolute',
                    right: 0,
                    padding: '10px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    outline: 0,
                    cursor: 'pointer',
                  }} />
              )}
            </Row>
          </div>
        </Row>
        <LocalPaginationTable
          customDefaultSize={10}
          data={primarySiteData}
          prefix={paginationPrefix}>
          <PrimarySitesTable projectId={projectId} tableInfo={tableInfo} />
        </LocalPaginationTable>
      </div>
    );
  }
);
