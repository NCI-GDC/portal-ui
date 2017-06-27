// @flow
import React from 'react';
import Relay from 'react-relay/classic';
import { lifecycle, compose, withPropsOnChange } from 'recompose';
import { groupBy, isEqual, head, get } from 'lodash';
import { tableToolTipHint, visualizingButton } from '@ncigdc/theme/mixins';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { Column, Row } from '@ncigdc/uikit/Flex';
import { makeFilter } from '@ncigdc/utils/filters';
import ProjectLink from '@ncigdc/components/Links/ProjectLink';
import GreyBox from '@ncigdc/uikit/GreyBox';
import Loader from '@ncigdc/uikit/Loaders/Loader';
import DownloadTableToTsvButton from '@ncigdc/components/DownloadTableToTsvButton';
import Button from '@ncigdc/uikit/Button';
import saveFile from '@ncigdc/utils/filesaver';
import Showing from '@ncigdc/components/Pagination/Showing';
import Pagination from '@ncigdc/components/Pagination';
import withRouter from '@ncigdc/utils/withRouter';
import type { TGroupFilter } from '@ncigdc/utils/filters/types';
import MutationsCount from '@ncigdc/components/MutationsCount';

const paginationPrefix = 'canDistTable';

type TProps = {|
  entityName: string,
  geneId: string,
  explore: {
    ssms: {},
  },
  cases: {
    total: {},
    filtered: {
      project__project_id: {
        buckets: Array<{
          doc_count: number,
          key: string,
        }>,
      },
    },
  },
  projects: {
    hits: {
      edges: [],
      project__project_id: {
        buckets: Array<{
          doc_count: number,
          key: string,
        }>,
      },
    },
  },
  filters: TGroupFilter,
  rawData: Array<{}>,
  cancerDistData: Array<{}>,
  tableData: Array<{}>,
  query: {},
  enablePagination: boolean,
|};

