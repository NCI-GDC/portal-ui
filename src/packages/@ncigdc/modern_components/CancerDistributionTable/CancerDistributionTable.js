// @flow
import React from 'react';
import { tableToolTipHint, visualizingButton } from '@ncigdc/theme/mixins';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import saveFile from '@ncigdc/utils/filesaver';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import Button from '@ncigdc/uikit/Button';
import LocalPaginationTable from '@ncigdc/components/LocalPaginationTable';
import DownloadTableToTsvButton from '@ncigdc/components/DownloadTableToTsvButton';
import { Row } from '@ncigdc/uikit/Flex';

const paginationPrefix = 'canDistTable';

export default (
  { entityName, geneId, cases, filters, rawData, cancerDistData } = {},
) => {
  const mutationsHeading = geneId
    ? [
        {
          key: 'num_mutations',
          title: (
            <Tooltip
              Component={`Number of Simple Somatic Mutations observed in ${entityName} in Project`}
              style={tableToolTipHint()}
            >
              # Mutations
            </Tooltip>
          ),
          style: { textAlign: 'right' },
        },
      ]
    : [];

  return (
    <span>
      <LocalPaginationTable
        style={{ width: '100%', minWidth: 450 }}
        data={cancerDistData}
        prefix={paginationPrefix}
        buttons={
          <Row style={{ alignItems: 'flex-end' }}>
            <Tooltip
              Component={
                <span>Export All{geneId ? ' Except # Mutations' : ''}</span>
              }
              style={{ marginLeft: '2rem' }}
            >
              <Button
                style={{ ...visualizingButton }}
                onClick={() =>
                  saveFile(
                    JSON.stringify(rawData, null, 2),
                    'JSON',
                    'cancer-distribution-data.json',
                  )}
              >
                JSON
              </Button>
            </Tooltip>
            <DownloadTableToTsvButton
              selector="#cancer-distribution-table"
              filename="cancer-distribution-table.tsv"
              style={{ marginLeft: '0.5rem' }}
            />
          </Row>
        }
      >
        <EntityPageHorizontalTable
          idKey="id"
          tableId="cancer-distribution-table"
          headings={[
            { key: 'project_id', title: 'Project ID' },
            { key: 'disease_type', title: 'Disease Type' },
            { key: 'site', title: 'Site' },
            {
              key: 'num_affected_cases',
              title: (
                <Tooltip
                  Component={
                    <span>
                      # Cases tested for Simple Somatic Mutations in Project
                      affected by&nbsp;
                      {entityName}
                      / # Cases tested for Simple Somatic Mutations in Project
                    </span>
                  }
                  style={tableToolTipHint()}
                >
                  # Affected Cases
                </Tooltip>
              ),
            },
            ...mutationsHeading,
          ]}
        />
      </LocalPaginationTable>
    </span>
  );
};
