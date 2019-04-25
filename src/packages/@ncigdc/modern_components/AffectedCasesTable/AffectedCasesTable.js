// @flow

import React from 'react';
import Relay from 'react-relay/classic';
import withSize from '@ncigdc/utils/withSize';
import _ from 'lodash';
import { compose, withState } from 'recompose';
import { parse } from 'query-string';

import {
  parseIntParam,
  parseFilterParam,
  parseJSONParam,
} from '@ncigdc/utils/uri';
import { viewerQuery } from '@ncigdc/routes/queries';
import Showing from '@ncigdc/components/Pagination/Showing';
import { withTheme } from '@ncigdc/theme';
import ageDisplay from '@ncigdc/utils/ageDisplay';
import { DATA_CATEGORIES } from '@ncigdc/utils/constants';
import { tableToolTipHint } from '@ncigdc/theme/mixins';
import CaseLink from '@ncigdc/components/Links/CaseLink';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import withRouter from '@ncigdc/utils/withRouter';
import { RepositoryFilesLink } from '@ncigdc/components/Links/RepositoryLink';
import { makeFilter } from '@ncigdc/utils/filters';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import { Row } from '@ncigdc/uikit/Flex';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import Pagination from '@ncigdc/components/Pagination';
import TableActions from '@ncigdc/components/TableActions';
import MutationsCount from '@ncigdc/components/MutationsCount';
import { ForTsvExport } from '@ncigdc/components/DownloadTableToTsvButton';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
import { createClassicRenderer } from '@ncigdc/modern_components/Query';
import timestamp from '@ncigdc/utils/timestamp';

class Route extends Relay.Route {
  static routeName = 'AffectedCasesTableRoute';

  static queries = {
    ...viewerQuery,
    exploreSsms: () => Relay.QL`query { viewer }`,
  };

  static prepareParams = ({
    location: { search },
    defaultSize = 10,
    defaultFilters = null,
  }) => {
    const q = parse(search);

    return {
      affectedCasesTable_filters: parseFilterParam(
        q.affectedCasesTable_filters,
        defaultFilters,
      ),
      affectedCasesTable_offset: parseIntParam(q.affectedCasesTable_offset, 0),
      affectedCasesTable_size: parseIntParam(
        q.affectedCasesTable_size,
        defaultSize,
      ),
      affectedCasesTable_sort: parseJSONParam(q.affectedCasesTable_sort, null),
    };
  };
}

