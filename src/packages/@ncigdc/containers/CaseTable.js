/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';

import Pagination from '@ncigdc/components/Pagination';
import Showing from '@ncigdc/components/Pagination/Showing';
import { Row } from '@ncigdc/uikit/Flex';
import TableActions from '@ncigdc/components/TableActions';

import { DATA_CATEGORIES } from '@ncigdc/utils/constants';
import { tableToolTipHint } from '@ncigdc/theme/mixins';
import { Tooltip } from '@ncigdc/uikit/Tooltip';

import { Tr, Th } from '@ncigdc/uikit/Table';

import CaseTr from './CaseTr';

import type { TTableProps } from './types';

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    borderSpacing: 0,
  },
  right: {
    textAlign: 'right',
  },
  center: {
    textAlign: 'center',
  },
};

export const CaseTableComponent = (props: TTableProps) => {
  const prefix = 'cases';
  return (
    <div>
      <Row style={{ backgroundColor: 'white', padding: '1rem', justifyContent: 'space-between' }}>
        <Showing
          docType="cases"
          prefix={prefix}
          params={props.relay.route.params}
          total={props.hits.total}
        />
        <TableActions
          prefix={prefix}
          total={props.hits.total}
          sortKey="cases_sort"
          endpoint="cases"
          downloadFields={[
            'case_id',
            'primary_site',
            'project.project_id',
            'demographic.gender',
            'summary.data_categories.file_count',
            'summary.data_categories.data_category',
          ]}
          sortOptions={[
            {
              id: 'project.project_id',
              name: 'Project',
            },
            {
              id: 'primary_site',
              name: 'Primary Site',
            },
            {
              id: 'demographic.gender',
              name: 'Gender',
            },
          ]}
          tsvSelector="#repository-case-table"
          tsvFilename="repository-case-table.tsv"
        />
      </Row>
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table} id="repository-case-table">
          <thead>
            <Tr>
              <Th rowSpan="2">Cart</Th>
              <Th rowSpan="2">Case UUID</Th>
              <Th rowSpan="2">Submitter ID</Th>
              <Th rowSpan="2">Project</Th>
              <Th rowSpan="2">Primary Site</Th>
              <Th rowSpan="2">Gender</Th>
              <Th rowSpan="2" style={styles.right}>Files</Th>
              <Th colSpan={Object.entries(DATA_CATEGORIES).length} style={styles.center}>
                Available Files per Data Category
              </Th>
              <Th rowSpan="2" style={styles.right}>Annotations</Th>
            </Tr>

            <Tr>
              {
                Object.values(DATA_CATEGORIES).map((category: any) => (
                  <Th key={category.abbr} style={styles.right}>
                    <abbr>
                      <Tooltip Component={category.full} style={tableToolTipHint()}>
                        {category.abbr}
                      </Tooltip>
                    </abbr>
                  </Th>
                ))
              }
            </Tr>
          </thead>
          <tbody>
            {props.hits.edges.map((e, i) => (
              <CaseTr {...e} key={e.node.id} index={i} total={props.hits.edges.length} />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination prefix={prefix} params={props.relay.route.params} total={props.hits.total} />
    </div>
  );
};

export const CaseTableQuery = {
  fragments: {
    hits: () => Relay.QL`
      fragment on CaseConnection {
        total
        edges {
          node {
            id
            ${CaseTr.getFragment('node')}
          }
        }
      }
    `,
  },
};

const CaseTable = Relay.createContainer(
  CaseTableComponent,
  CaseTableQuery
);

export default CaseTable;
