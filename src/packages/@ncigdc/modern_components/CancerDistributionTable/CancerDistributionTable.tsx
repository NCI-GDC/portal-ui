import Button from '@ncigdc/uikit/Button';
import CollapsibleList from '@ncigdc/uikit/CollapsibleList';
import DownloadTableToTsvButton from '@ncigdc/components/DownloadTableToTsvButton';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import ExploreSSMLink from '@ncigdc/components/Links/ExploreSSMLink';
import GreyBox from '@ncigdc/uikit/GreyBox';
import LocalPaginationTable from '@ncigdc/components/LocalPaginationTable';
import MutationsCount from '@ncigdc/components/MutationsCount';
import ProjectLink from '@ncigdc/components/Links/ProjectLink';
import React from 'react';
import saveFile from '@ncigdc/utils/filesaver';
import timestamp from '@ncigdc/utils/timestamp';
import { compose, withPropsOnChange, withState } from 'recompose';
import { groupBy, head } from 'lodash';
import { makeFilter, replaceFilters } from '@ncigdc/utils/filters';
import { Row } from '@ncigdc/uikit/Flex';
import { tableToolTipHint, visualizingButton } from '@ncigdc/theme/mixins';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import SortTableButton, {
  TSortTableButtonSortFunc,
  ISortSelection,
} from '@ncigdc/components/SortTableButton';
import multisort from 'multisort';

const paginationPrefix = 'canDistTable';

const CollapsibleRowList: React.ComponentType<{
  data: Array<{}>;
  label: string;
}> = props => {
  const { data, label } = props;

  if (!data.length) {
    return <GreyBox />;
  }

  return (
    <span>
      {data.length > 1 && (
        <CollapsibleList
          liStyle={{ whiteSpace: 'normal', listStyleType: 'disc' }}
          toggleStyle={{ fontStyle: 'normal' }}
          data={data.slice(0).sort()}
          limit={0}
          expandText={`${data.length} ` + label}
          collapseText="collapse"
        />
      )}
      {data.length === 1 && data[0]}
    </span>
  );
};

interface IBucket {
  doc_count: number;
  key: string;
}
interface ICancerDistributionTableProps {
  viewer: {
    explore: {
      cases: {
        filtered: {
          project__project_id: {
            buckets: IBucket[];
          };
        };
      };
      ssms: {
        aggregations: {
          occurrence__case__project__project_id: {
            buckets: IBucket[];
          };
        };
      };
    };
  };
  projectsViewer: {};
  geneId: number;
  entityName: string;
  filters: {};
  tableType: string;
}

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

interface ITableColumnData {
  name: string;
  id: string;
  sortable: boolean;
  elem: React.ReactElement<any>;
}

type TCancerDistDataItem = React.ReactElement<any> & ITableColumnData;

interface ICDTWrappedProps extends ICancerDistributionTableProps {
  cases: {};
  rawData: TRawData;
  cancerDistData: TCancerDistDataItem[];
  tableSort: ReadonlyArray<ISortSelection>;
  setTableSort: any;
}

