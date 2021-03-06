import React from 'react';
import _ from 'lodash';

import {
  RepositoryCasesLink,
  RepositoryFilesLink,
} from '@ncigdc/components/Links/RepositoryLink';
import OverflowTooltippedLabel from '@ncigdc/uikit/OverflowTooltippedLabel';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import ProjectLink from '@ncigdc/components/Links/ProjectLink';
import CaseLink from '@ncigdc/components/Links/CaseLink';
import {
  Th, Td, TdNum, ThNum,
} from '@ncigdc/uikit/Table';
import { makeFilter, replaceFilters } from '@ncigdc/utils/filters';
import ageDisplay from '@ncigdc/utils/ageDisplay';
import withRouter from '@ncigdc/utils/withRouter';
import ImageViewerLink from '@ncigdc/components/Links/ImageViewerLink';
import {
  ArrowIcon,
  MicroscopeIcon,
} from '@ncigdc/theme/icons';
import { DISPLAY_SLIDES } from '@ncigdc/utils/constants';
import { ForTsvExport } from '@ncigdc/components/DownloadTableToTsvButton';
import { slideCountFromCaseSummary } from '@ncigdc/modern_components/CaseSummary/CaseSummary';
import ExploreSSMLink from '@ncigdc/components/Links/ExploreSSMLink';

import {
  createDataCategoryColumns,
  createSelectColumn,
} from '@ncigdc/tableModels/utils';
import { tableToolTipHint } from '@ncigdc/theme/mixins';
import MutationsCount from '@ncigdc/components/MutationsCount';

const youngestDiagnosis = (
  p: { age_at_diagnosis: number },
  c: { age_at_diagnosis: number },
): { age_at_diagnosis: number } =>
  (c.age_at_diagnosis < p.age_at_diagnosis ? c : p);

const dataCategoryColumns = createDataCategoryColumns({
  title: 'Available Files per Data Category',
  countKey: 'file_count',
  Link: RepositoryFilesLink,
  getCellLinkFilters: node => [
    {
      field: 'cases.case_id',
      value: node.case_id,
    },
  ],
  getTotalLinkFilters: hits => [],
});

const FilesLink = ({ node, fields = [], children }) =>
  (children === '0' ? (
    <span>0</span>
  ) : (
    <RepositoryFilesLink
      query={{
        filters: makeFilter([
          {
            field: 'cases.case_id',
            value: [node.case_id],
          },
          ...fields,
        ]),
      }}
      >
      {children}
    </RepositoryFilesLink>
  ));

const getProjectIdFilter = projects =>
  makeFilter([
    {
      field: 'cases.project.project_id',
      value: projects.edges.map(({ node: p }) => p.project_id),
    },
  ]);