const CancerDistributionTableComponent = compose(
  lifecycle({
    componentDidMount(): void {
      this.props.relay.setVariables({
        fetchFilteredCaseAggs: true,
        caseAggsFilter: this.props.filters,
      });
    },
    componentWillReceiveProps(nextProps: TProps): void {
      if (
        !isEqual(nextProps.cases, this.props.cases) &&
        nextProps.cases.filtered
      ) {
        const { geneId } = this.props;
        this.props.relay.setVariables({
          fetchSsmCounts: !!geneId,
          ssmCountsfilters: geneId
            ? {
                op: 'and',
                content: [
                  {
                    op: 'in',
                    content: {
                      field: 'consequence.transcript.gene.gene_id',
                      value: [geneId],
                    },
                  },
                ],
              }
            : null,
          fetchProjects: true,
          numProjects:
            nextProps.cases.filtered.project__project_id.buckets.length,
          projectFilter: makeFilter([
            {
              field: 'project_id',
              value: nextProps.cases.filtered.project__project_id.buckets.map(
                b => b.key,
              ),
            },
          ]),
        });
      }
    },
  }),
  withPropsOnChange(
    ['cases', 'projects', 'geneId', 'entityName', 'explore'],
    ({ cases, projects, geneId, entityName, explore }: TProps) => {
      const { ssms: { aggregations } } = explore;
      const ssmCounts = (aggregations || {
        occurrence__case__project__project_id: { buckets: [] },
      }).occurrence__case__project__project_id.buckets
        .reduce((acc, b) => ({ ...acc, [b.key]: b.doc_count }), {});

      const casesByProjectMap = get(
        cases.total,
        'project__project_id.buckets',
        [],
      ).reduce(
        (acc, bucket) => ({ ...acc, [bucket.key]: bucket.doc_count }),
        {},
      );
      const projectsById = groupBy(
        (projects.hits || { edges: [] }).edges,
        e => e.node.project_id,
      );

      const rawData = (cases.filtered || {
        project__project_id: { buckets: [] },
      }).project__project_id.buckets
        .map(b => {
          const totalCasesByProject = casesByProjectMap[b.key];
          const project = head(projectsById[b.key]);

          return {
            project_id: b.key,
            disease_type: project
              ? (project.node.disease_type || []).join(', ')
              : null,
            site: project ? (project.node.primary_site || []).join(', ') : null,
            num_affected_cases: b.doc_count,
            num_affected_cases_total: totalCasesByProject,
            num_affected_cases_percent: b.doc_count / totalCasesByProject,
            mutations_counts: ssmCounts[b.key],
          };
        })
        .sort(
          (a, b) => b.num_affected_cases_percent - a.num_affected_cases_percent,
        );

      const baseFilter = geneId
        ? { field: 'genes.gene_id', value: [geneId] }
        : { field: 'ssms.ssm_id', value: [entityName] };

      const cancerDistData = rawData.map(row => {
        const projectFilter = makeFilter([
          baseFilter,
          { field: 'cases.project.project_id', value: [row.project_id] },
        ]);

        return {
          id: row.project_id, // used for key in table
          freq: row.num_affected_cases_percent,
          project_id: (
            <ProjectLink uuid={row.project_id}>{row.project_id}</ProjectLink>
          ),
          disease_type: row.disease_type || <GreyBox />,
          site: row.site || <GreyBox />,
          num_affected_cases: (
            <span>
              <ExploreLink
                query={{ searchTableTab: 'cases', filters: projectFilter }}
              >
                {row.num_affected_cases}
              </ExploreLink>
              <span> / </span>
              <ExploreLink
                query={{
                  searchTableTab: 'cases',
                  filters: makeFilter([
                    {
                      field: 'cases.project.project_id',
                      value: [row.project_id],
                    },
                    { field: 'cases.available_variation_data', value: 'ssm' },
                  ]),
                }}
              >
                {row.num_affected_cases_total.toLocaleString()}
              </ExploreLink>
              <span>
                &nbsp;({(row.num_affected_cases_percent * 100).toFixed(2)}%)
              </span>
            </span>
          ),
          ...(geneId
            ? {
                num_mutations: (
                  <MutationsCount
                    ssmCount={ssmCounts[row.project_id]}
                    filters={projectFilter}
                  />
                ),
              }
            : null),
        };
      });

      return { rawData, cancerDistData };
    },
  ),
  withRouter,
  withPropsOnChange(
    ['cancerDistData', 'query'],
    ({ cancerDistData, query }) => {
      const size = parseInt(query[`${paginationPrefix}_size`] || 10, 10);
      const offset = parseInt(query[`${paginationPrefix}_offset`] || 0, 10);
      const enablePagination = cancerDistData.length > 10;

      return {
        query: {
          ...query,
          [`${paginationPrefix}_size`]: size,
          [`${paginationPrefix}_offset`]: enablePagination ? offset : 0,
        },
        enablePagination,
        tableData: enablePagination
          ? cancerDistData.slice(offset, offset + size)
          : cancerDistData,
      };
    },
  ),
)(
  (
    {
      entityName,
      geneId,
      cases,
      filters,
      rawData,
      cancerDistData,
      tableData,
      query,
      enablePagination,
    }: TProps = {},
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
      <Loader loading={!cases.filtered} height="387px">
        <Row
          style={{
            backgroundColor: 'white',
            padding: '1rem',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          {enablePagination
            ? <Showing
                docType="projects"
                prefix={paginationPrefix}
                params={query}
                total={cancerDistData.length}
              />
            : <span />}
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
        </Row>
        <Column style={{ width: '100%', minWidth: 450 }}>
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
            data={tableData}
          />
          {enablePagination &&
            <Pagination
              prefix={paginationPrefix}
              params={query}
              total={cancerDistData.length}
            />}
        </Column>
      </Loader>
    );
  },
);

const CancerDistributionTableQuery = {
  initialVariables: {
    caseAggsFilter: null,
    projectFilter: null,
    numProjects: null,
    fetchProjects: false,
    fetchFilteredCaseAggs: false,
    ssmCountsfilters: null,
    fetchSsmCounts: false,
    ssmTested: makeFilter([
      {
        field: 'cases.available_variation_data',
        value: 'ssm',
      },
    ]),
  },
  fragments: {
    projects: () => Relay.QL`
      fragment on Projects {
        blah: hits(first: 0) { total }
        hits(first: $numProjects filters: $projectFilter) @include(if: $fetchProjects) {
          edges {
            node {
              primary_site
              disease_type
              project_id
            }
          }
        }
      }
    `,
    explore: () => Relay.QL`
      fragment on Explore {
        ssms {
          blah: hits(first: 0) { total }
          aggregations(filters: $ssmCountsfilters) @include(if: $fetchSsmCounts){
            occurrence__case__project__project_id {
              buckets {
                key
                doc_count
              }
            }
          }
        }
      }
    `,
    cases: () => Relay.QL`
      fragment on ExploreCases {
        filtered: aggregations(filters: $caseAggsFilter) @include(if: $fetchFilteredCaseAggs) {
          project__project_id {
            buckets {
              doc_count
              key
            }
          }
        }
        total: aggregations(filters: $ssmTested) {
          project__project_id {
            buckets {
              doc_count
              key
            }
          }
        }
      }
    `,
  },
};

const CancerDistributionTable = Relay.createContainer(
  CancerDistributionTableComponent,
  CancerDistributionTableQuery,
);

export default CancerDistributionTable;
