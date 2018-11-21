import Button from '@ncigdc/uikit/Button';
import DownloadTableToTsvButton from '@ncigdc/components/DownloadTableToTsvButton';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import LocalPaginationTable from '@ncigdc/components/LocalPaginationTable';
import React from 'react';
import saveFile from '@ncigdc/utils/filesaver';
import timestamp from '@ncigdc/utils/timestamp';
import { compose, withPropsOnChange, withState } from 'recompose';
import { groupBy, head } from 'lodash';
import { Row } from '@ncigdc/uikit/Flex';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import SortTableButton, {
  TSortTableButtonSortFunc,
  ISortSelection,
} from '@ncigdc/components/SortTableButton';
import tableModel from './CancerDistributionTable.model';
import { TCancerDistributionTableProps, IBucket } from './types';
import multisort from 'multisort';

const paginationPrefix = 'canDistTable';

type TRawData = Array<{
  project_id: string;
  disease_type?: any;
  site?: any;
  num_affected_cases?: any;
  num_affected_cases_total?: any;
  num_affected_cases_percent?: any;
  num_cnv_gain?: any;
  num_cnv_gain_percent?: any;
  num_cnv_loss?: any;
  num_cnv_loss_percent?: any;
  num_cnv_cases_total?: any;
}>;

interface ICDTWrappedProps extends TCancerDistributionTableProps {
  cases: {};
  rawData: TRawData;
  tableSort: ReadonlyArray<ISortSelection>;
  setTableSort: any;
}

export default compose<ICDTWrappedProps, TCancerDistributionTableProps>(
  withPropsOnChange(
    ['viewer', 'projectsViewer'],
    ({
      viewer: { explore: { cases, ssms: { aggregations } } },
      projectsViewer: { projects },
      tableType,
    }) => {
      const ssmCounts = (aggregations || {
        occurrence__case__project__project_id: { buckets: [] },
      }).occurrence__case__project__project_id.buckets.reduce(
        (acc: { [key: string]: number }, b: IBucket) => ({
          ...acc,
          [b.key]: b.doc_count,
        }),
        {}
      );

      const projectsById = groupBy(
        (projects.hits || { edges: [] }).edges,
        e => e.node.project_id
      );

      let caseFiltered = {};

      const fields = ['filtered', 'total'];

      if (tableType !== 'ssm') {
        fields.push('cnvGain', 'cnvLoss', 'cnvTotal');
      }

      fields.map(type =>
        cases[type].project__project_id.buckets.map(
          (b: IBucket) =>
            (caseFiltered = {
              ...caseFiltered,
              [b.key]: {
                ...caseFiltered[b.key],
                [type]: b.doc_count,
              },
            })
        )
      );

      const rawData: TRawData = Object.keys(caseFiltered)
        .filter(b => head(projectsById[b]))
        .map(b => {
          const project = head(projectsById[b]);
          return {
            project_id: b,
            disease_type: project ? project.node.disease_type : null,
            site: project ? project.node.primary_site : null,
            num_affected_cases: caseFiltered[b].filtered || 0,
            num_affected_cases_total: caseFiltered[b].total || 0,
            num_affected_cases_percent:
              caseFiltered[b].filtered / caseFiltered[b].total || 0,
            ...(tableType !== 'ssm' && {
              num_cnv_gain: caseFiltered[b].cnvGain || 0,
              num_cnv_gain_percent:
                caseFiltered[b].cnvGain / caseFiltered[b].cnvTotal || 0,
              num_cnv_loss: caseFiltered[b].cnvLoss || 0,
              num_cnv_loss_percent:
                caseFiltered[b].cnvLoss / caseFiltered[b].cnvTotal || 0,
              num_cnv_cases_total: caseFiltered[b].cnvTotal || 0,
            }),
            mutations_counts: ssmCounts[b] || 0,
          };
        })
        .sort(
          (a, b) => b.num_affected_cases_percent - a.num_affected_cases_percent
        );

      return { rawData };
    }
  ),
  withState('tableSort', 'setTableSort', [])
)(
  ({
    entityName,
    geneId,
    rawData,
    tableType,
    tableSort,
    viewer,
    setTableSort,
    filters,
  }) => {
    const sortFunction: TSortTableButtonSortFunc = s => setTableSort(s);

    const tableInfo = tableModel({
      tableType,
      viewer,
      entityName,
      filters,
      geneId,
    });

    const visibleCols = tableInfo.filter(x => !x.hidden);
    const sortableCols = tableInfo.filter(x => x.sortable);

    const multisortKey: string[] =
      tableSort.length > 0
        ? tableSort.reduce(
            (acc, {order, field}) => {
              acc.push(order === 'desc' ? `~${field}` : field);
              return acc;
            },
            [] as string[]
            )
            : ['~num_affected_cases_percent']; // default sort
    
    // Sort rawdata before formatting
    // https://www.npmjs.com/package/multisort
    const data = multisort(rawData, multisortKey)
    .map(row =>
      visibleCols.reduce((acc, { id, td }) => {
        acc[id] = td({ node: row });
        return acc;
      }, {})
    );

    return (
      <span>
        <LocalPaginationTable
          style={{ width: '100%', minWidth: 450 }}
          data={data}
          prefix={paginationPrefix}
          buttons={
            <Row style={{ alignItems: 'flex-end' }}>
              <SortTableButton
                sortFunction={sortFunction}
                options={sortableCols.map(({ id, name }) => ({ id, name }))}
                style={{ ...visualizingButton }}
              />
              <Tooltip
                Component={
                  <span>Export All{geneId ? ' Except # Mutations' : ''}</span>
                }
                style={{ marginLeft: '0.5rem' }}
              >
                <Button
                  style={{ ...visualizingButton }}
                  onClick={() =>
                    saveFile(
                      JSON.stringify(rawData, null, 2),
                      'JSON',
                      'cancer-distribution-data.json'
                    )}
                >
                  JSON
                </Button>
              </Tooltip>
              <DownloadTableToTsvButton
                selector="#cancer-distribution-table"
                filename={`cancer-distribution-table${timestamp()}.tsv`}
                style={{ marginLeft: '0.5rem' }}
              />
            </Row>
          }
        >
          <EntityPageHorizontalTable
            idKey="id"
            tableId="cancer-distribution-table"
            headings={visibleCols.map(({ id, th }, idx) => ({
              key: id,
              title: th(),
              style:
                idx === visibleCols.length - 1 ? { textAlign: 'right' } : {},
            }))}
          />
        </LocalPaginationTable>
      </span>
    );
  }
);