const casesTableModel = [
  createSelectColumn({
    idField: 'case_id',
    headerRowSpan: 2,
  }),
  {
    name: 'Case UUID',
    id: 'case_id',
    downloadable: true,
    hidden: true,
    th: ({ sorted }) => (
      <Th key="case_id" rowSpan="2">
        Case UUID
        {sorted && <ArrowIcon sorted={sorted} />}
      </Th>
    ),
    td: ({ node }) => <Td>{node.case_id}</Td>,
  },
  {
    name: 'Case ID',
    id: 'submitter_id',
    downloadable: true,
    th: ({ sorted }) => (
      <Th key="submitter_id" rowSpan="2">
        Case ID
        {sorted && <ArrowIcon sorted={sorted} />}
      </Th>
    ),
    td: ({ index, node }) => (
      <Td>
        <CaseLink
          id={`row-${index}-case-link`}
          merge
          uuid={node.case_id}
          whitelist={['filters']}
          >
          {node.submitter_id}
        </CaseLink>
      </Td>
    ),
  },
  {
    name: 'Project',
    id: 'project.project_id',
    downloadable: true,
    sortable: true,
    th: ({ sorted }) => (
      <Th key="project_id" rowSpan="2">
        Project
        {sorted && <ArrowIcon sorted={sorted} />}
      </Th>
    ),
    td: ({ index, node }) => (
      <Td>
        <ProjectLink
          id={`row-${index}-project-link`}
          uuid={node.project.project_id}
          />
      </Td>
    ),
  },
  {
    name: 'Primary Site',
    id: 'primary_site',
    sortable: true,
    downloadable: true,
    th: ({ sorted }) => (
      <Th key="primary_site" rowSpan="2">
        Primary Site
        {sorted && <ArrowIcon sorted={sorted} />}
      </Th>
    ),
    td: ({ node }) => (
      <Td
        key="primary_site"
        style={{
          maxWidth: 130,
          overflow: 'hidden',
        }}
        >
        <OverflowTooltippedLabel>{node.primary_site}</OverflowTooltippedLabel>
      </Td>
    ),
  },
  {
    name: 'Gender',
    id: 'demographic.gender',
    sortable: true,
    downloadable: true,
    th: ({ sorted }) => (
      <Th key="demographic.gender" rowSpan="2">
        Gender
        {sorted && <ArrowIcon sorted={sorted} />}
      </Th>
    ),
    td: ({ node }) => (
      <Td key="demographic.gender">
        {_.capitalize(node.demographic.gender) || '--'}
      </Td>
    ),
  },
  {
    name: 'Files',
    id: 'summary.file_count',
    sortable: true,
    downloadable: true,
    th: ({ sorted }) => (
      <ThNum key="summary.file_count" rowSpan="2">
        Files
        {sorted && <ArrowIcon sorted={sorted} />}
      </ThNum>
    ),
    td: ({ node }) => (
      <TdNum key="summary.file_count">
        <FilesLink node={node}>
          {(node.summary.file_count || 0).toLocaleString()}
        </FilesLink>
      </TdNum>
    ),
    total: withRouter(({ hits, query }) => (
      <TdNum>
        <RepositoryCasesLink
          query={{
            filters: query.filters ? getProjectIdFilter(hits) : null,
          }}
          >
          {hits.edges
            .reduce((acc, val) => acc + val.node.summary.case_count, 0)
            .toLocaleString()}
        </RepositoryCasesLink>
      </TdNum>
    )),
  },
  ...dataCategoryColumns,
  {
    name: 'Mutation Count',
    id: 'mutation_count',
    sortable: false,
    th: ({ sorted }) => (
      <ThNum rowSpan="2">
        <Tooltip
          Component="# Simple Somatic Mutations Filtered by current criteria"
          style={tableToolTipHint()}
          >
          # Mutations
          {sorted && <ArrowIcon sorted={sorted} />}
        </Tooltip>
      </ThNum>
    ),
    td: ({
      filters, node, ssmCount, ssmCountsLoading,
    }) => (
      <Td style={{ textAlign: 'right' }}>
        <MutationsCount
          filters={replaceFilters(
            makeFilter([
              {
                field: 'cases.case_id',
                value: [node.case_id],
              },
            ]),
            filters,
          )}
          isLoading={ssmCountsLoading}
          ssmCount={ssmCount}
          />
      </Td>
    ),
  },
  {
    name: 'Gene Count',
    id: 'gene_count',
    sortable: false,
    th: ({ sorted }) => (
      <ThNum rowSpan="2">
        <Tooltip
          Component="# Genes with Simple Somatic Mutations Filtered by current criteria"
          style={tableToolTipHint()}
          >
          # Genes
        </Tooltip>
        {sorted && <ArrowIcon sorted={sorted} />}
      </ThNum>
    ),
    td: ({ filters, node }) => (
      <Td style={{ textAlign: 'right' }}>
        {node.score > 0 ? (
          <ExploreSSMLink
            filters={replaceFilters(
              makeFilter([
                {
                  field: 'cases.case_id',
                  value: [node.case_id],
                },
              ]),
              filters,
            )}
            searchTableTab="genes"
            >
            {(node.score || 0).toLocaleString()}
          </ExploreSSMLink>
        ) : (
          0
        )}
      </Td>
    ),
  },
  ...(DISPLAY_SLIDES && [
    {
      name: 'Slides',
      id: 'slides',
      sortable: false,
      downloadable: false,
      hidden: false,
      th: ({ sorted }) => (
        <Th rowSpan="2">
          Slides
          {sorted && <ArrowIcon sorted={sorted} />}
        </Th>
      ),
      td: ({ node }) => {
        const slideCount = slideCountFromCaseSummary(node.summary);
        return (
          <Td style={{ textAlign: 'center' }}>
            {[
              <ForTsvExport key={`tsv-export-${node.case_id}`}>
                {slideCount}
              </ForTsvExport>,
              slideCount ? (
                <Tooltip
                  Component="View Slide Image"
                  key={`view-image-${node.case_id}`}
                  >
                  <ImageViewerLink
                    isIcon
                    query={{
                      filters: makeFilter([
                        {
                          field: 'cases.case_id',
                          value: node.case_id,
                        },
                      ]),
                    }}
                    >
                    <MicroscopeIcon style={{ maxWidth: '20px' }} />
                    {` (${slideCount})`}
                  </ImageViewerLink>
                </Tooltip>
              ) : (
                <Tooltip
                  Component="No slide images to view."
                  key="no-slide-images"
                  >
                  --
                </Tooltip>
              ),
            ]}
          </Td>
        );
      },
    },
  ]),
  {
    name: 'Program',
    id: 'project.program.name',
    sortable: false,
    downloadable: true,
    hidden: true,
    th: ({ sorted }) => (
      <Th rowSpan="2">
        Program
        {sorted && <ArrowIcon sorted={sorted} />}
      </Th>
    ),
    td: ({ node }) => <Td>{node.project.program.name}</Td>,
  },
  {
    name: 'Disease Type',
    id: 'disease_type',
    sortable: false,
    downloadable: true,
    hidden: true,
    th: ({ sorted }) => (
      <Th rowSpan="2">
        Disease Type
        {sorted && <ArrowIcon sorted={sorted} />}
      </Th>
    ),
    td: ({ node }) => <Td>{node.disease_type}</Td>,
  },
  {
    name: 'Age at diagnosis',
    id: 'diagnoses.age_at_diagnosis',
    sortable: false,
    downloadable: true,
    hidden: true,
    th: ({ sorted }) => (
      <Th rowSpan="2">
        Age at diagnosis
        {sorted && <ArrowIcon sorted={sorted} />}
      </Th>
    ),
    td: ({ node }) => {
      // Use diagnosis with minimum age
      const age = node.diagnoses.hits.edges
        .map(x => x.node)
        .reduce(
          (p, c) => (c.age_at_diagnosis < p ? c.age_at_diagnosis : p),
          Infinity,
        );
      return (
        <Td>{age !== Infinity && node.diagnoses ? ageDisplay(age) : '--'}</Td>
      );
    },
  },
  {
    name: 'Days to death',
    id: 'demographic.days_to_death',
    sortable: false,
    downloadable: true,
    hidden: true,
    th: ({ sorted }) => (
      <Th rowSpan="2">
        Days to death
        {sorted && <ArrowIcon sorted={sorted} />}
      </Th>
    ),
    td: ({ node }) => {
      return (
        <Td>
          {(node.demographic && ageDisplay(node.demographic.days_to_death)) ||
            '--'}
        </Td>
      );
    },
  },
  {
    name: 'Vital Status',
    id: 'demographic.vital_status',
    sortable: false,
    downloadable: true,
    hidden: true,
    th: ({ sorted }) => (
      <Th rowSpan="2">
        Vital Status
        {sorted && <ArrowIcon sorted={sorted} />}
      </Th>
    ),
    td: ({ node }) => {
      return <Td>{node.demographic && node.demographic.vital_status}</Td>;
    },
  },
  {
    name: 'Primary Diagnosis',
    id: 'diagnoses.primary_diagnosis',
    sortable: false,
    downloadable: true,
    hidden: true,
    th: ({ sorted }) => (
      <Th rowSpan="2">
        Primary Diagnosis
        {sorted && <ArrowIcon sorted={sorted} />}
      </Th>
    ),
    td: ({ node }) => {
      const primaryDiagnosis = node.diagnoses.hits.edges
        .map(x => x.node)
        .reduce(youngestDiagnosis, { age_at_diagnosis: Infinity });
      return (
        <Td>
          {(node.diagnoses && primaryDiagnosis.primary_diagnosis) || '--'}
        </Td>
      );
    },
  },
  {
    name: 'Ethnicity',
    id: 'demographic.ethnicity',
    sortable: false,
    downloadable: true,
    hidden: true,
    th: ({ sorted }) => (
      <Th rowSpan="2">
        Ethnicity
        {sorted && <ArrowIcon sorted={sorted} />}
      </Th>
    ),
    td: ({ node }) => (
      <Td>{(node.demographic && node.demographic.ethnicity) || '--'}</Td>
    ),
  },
  {
    name: 'Race',
    id: 'demographic.race',
    sortable: false,
    downloadable: true,
    hidden: true,
    th: ({ sorted }) => (
      <Th rowSpan="2">
        Race
        {sorted && <ArrowIcon sorted={sorted} />}
      </Th>
    ),
    td: ({ node }) => (
      <Td>{(node.demographic && node.demographic.race) || '--'}</Td>
    ),
  },
];

export default casesTableModel;
