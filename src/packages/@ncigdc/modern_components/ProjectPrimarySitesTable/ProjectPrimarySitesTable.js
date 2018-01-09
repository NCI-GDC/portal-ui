/* @flow */

import React from 'react';
import {
  compose,
  branch,
  mapProps,
  // withState,
  // withPropsOnChange,
  renderNothing,
} from 'recompose';
import { connect } from 'react-redux';
import { Row } from '@ncigdc/uikit/Flex';
// import {
//   makeFilter,
//   replaceFilters,
//   removeFilter,
// } from '@ncigdc/utils/filters';
import tableModels from '@ncigdc/tableModels';
import Table, { Tr } from '@ncigdc/uikit/Table';
import styled from '@ncigdc/theme/styled';
// import SearchIcon from 'react-icons/lib/fa/search';
// import Input from '@ncigdc/uikit/Form/Input';
// import CloseIcon from '@ncigdc/theme/icons/CloseIcon';
// import { parseFilterParam, stringifyJSONParam } from '@ncigdc/utils/uri';
// import { get, debounce, trim } from 'lodash';
// import { withTheme } from '@ncigdc/theme';
// import withRouter from '@ncigdc/utils/withRouter';
// import { parse } from 'query-string';
// import Hidden from '@ncigdc/components/Hidden';

// const fieldToDisplay = {
//   'cases.project.project_id': {
//     name: 'Project Id',
//     placeholder: 'eg. TCGA-13*, *13*, *09',
//   },
//   'files.associated_entities.case_id': {
//     name: 'Case UUID',
//     placeholder: 'eg. 635f5335-b008-428e-b005-615776a6643f',
//   },
// };

// const debouncedPush = debounce((field, value, filters, push) => {
//   const newFilters = value
//     ? replaceFilters(
//         {
//           op: 'and',
//           content: [
//             {
//               op: 'in',
//               content: {
//                 field: field,
//                 value: [value],
//               },
//             },
//           ],
//         },
//         filters,
//       )
//     : removeFilter(field, filters);
//   push({
//     query: {
//       psFilters: stringifyJSONParam(newFilters),
//     },
//   });
// }, 1000);

const Header = styled(Row, {
  padding: '1rem',
  color: ({ theme }) => theme.greyScale7 || 'silver',
});

export default compose(
  // setDisplayName('ProjectPrimarySitesTablePresentation'),
  branch(
    ({ viewer }) =>
      !viewer.projects.hits.edges ||
      viewer.projects.hits.edges[0].node.primary_site.length <= 1,
    () => renderNothing(),
  ),
  // withRouter,
  // withTheme,
  // withState('searchValue', 'setSearchValue', ''),
  // withState('searchField', 'setSearchField', 'cases.project.project_id'),
  // withPropsOnChange(
  //   ['location'],
  //   ({ location: { search }, searchValue, setSearchValue, setSearchField }) => {
  //     const q = parse(search);
  //     const psFilters = parseFilterParam(q.psFilters, { content: [] });
  //     const psTableFilters = psFilters.content;
  //     const fieldsToValues = psTableFilters.reduce(
  //       (acc, f) => ({
  //         ...acc,
  //         [f.content.field]: f.content.value,
  //       }),
  //       {},
  //     );
  //     if (Object.keys(fieldsToValues).length) {
  //       const currentField = Object.keys(fieldsToValues)[0];
  //       const currentValue = fieldsToValues[currentField];
  //       setSearchField(currentField);
  //       setSearchValue(currentValue);
  //     }
  //
  //     return {
  //       psFilters,
  //     };
  //   },
  // ),
  connect(state => ({
    tableColumns: state.tableColumns.projectPrimarySites.ids,
  })),
  mapProps(props => ({
    ...props,
    hits: props.viewer.projects.hits,
  })),
)(
  ({
    viewer: { projects: { hits: { edges } } },
    entityType = 'projectPrimarySites',
    downloadable,
    tableColumns,
    tableHeader = 'Primary Sites',
    // searchValue,
    // searchField,
    // setSearchField,
    // setSearchValue,
    // push,
    // psFilters,
    // theme,
    // loading,
  }) => {
    const project = edges[0].node;

    const tableInfo = tableModels[entityType]
      .slice()
      // .sort((a, b) => tableColumns.indexOf(a.id) - tableColumns.indexOf(b.id))
      .filter(x => tableColumns.includes(x.id));

    return (
      <div>
        <Row>
          {/* <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}
          > */}
          <Row>{tableHeader && <Header>{tableHeader}</Header>}</Row>
          {/* <div>
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
                  }}
                >
                  <SearchIcon size={14} />
                </div>
                <Hidden>Filter</Hidden>
              </label>
              <Input
                disabled={loading}
                id="filter-input"
                value={searchValue}
                style={{
                  fontSize: '14px',
                  paddingLeft: '1rem',
                  border: `1px solid ${theme.greyScale5}`,
                  width: '31rem',
                  borderRadius: '0 4px 4px 0',
                }}
                placeholder={'eg. Bronchus*, *Kidney*'}
                onChange={e => {
                  const trimmed = trim(e.target.value);
                  setSearchValue(trimmed);
                  debouncedPush(searchField, trimmed, psFilters, push);
                }}
                type="text"
              />
              {!!searchValue.length && (
                <CloseIcon
                  style={{
                    position: 'absolute',
                    right: 0,
                    padding: '10px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    outline: 0,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setSearchValue('');
                    push({
                      query: removeFilter(searchField, psFilters),
                    });
                  }}
                />
              )}
            </div> */}
          {/* </div> */}
        </Row>

        <div style={{ overflowX: 'auto' }}>
          <Table
            id="project-primary-site-table"
            headings={tableInfo
              .filter(x => !x.subHeading)
              .map(x => <x.th key={x.id} />)}
            subheadings={tableInfo
              .filter(x => x.subHeading)
              .map(x => <x.th key={x.id} />)}
            body={
              <tbody>
                {project.primary_site.map((primarySite, i) => (
                  <Tr key={i} index={i}>
                    {tableInfo
                      .filter(x => x.td)
                      .map(x => (
                        <x.td
                          key={x.id}
                          primarySite={primarySite}
                          projectId={project.project_id}
                        />
                      ))}
                  </Tr>
                ))}
              </tbody>
            }
          />
        </div>
      </div>
    );
  },
);