// TODO: When wanting more complex behaviour for CNV data,
// switch to Table.model pattern same as GeneTable to support
// and do not overload this component with functionality
export default compose<ICDTWrappedProps, ICancerDistributionTableProps>(
  withPropsOnChange(
    ['viewer', 'projectsViewer'],
    ({
      viewer: { explore: { cases, ssms: { aggregations } } },
      projectsViewer: { projects },
      geneId,
      filters,
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

      const cancerDistData = rawData.map(row => {
        const projectFilter = makeFilter([
          {
            field: 'cases.project.project_id',
            value: row.project_id,
          },
          {
            field: 'cases.available_variation_data',
            value: 'ssm',
          },
        ]);
        return {
          id: row.project_id, // used for key in table
          freq: row.num_affected_cases_percent,
          project_id: (
            <ProjectLink uuid={row.project_id}>{row.project_id}</ProjectLink>
          ),
          disease_type: (
            <CollapsibleRowList
              data={row.disease_type}
              label={'Disease Types'}
            />
          ),
          site: <CollapsibleRowList data={row.site} label={'Primary Sites'} />,
          num_affected_cases: {
            name: 'Affected Cases',
            id: 'num_affected_cases',
            data: row.num_affected_cases,
            sortable: true,
            elem: (
              <span>
                <ExploreSSMLink
                  merge
                  searchTableTab={'cases'}
                  filters={replaceFilters(projectFilter, filters)}
                >
                  {row.num_affected_cases}
                </ExploreSSMLink>
                <span> / </span>
                <ExploreLink
                  query={{
                    searchTableTab: 'cases',
                    filters: projectFilter,
                  }}
                >
                  {row.num_affected_cases_total.toLocaleString()}
                </ExploreLink>
                <span>
                  &nbsp;({(row.num_affected_cases_percent * 100).toFixed(2)}%)
                </span>
              </span>
            ),
          },
          ...(tableType !== 'ssm' && {
            cnv_gain: {
              name: 'CNV Gain',
              id: 'cnv_gain',
              data: row.num_cnv_gain_percent,
              sortable: true,
              elem: (
                <span>
                  {row.num_cnv_gain.toLocaleString()}
                  <span> / </span>
                  {row.num_cnv_cases_total.toLocaleString()}
                  <span>
                    &nbsp;({(row.num_cnv_gain_percent * 100).toFixed(2)}%)
                  </span>
                </span>
              ),
            },
            cnv_loss: {
              name: 'CNV Loss',
              id: 'cnv_loss',
              data: row.num_cnv_loss_percent,
              sortable: true,
              elem: (
                <span>
                  {row.num_cnv_loss.toLocaleString()}
                  <span> / </span>
                  {row.num_cnv_cases_total.toLocaleString()}
                  <span>
                    &nbsp;({(row.num_cnv_loss_percent * 100).toFixed(2)}%)
                  </span>
                </span>
              ),
            },
          }),
          ...geneId
            ? {
                num_mutations: (
                  <MutationsCount
                    ssmCount={ssmCounts[row.project_id]}
                    filters={replaceFilters(projectFilter, filters)}
                  />
                ),
              }
            : null,
        };
      });

      return { rawData, cancerDistData };
    }
  ),
  withState('tableSort', 'setTableSort', [])
)(
  ({
    entityName,
    geneId,
    rawData,
    cancerDistData,
    tableType,
    tableSort,
    setTableSort,
  }) => {
    const sortFunction: TSortTableButtonSortFunc = s => setTableSort(s);

    const mutationsHeading = geneId
      ? [
          {
            key: 'num_mutations',
            title: (
              <Tooltip
                Component={
                  <span>
                    # Unique Simple Somatic Mutations observed in {entityName}
                    in Project
                  </span>
                }
                style={tableToolTipHint()}
              >
                # Mutations
              </Tooltip>
            ),
            style: { textAlign: 'right' },
          },
        ]
      : [];
    const cnvHeadings =
      tableType !== 'ssm'
        ? [
            {
              key: 'cnv_gain.elem',
              title: (
                <Row>
                  <Tooltip
                    Component={
                      <span>
                        # of Cases tested for CNV in Project affected by CNV
                        loss event in&nbsp;
                        {entityName}&nbsp; / # of Cases tested for Copy Number
                        Variation in Project
                      </span>
                    }
                    style={tableToolTipHint()}
                  >
                    # CNV Gains
                  </Tooltip>
                </Row>
              ),
            },
            {
              key: 'cnv_loss.elem',
              title: (
                <Row>
                  <Tooltip
                    Component={
                      <span>
                        # of Cases tested for CNV in Project affected by CNV
                        loss event in&nbsp;
                        {entityName}&nbsp; / # of Cases tested for Copy Number
                        Variation in Project
                      </span>
                    }
                    style={tableToolTipHint()}
                  >
                    # CNV Losses
                  </Tooltip>
                </Row>
              ),
            },
          ]
        : [];

    const multisortKey: string[] =
      tableSort.length > 0
        ? tableSort.reduce(
            (acc, curr) => {
              // https://www.npmjs.com/package/multisort
              const field = `${curr.field}.data`;
              acc.push(curr.order === 'desc' ? `~${field}` : field);
              return acc;
            },
            [] as string[]
          )
        : ['~num_affected_cases']; // default sort

    return (
      <span>
        <LocalPaginationTable
          style={{ width: '100%', minWidth: 450 }}
          data={multisort(cancerDistData, multisortKey)}
          prefix={paginationPrefix}
          buttons={
            <Row style={{ alignItems: 'flex-end' }}>
              <SortTableButton
                sortFunction={sortFunction}
                options={cancerDistData
                  .filter(d => {
                    debugger;
                    return (
                      typeof d === 'object' &&
                      d.constructor === Object &&
                      d.sortable
                    );
                  })
                  .map(d => ({
                    name: d.name,
                    id: d.id,
                  }))}
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
            headings={[
              { key: 'project_id', title: 'Project' },
              { key: 'disease_type', title: 'Disease Type' },
              { key: 'site', title: 'Site' },
              {
                key: 'num_affected_cases.elem',
                title: (
                  <Row>
                    <Tooltip
                      Component={
                        <span>
                          # Cases tested for Simple Somatic Mutations in Project
                          affected by&nbsp;
                          {entityName}&nbsp; / # Cases tested for Simple Somatic
                          Mutations in Project
                        </span>
                      }
                      style={tableToolTipHint()}
                    >
                      # SSM Affected Cases
                    </Tooltip>
                  </Row>
                ),
              },
              ...cnvHeadings,
              ...mutationsHeading,
            ]}
          />
        </LocalPaginationTable>
      </span>
    );
  }
);
