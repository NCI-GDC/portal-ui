// @flow
import React from 'react';
import { groupBy, head } from 'lodash';
import { compose, withPropsOnChange } from 'recompose';
import { tableToolTipHint, visualizingButton } from '@ncigdc/theme/mixins';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import saveFile from '@ncigdc/utils/filesaver';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import Button from '@ncigdc/uikit/Button';
import { replaceFilters } from '@ncigdc/utils/filters';
import ProjectLink from '@ncigdc/components/Links/ProjectLink';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import LocalPaginationTable from '@ncigdc/components/LocalPaginationTable';
import DownloadTableToTsvButton from '@ncigdc/components/DownloadTableToTsvButton';
import { Row } from '@ncigdc/uikit/Flex';
import GreyBox from '@ncigdc/uikit/GreyBox';
import MutationsCount from '@ncigdc/components/MutationsCount';
import timestamp from '@ncigdc/utils/timestamp';
const paginationPrefix = 'canDistTable';

export default compose(
  withPropsOnChange(
    ['viewer', 'projectsViewer'],
    ({
      viewer: { explore: { cases, ssms: { aggregations } } },
      projectsViewer: { projects },
      geneId,
      entityName,
      filters,
    }) => {
      const ssmCounts = (aggregations || {
        occurrence__case__project__project_id: { buckets: [] },
      }).occurrence__case__project__project_id.buckets.reduce(
        (acc, b) => ({ ...acc, [b.key]: b.doc_count }),
        {},
      );

      const projectsById = groupBy(
        (projects.hits || { edges: [] }).edges,
        e => e.node.project_id,
      );
      let caseFiltered = {};
      ['filtered', 'cnvGain', 'cnvLoss', 'total', 'cnvTotal'].map(type =>
        cases[type].project__project_id.buckets.map(
          b =>
            (caseFiltered = {
              ...caseFiltered,
              [b.key]: {
                ...caseFiltered[b.key],
                [type]: b.doc_count,
              },
            }),
        ),
      );

      const rawData = Object.keys(caseFiltered)
        .map(b => {
          const project = head(projectsById[b]);
          return {
            project_id: b,
            disease_type: project
              ? (project.node.disease_type || []).join(', ')
              : null,
            site: project ? (project.node.primary_site || []).join(', ') : null,
            num_affected_cases: caseFiltered[b].filtered || 0,
            num_affected_cases_total: caseFiltered[b].total || 0,
            num_affected_cases_percent:
              caseFiltered[b].filtered / caseFiltered[b].total || 0,
            num_cnv_gain: caseFiltered[b].cnvGain || 0,
            num_cnv_gain_percent:
              caseFiltered[b].cnvGain / caseFiltered[b].cnvTotal || 0,
            num_cnv_loss: caseFiltered[b].cnvLoss || 0,
            num_cnv_loss_percent:
              caseFiltered[b].cnvLoss / caseFiltered[b].cnvTotal || 0,
            num_cnv_cases_total: caseFiltered[b].cnvTotal || 0,
            mutations_counts: ssmCounts[b] || 0,
          };
        })
        .sort(
          (a, b) => b.num_affected_cases_percent - a.num_affected_cases_percent,
        );

      const cancerDistData = rawData.map(row => {
        const projectFilter = {
          op: 'and',
          content: [
            {
              op: 'in',
              content: {
                field: 'cases.project.project_id',
                value: [row.project_id],
              },
            },
            {
              op: 'in',
              content: {
                field: 'cases.available_variation_data',
                value: ['ssm'],
              },
            },
          ],
        };
        const cnvProjectFilter = {
          op: 'and',
          content: [
            {
              op: 'in',
              content: {
                field: 'cases.project.project_id',
                value: [row.project_id],
              },
            },
            {
              op: 'in',
              content: {
                field: 'cases.available_variation_data',
                value: ['cnv'],
              },
            },
          ],
        };
        const cnvGainProjectFilter = {
          op: 'and',
          content: [
            {
              op: 'in',
              content: {
                field: 'cases.project.project_id',
                value: [row.project_id],
              },
            },
            {
              op: 'in',
              content: {
                field: 'cases.available_variation_data',
                value: ['cnv'],
              },
            },
            {
              op: 'in',
              content: {
                field: 'cnvs.cnv_change',
                value: ['Gain', 'Amplification'],
              },
            },
          ],
        };
        const cnvLossProjectFilter = {
          op: 'and',
          content: [
            {
              op: 'in',
              content: {
                field: 'cases.project.project_id',
                value: [row.project_id],
              },
            },
            {
              op: 'in',
              content: {
                field: 'cases.available_variation_data',
                value: ['cnv'],
              },
            },
            {
              op: 'in',
              content: {
                field: 'cnvs.cnv_change',
                value: ['Shallow Loss', 'Deep Loss'],
              },
            },
          ],
        };
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
                query={{
                  searchTableTab: 'cases',
                  filters: replaceFilters(projectFilter, filters),
                }}
              >
                {row.num_affected_cases}
              </ExploreLink>
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
          cnv_gain: (
            <span>
              <ExploreLink
                query={{
                  searchTableTab: 'cases',
                  filters: replaceFilters(cnvGainProjectFilter, filters),
                }}
              >
                {row.num_cnv_gain.toLocaleString()}
              </ExploreLink>
              <span> / </span>
              <ExploreLink
                query={{
                  searchTableTab: 'cases',
                  filters: cnvProjectFilter,
                }}
              >
                {row.num_cnv_cases_total.toLocaleString()}
              </ExploreLink>
              <span>
                &nbsp;({(row.num_cnv_gain_percent * 100).toFixed(2)}%)
              </span>
            </span>
          ),
          cnv_loss: (
            <span>
              <ExploreLink
                query={{
                  searchTableTab: 'cases',
                  filters: replaceFilters(cnvLossProjectFilter, filters),
                }}
              >
                {row.num_cnv_loss.toLocaleString()}
              </ExploreLink>
              <span> / </span>
              <ExploreLink
                query={{
                  searchTableTab: 'cases',
                  filters: cnvProjectFilter,
                }}
              >
                {row.num_cnv_cases_total.toLocaleString()}
              </ExploreLink>
              <span>
                &nbsp;({(row.num_cnv_loss_percent * 100).toFixed(2)}%)
              </span>
            </span>
          ),
          ...(geneId
            ? {
                num_mutations: (
                  <MutationsCount
                    ssmCount={ssmCounts[row.project_id]}
                    filters={replaceFilters(projectFilter, filters)}
                  />
                ),
              }
            : null),
        };
      });

      return { rawData, cancerDistData };
    },
  ),
)(({ entityName, geneId, cases, filters, rawData, cancerDistData } = {}) => {
  const mutationsHeading = geneId
    ? [
        {
          key: 'num_mutations',
          title: (
            <Tooltip
              Component={
                <span>
                  # Unique Simple Somatic Mutations observed in {entityName} in
                  Project
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
              key: 'num_affected_cases',
              title: (
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
              ),
            },
            {
              key: 'cnv_gain',
              title: (
                <Tooltip
                  Component={
                    <span>
                      # of Cases tested for CNV in Project affected by CNV gain
                      event in&nbsp;
                      {entityName}&nbsp; / # of Cases tested for Copy Number
                      Variation in Project
                    </span>
                  }
                  style={tableToolTipHint()}
                >
                  # CNV Gains
                </Tooltip>
              ),
            },
            {
              key: 'cnv_loss',
              title: (
                <Tooltip
                  Component={
                    <span>
                      # of Cases tested for CNV in Project affected by CNV loss
                      event in&nbsp;
                      {entityName}&nbsp; / # of Cases tested for Copy Number
                      Variation in Project
                    </span>
                  }
                  style={tableToolTipHint()}
                >
                  # CNV Losses
                </Tooltip>
              ),
            },
            ...mutationsHeading,
          ]}
        />
      </LocalPaginationTable>
    </span>
  );
});
