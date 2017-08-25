// @flow
import React from 'react';
import _ from 'lodash';
import {
  RepositoryCasesLink,
  RepositoryFilesLink,
} from '@ncigdc/components/Links/RepositoryLink';
import AddCaseFilesToCartButton from '@ncigdc/components/AddCaseFilesToCartButton';
import ProjectLink from '@ncigdc/components/Links/ProjectLink';
import CaseLink from '@ncigdc/components/Links/CaseLink';
import { AnnotationCountLink } from '@ncigdc/components/Links/AnnotationCountLink';
import { Th, Td } from '@ncigdc/uikit/Table';
import { makeFilter } from '@ncigdc/utils/filters';
import ageDisplay from '@ncigdc/utils/ageDisplay';
import withRouter from '@ncigdc/utils/withRouter';
import styled from '@ncigdc/theme/styled';
import {
  createDataCategoryColumns,
  createSelectColumn,
} from '@ncigdc/tableModels/utils';

const youngestDiagnosis = (
  p: { age_at_diagnosis: number },
  c: { age_at_diagnosis: number },
): { age_at_diagnosis: number } =>
  c.age_at_diagnosis < p.age_at_diagnosis ? c : p;

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

const NumTh = styled(Th, { textAlign: 'right' });
const NumTd = styled(Td, { textAlign: 'right' });

const FilesLink = ({ node, fields = [], children }) =>
  children === '0'
    ? <span>0</span>
    : <RepositoryFilesLink
        query={{
          filters: makeFilter([
            { field: 'cases.case_id', value: [node.case_id] },
            ...fields,
          ]),
        }}
      >
        {children}
      </RepositoryFilesLink>;

const getProjectIdFilter = projects =>
  makeFilter([
    {
      field: 'cases.project.project_id',
      value: projects.edges.map(({ node: p }) => p.project_id),
    },
  ]);