const createContainer = Component => Relay.createContainer(Component, {
  initialVariables: {
    score: 'gene.gene_id',
    affectedCasesTable_filters: null,
    affectedCasesTable_size: 10,
    affectedCasesTable_offset: 0,
    ssmCountsfilters: null,
  },
  fragments: {
    exploreSsms: () => Relay.QL`
        fragment on Root {
          explore {
            ssms {
              aggregations(filters: $ssmCountsfilters aggregations_filter_themselves: true) {
                occurrence__case__case_id {
                  buckets {
                    key
                    doc_count
                  }
                }
              }
            }
          }
        }
      `,
    viewer: () => Relay.QL`
        fragment on Root {
          explore {
            cases {
              hits (
                score: $score
                first: $affectedCasesTable_size
                filters: $affectedCasesTable_filters
                offset: $affectedCasesTable_offset
              ) {
                total
                edges {
                  node {
                    project {
                      project_id
                    }
                    primary_site
                    score
                    case_id
                    submitter_id
                    demographic {
                      gender
                    }
                    summary {
                      data_categories {
                        data_category
                        file_count
                      }
                    }
                    diagnoses {
                      hits(first: 1) {
                        edges {
                          node {
                            age_at_diagnosis
                            tumor_stage
                            days_to_last_follow_up
                            days_to_death
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
  },
});

const Component = compose(
  withRouter,
  withTheme,
  withSize(),
  withState('ssmCountsLoading', 'setSsmCountsLoading', true),
  withPropsOnChange(
    ['viewer'],
    ({
      viewer: { explore: { cases: { hits: { edges } } } },
      relay,
      ssmCountsLoading,
      setSsmCountsLoading,
    }) => {
      const caseIds = edges.map(({ node }) => node.case_id);
      if (!ssmCountsLoading) {
        setSsmCountsLoading(true);
      }
      relay.setVariables(
        {
          ssmCountsfilters: caseIds.length
            ? makeFilter([
              {
                field: 'occurrence.case.case_id',
                value: caseIds,
              },
            ])
            : null,
        },
        readyState => {
          if (readyState.done) {
            setSsmCountsLoading(false);
          }
        },
      );
    },
  ),
  withPropsOnChange(['exploreSsms'], ({ exploreSsms: { explore } }) => {
    const { ssms: { aggregations } } = explore;
    const ssmCounts = (aggregations || {
      occurrence__case__case_id: { buckets: [] },
    }).occurrence__case__case_id.buckets.reduce(
      (acc, b) => ({
        ...acc,
        [b.key]: b.doc_count,
      }),
      {},
    );
    return { ssmCounts };
  }),
)(
  (
    {
      viewer: { explore: { cases, mutationsCountFragment } },
      relay,
      defaultFilters,
      ssmCounts,
      ssmCountsLoading,
    } = {},
  ) => {
    if (cases && !cases.hits.edges.length) {
      return <Row style={{ padding: '1rem' }}>No data found.</Row>;
    }

    const totalCases = cases ? cases.hits.total : 0;

    return (
      <span>
        <Row
          style={{
            backgroundColor: 'white',
            padding: '1rem',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
          <Showing
            docType="cases"
            params={relay.route.params}
            prefix="affectedCasesTable"
            total={totalCases} />
          <Row style={{ alignItems: 'flex-end' }}>
            <TableActions
              currentFilters={defaultFilters}
              downloadFields={[
                'case_id',
                'primary_site',
                'submitter_id',
                'demographic.gender',
                'summary.data_categories.data_category',
                'summary.data_categories.file_count',
                'diagnoses.age_at_diagnosis',
                'diagnoses.tumor_stage',
                'diagnoses.days_to_last_follow_up',
                'diagnoses.days_to_death',
              ]}
              downloadTooltip="Export All Except #Mutations and #Genes"
              endpoint="case_ssms"
              scope="explore"
              style={{ marginLeft: '2rem' }}
              total={totalCases}
              tsvFilename={`most-affected-cases-table.${timestamp()}.tsv`}
              tsvSelector="#most-affected-cases-table"
              type="case" />
          </Row>
        </Row>
        <EntityPageHorizontalTable
          data={
            !cases
              ? []
              : cases.hits.edges.map(x => x.node).map(c => {
                const dataCategorySummary = c.summary.data_categories.reduce(
                  (acc, d) => ({
                    ...acc,
                    [d.data_category]: d.file_count,
                  }),
                  {},
                );

                const diagnosis = (c.diagnoses.hits.edges[0] || { node: {} })
                  .node;

                return {
                  ...c,
                  id: <ForTsvExport>{c.case_id}</ForTsvExport>,
                  submitter_id: (
                    <CaseLink uuid={c.case_id}>{c.submitter_id}</CaseLink>
                  ),
                  project_id: c.project.project_id,
                  primary_site: c.primary_site,
                  gender: c.demographic ? c.demographic.gender : '',
                  age_at_diagnosis: ageDisplay(diagnosis.age_at_diagnosis),
                  tumor_stage: diagnosis.tumor_stage,
                  days_to_last_follow_up: (!_.isNil(
                    diagnosis.days_to_last_follow_up,
                  )
                      ? diagnosis.days_to_last_follow_up
                      : '--'
                  ).toLocaleString(),
                  days_to_death: (!_.isNil(diagnosis.days_to_death)
                      ? diagnosis.days_to_death
                      : '--'
                  ).toLocaleString(),
                  num_mutations: (
                    <MutationsCount
                      filters={makeFilter([
                        {
                          field: 'cases.case_id',
                          value: [c.case_id],
                        },
                      ])}
                      isLoading={ssmCountsLoading}
                      ssmCount={ssmCounts[c.case_id]} />
                  ),
                  num_genes: (
                    <ExploreLink
                      query={{
                        searchTableTab: 'genes',
                        filters: makeFilter([
                          {
                            field: 'cases.case_id',
                            value: [c.case_id],
                          },
                        ]),
                      }}>
                      {c.score.toLocaleString()}
                    </ExploreLink>
                  ),
                  data_types: Object.keys(DATA_CATEGORIES).map(
                    k => (dataCategorySummary[DATA_CATEGORIES[k].full] ? (
                      <RepositoryFilesLink
                        query={{
                          filters: makeFilter([
                            {
                              field: 'cases.case_id',
                              value: c.case_id,
                            },
                            {
                              field: 'files.data_category',
                              value: DATA_CATEGORIES[k].full,
                            },
                          ]),
                        }}>
                        {dataCategorySummary[DATA_CATEGORIES[k].full]}
                      </RepositoryFilesLink>
                        ) : (
                          '--'
                        )),
                  ),
                };
              })
          }
          headings={[
            {
              key: 'id',
              title: 'Case UUID',
              style: { display: 'none' },
            },
            {
              key: 'submitter_id',
              title: 'Case ID',
            },
            {
              key: 'project_id',
              title: 'Project',
            },
            {
              key: 'primary_site',
              title: 'Site',
            },
            {
              key: 'gender',
              title: 'Gender',
            },
            {
              key: 'age_at_diagnosis',
              title: (
                <span>
                  Age at
                  <br />
Diagnosis
                </span>
              ),
            },
            {
              key: 'tumor_stage',
              title: 'Stage',
            },
            {
              key: 'days_to_death',
              title: 'Survival (days)',
              style: { textAlign: 'right' },
            },
            {
              key: 'days_to_last_follow_up',
              title: (
                <Tooltip
                  Component="Days to Last Follow Up"
                  style={tableToolTipHint()}>
                  Last Follow
                  <br />
Up (days)
                </Tooltip>
              ),
              style: {
                textAlign: 'right',
                padding: '3px 15px 3px 3px',
              },
            },
            {
              key: 'data_types',
              title: (
                <div style={{ textAlign: 'center' }}>
                  Available Files per Data Category
                </div>
              ),
              style: { textAlign: 'right' },
              subheadings: Object.keys(DATA_CATEGORIES).map(k => (
                <abbr
                  key={DATA_CATEGORIES[k].abbr}
                  style={{ fontSize: '1rem' }}>
                  <Tooltip
                    Component={DATA_CATEGORIES[k].full}
                    style={tableToolTipHint()}>
                    {DATA_CATEGORIES[k].abbr}
                  </Tooltip>
                </abbr>
              )),
            },
            {
              key: 'num_mutations',
              title: (
                <Tooltip
                  Component="# Simple Somatic Mutations"
                  style={tableToolTipHint()}>
                  # Mutations
                </Tooltip>
              ),
              style: { textAlign: 'right' },
            },
            {
              key: 'num_genes',
              title: (
                <Tooltip
                  Component="# Genes with Simple Somatic Mutations"
                  style={tableToolTipHint()}>
                  # Genes
                </Tooltip>
              ),
              style: { textAlign: 'right' },
            },
          ]}
          idKey="case_id"
          tableId="most-affected-cases-table" />
        <Pagination
          params={relay.route.params}
          prefix="affectedCasesTable"
          total={!cases ? 0 : cases.hits.total} />
      </span>
    );
  },
);

export default createClassicRenderer(Route, createContainer(Component), 387);
