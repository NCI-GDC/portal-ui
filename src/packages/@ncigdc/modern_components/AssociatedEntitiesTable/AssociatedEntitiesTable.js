import React from 'react';
import { compose } from 'recompose';
import { omit } from 'lodash';
import SearchIcon from 'react-icons/lib/fa/search';

import { withTheme } from '@ncigdc/theme';
import { Row } from '@ncigdc/uikit/Flex';
import Hidden from '@ncigdc/components/Hidden';
import LocalPaginationTable from '@ncigdc/components/LocalPaginationTable';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import withRouter from '@ncigdc/utils/withRouter';

export default compose(
  withRouter,
  withTheme,
)(
  ({
    filteredAE,
    paginationPrefix,
    theme,
    searchInput,
    push,
    query,
    searchTerm,
  }) => {
    return (
      <LocalPaginationTable
        className="test-associated-cases"
        data={filteredAE}
        prefix={paginationPrefix}
        style={{ flexGrow: 1, backgroundColor: 'white', marginTop: '2rem' }}
        entityName="associated cases/biospecimen"
      >
        <EntityPageHorizontalTable
          rightComponent={
            <Row>
              <label htmlFor="filter-cases">
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
                <Hidden>filter cases</Hidden>
              </label>
              <input
                id="filter-cases"
                name="filter-cases"
                placeholder="Type to filter associated cases/biospecimen"
                type="text"
                ref={n => {
                  searchInput = n;
                }}
                onChange={() => {
                  push({
                    query: {
                      ...omit(query, `${paginationPrefix}_offset`),
                      [`${paginationPrefix}_search`]: searchInput.value,
                    },
                  });
                }}
                value={searchTerm}
                style={{
                  fontSize: '14px',
                  paddingLeft: '1rem',
                  border: `1px solid ${theme.greyScale5}`,
                  width: '28rem',
                  borderRadius: '0 4px 4px 0',
                }}
              />
            </Row>
          }
          title="Associated Cases/Biospecimen"
          emptyMessage="No cases or biospecimen found."
          headings={[
            { key: 'entity_submitter_id', title: 'Entity ID' },
            { key: 'entity_type', title: 'Entity Type' },
            { key: 'sample_type', title: 'Sample Type' },
            { key: 'case_id_link', title: 'Case UUID' },
            { key: 'annotation_count', title: 'Annotations' },
          ]}
        />
      </LocalPaginationTable>
    );
  },
);