const casesTableModel = [
  createSelectColumn({ idField: 'case_id', headerRowSpan: 2 }),
  {
    name: 'Cart',
    id: 'cart',
    th: () => <Th key="cart" rowSpan="2">Cart</Th>,
    td: ({ node, relay, total, index }) =>
      <Td>
        <AddCaseFilesToCartButton
          caseId={node.case_id}
          hasFiles={
            _.sum(
              node.summary.data_categories.map(
                dataCategory => dataCategory.file_count,
              ),
            ) > 0
          }
          fileCount={node.summary.file_count}
          dropdownStyle={
            total - 1 === index ? { top: 'auto', bottom: '100%' } : {}
          }
        />
      </Td>,
  },
  {
    name: 'Case UUID',
    id: 'case_id',
    hidden: true,
    downloadable: true,
    th: () => <Th key="case_id" rowSpan="2">Case UUID</Th>,
    td: ({ node }) =>
      <Td>
        {node.case_id}
      </Td>,
  },
  {
    name: 'Case ID',
    id: 'submitter_id',
    downloadable: true,
    th: () => <Th key="submitter_id" rowSpan="2">Case ID</Th>,
    td: ({ node, index }) =>
      <Td>
        <CaseLink
          uuid={node.case_id}
          id={`row-${index}-case-link`}
          merge
          whitelist={['filters']}
        >
          {node.submitter_id}
        </CaseLink>
      </Td>,
  },
  {
    name: 'Project',
    id: 'project.project_id',
    downloadable: true,
    sortable: true,
    th: () => <Th key="project_id" rowSpan="2">Project</Th>,
    td: ({ node, index }) =>
      <Td>
        <ProjectLink
          uuid={node.project.project_id}
          id={`row-${index}-project-link`}
        />
      </Td>,
  },
  {
    name: 'Primary Site',
    id: 'primary_site',
    sortable: true,
    downloadable: true,
    th: () => <Th key="primary_site" rowSpan="2">Primary Site</Th>,
    td: ({ node }) => <Td key="primary_site">{node.primary_site}</Td>,
  },
  {
    name: 'Gender',
    id: 'demographic.gender',
    sortable: true,
    downloadable: true,
    th: () => <Th key="demographic.gender" rowSpan="2">Gender</Th>,
    td: ({ node }) =>
      <Td key="demographic.gender">
        {_.capitalize(node.demographic.gender) || '--'}
      </Td>,
  },
  {
    name: 'Files',
    id: 'summary.file_count',
    sortable: true,
    downloadable: true,
    th: () => <NumTh key="summary.file_count" rowSpan="2">Files</NumTh>,
    td: ({ node }) =>
      <NumTd key="summary.file_count">
        <FilesLink node={node}>
          {node.summary.file_count.toLocaleString()}
        </FilesLink>
      </NumTd>,
    total: withRouter(({ hits, query }) =>
      <NumTd>
        <RepositoryCasesLink
          query={{
            filters: query.filters ? getProjectIdFilter(hits) : null,
          }}
        >
          {hits.edges
            .reduce((acc, val) => acc + val.node.summary.case_count, 0)
            .toLocaleString()}
        </RepositoryCasesLink>
      </NumTd>,
    ),
  },
  ...dataCategoryColumns,
  {
    name: 'Annotations',
    id: 'score',
    sortable: true,
    th: () => <NumTh key="score" rowSpan="2">Annotations</NumTh>,
    td: ({ node }) =>
      <NumTd key="score">
        <AnnotationCountLink
          hits={node.annotations.hits}
          filters={makeFilter([
            { field: 'annotations.case_id', value: node.case_id },
          ])}
        />
      </NumTd>,
  },
  {
    name: 'Program',
    id: 'project.program.name',
    sortable: false,
    downloadable: true,
    hidden: true,
    th: () => <Th rowSpan="2">Program</Th>,
    td: ({ node }) =>
      <Td>
        {node.project.program.name}
      </Td>,
  },
  {
    name: 'Disease Type',
    id: 'disease_type',
    sortable: false,
    downloadable: true,
    hidden: true,
    th: () => <Th rowSpan="2">Disease Type</Th>,
    td: ({ node }) =>
      <Td>
        {node.disease_type}
      </Td>,
  },
  {
    name: 'Age at diagnosis',
    id: 'diagnoses.age_at_diagnosis',
    sortable: false,
    downloadable: true,
    hidden: true,
    th: () => <Th rowSpan="2">Age at diagnosis</Th>,
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
    id: 'diagnoses.days_to_death',
    sortable: false,
    downloadable: true,
    hidden: true,
    th: () => <Th rowSpan="2">Days to death</Th>,
    td: ({ node }) => {
      const primaryDiagnosis = node.diagnoses.hits.edges
        .map(x => x.node)
        .reduce(youngestDiagnosis, { age_at_diagnosis: Infinity });
      return (
        <Td>
          {(node.diagnoses && ageDisplay(primaryDiagnosis.days_to_death)) ||
            '--'}
        </Td>
      );
    },
  },
  {
    name: 'Vital Status',
    id: 'diagnoses.vital_status',
    sortable: false,
    downloadable: true,
    hidden: true,
    th: () => <Th rowSpan="2">Vital Status</Th>,
    td: ({ node }) => {
      const primaryDiagnosis = node.diagnoses.hits.edges
        .map(x => x.node)
        .reduce(youngestDiagnosis, { age_at_diagnosis: Infinity });
      return <Td>{primaryDiagnosis.vital_status}</Td>;
    },
  },
  {
    name: 'Primary Diagnosis',
    id: 'diagnoses.primary_diagnosis',
    sortable: false,
    downloadable: true,
    hidden: true,
    th: () => <Th rowSpan="2">Primary Diagnosis</Th>,
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
    th: () => <Th rowSpan="2">Ethnicity</Th>,
    td: ({ node }) =>
      <Td>{(node.demographic && node.demographic.ethnicity) || '--'}</Td>,
  },
  {
    name: 'Race',
    id: 'demographic.race',
    sortable: false,
    downloadable: true,
    hidden: true,
    th: () => <Th rowSpan="2">Race</Th>,
    td: ({ node }) =>
      <Td>
        {(node.demographic && node.demographic.race) || '--'}
      </Td>,
  },
];

export default casesTableModel;
