// @flow

import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import ShoppingCartIcon from '@ncigdc/theme/icons/ShoppingCart';
import { uniq, omit } from 'lodash';
import moment from 'moment';

import { withTheme } from '@ncigdc/theme';
import SearchIcon from 'react-icons/lib/fa/search';
import { Row, Column } from '@ncigdc/uikit/Flex';
import formatFileSize from '@ncigdc/utils/formatFileSize';
import EntityPageVerticalTable from '@ncigdc/components/EntityPageVerticalTable';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import BAMSlicingButton from '@ncigdc/components/BAMSlicingButton';
import AnnotationLink from '@ncigdc/components/Links/AnnotationLink';
import AnnotationsLink from '@ncigdc/components/Links/AnnotationsLink';
import ProjectLink from '@ncigdc/components/Links/ProjectLink';
import CaseLink from '@ncigdc/components/Links/CaseLink';
import FileLink from '@ncigdc/components/Links/FileLink';
import Link from '@ncigdc/components/Links/Link';
import Hidden from '@ncigdc/components/Hidden';
import { toggleFilesInCart } from '@ncigdc/dux/cart';
import Button from '@ncigdc/uikit/Button';
import AddToCartButtonSingle from '@ncigdc/components/AddToCartButtonSingle';
import DownloadFile from '@ncigdc/components/DownloadFile';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { RepositoryFilesLink } from '@ncigdc/components/Links/RepositoryLink';

import { makeFilter } from '@ncigdc/utils/filters';
import LocalPaginationTable from '@ncigdc/components/LocalPaginationTable';
import withRouter from '@ncigdc/utils/withRouter';

const paginationPrefix = 'assocTable';

// value of data_category mapped to sections to display
const DISPLAY_MAPPING = {
  'Raw Sequencing Data': ['analysis', 'readGroup', 'downstreamAnalysis'],
  'Transcriptome Profiling': ['analysis', 'downstreamAnalysis'],
  'Simple Nucleotide Variation': ['analysis', 'downstreamAnalysis'],
  'Copy Number Variation': ['analysis', 'downstreamAnalysis'],
  'Structural Rearrangement': ['analysis', 'downstreamAnalysis'],
  'DNA Methylation': ['analysis', 'downstreamAnalysis'],
};

const styles = {
  tableDownloadAction: {
    ...visualizingButton,
    padding: '3px 5px',
    minWidth: 'initial',
    minHeight: 'initial',
    height: 'initial',
  },
};

function displaySection(section: string, dataCategory: string): boolean {
  return (DISPLAY_MAPPING[dataCategory] || []).includes(section);
}

let searchInput;

const fileInCart = (files, file) => files.some(f => f.file_id === file.file_id);

const getAnnotationsCount = (annotations, entity) => {
  const filteredAnnotations = annotations.hits.edges.filter(
    ({ node: a }) => a.entity_id === entity.entity_id,
  );

  if (filteredAnnotations.length === 1) {
    return (
      <AnnotationLink uuid={filteredAnnotations[0].node.annotation_id}>
        {filteredAnnotations.length}
      </AnnotationLink>
    );
  } else if (filteredAnnotations.length > 1) {
    return (
      <AnnotationsLink
        query={{
          filters: makeFilter([
            { field: 'annotations.entity_id', value: entity.entity_id },
          ]),
        }}
      >
        {filteredAnnotations.length}
      </AnnotationsLink>
    );
  }

  return filteredAnnotations.length.toLocaleString();
};

const File = ({
  node,
  theme,
  setState,
  dispatch,
  files,
  query,
  push,
}: {
  node: Object,
  theme: Object,
  setState: Function,
  dispatch: Function,
  files: Array<Object>,
  query: {},
  push: Function,
}) => {
  const searchTerm = query[`${paginationPrefix}_search`];
  const associatedEntities = node.associated_entities.hits.edges;
  const filteredAE = (searchTerm
    ? associatedEntities.filter(({ node: ae }) =>
        Object.keys(ae).map(k => ae[k].includes(searchTerm)).includes(true),
      )
    : associatedEntities).map(({ node: ae }) => ({
    ...ae,
    case_id: <CaseLink uuid={ae.case_id}>{ae.case_id}</CaseLink>,
    entity_submitter_id: (
      <CaseLink
        uuid={ae.case_id}
        query={ae.entity_type !== 'case' ? { bioId: ae.entity_id } : {}}
        deepLink={ae.entity_type !== 'case' ? 'biospecimen' : undefined}
      >
        {ae.entity_submitter_id}
      </CaseLink>
    ),
    annotation_count: getAnnotationsCount(node.annotations, ae),
  }));

  const archiveComponent = node.archive.archive_id
    ? <Link>
        {node.archive.submitter_id || '--'} - {node.archive.revision}
        (todo: link out to file search pg with files.archive.archive_id filter)
      </Link>
    : '--';

  const projectIds = uniq(
    (node.cases.hits.edges || [])
      .map(({ node: { project: { project_id: pId } } }) => pId),
  );

  const sourceFilesRepoLink = node.analysis.input_files.hits.total
    ? <RepositoryFilesLink
        query={{
          filters: makeFilter([
            {
              field: 'files.downstream_analyses.output_files.file_id',
              value: node.file_id,
            },
          ]),
        }}
      >
        {node.analysis.input_files.hits.total}
      </RepositoryFilesLink>
    : <span>0</span>;
  return (
    <Column className="test-file">
      <Row
        style={{ justifyContent: 'flex-end', padding: '1rem 0' }}
        spacing="0.2rem"
      >
        <Button
          className="test-toggle-cart"
          onClick={() => dispatch(toggleFilesInCart(node))}
          leftIcon={<ShoppingCartIcon />}
        >
          {fileInCart(files, node) ? 'Remove from Cart' : 'Add to Cart'}
        </Button>
        {node.data_type === 'Aligned Reads' &&
          node.data_format === 'BAM' &&
          node.index_files.hits.total &&
          <BAMSlicingButton file={node} />}
        <DownloadFile
          file={node}
          activeText={'Processing'}
          inactiveText={'Download'}
        />
      </Row>
      <Row style={{ alignItems: 'flex-start' }}>
        <EntityPageVerticalTable
          className="test-file-properties"
          title="File Properties"
          style={{ width: '58%', marginRight: '2rem' }}
          thToTd={[
            {
              th: 'Name',
              td: node.file_name,
              style: { whiteSpace: 'pre-wrap', wordBreak: 'break-all' },
            },
            { th: 'Access', td: node.access },
            { th: 'UUID', td: node.file_id },
            { th: 'Case ID', td: node.submitter_id || '--' },
            { th: 'Data Format', td: node.data_format },
            { th: 'Size', td: formatFileSize(node.file_size) },
            { th: 'MD5 Checksum', td: node.md5sum },
            { th: 'Archive', td: archiveComponent },
            {
              th: 'Project',
              td: projectIds.map(
                pId =>
                  pId && <ProjectLink key={pId} uuid={pId}>{pId}</ProjectLink>,
              ),
            },
          ]}
        />
        <EntityPageVerticalTable
          className="test-data-information"
          title="Data Information"
          style={{ width: '42%' }}
          thToTd={[
            { th: 'Data Category', td: node.data_category },
            { th: 'Data Type', td: node.data_type },
            { th: 'Experimental Strategy', td: node.experimental_strategy },
            { th: 'Platform', td: node.platform || '--' },
          ]}
        />
      </Row>
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
            { key: 'case_id', title: 'Case UUID' },
            { key: 'annotation_count', title: 'Annotations' },
          ]}
        />
      </LocalPaginationTable>

      {displaySection('analysis', node.data_category) &&
        <Row style={{ paddingTop: '2rem', alignItems: 'flex-start' }}>
          <EntityPageVerticalTable
            className="test-analysis"
            title="Analysis"
            style={{ marginRight: '2rem', width: '50%' }}
            thToTd={[
              { th: 'Analysis ID', td: node.analysis.analysis_id },
              { th: 'Workflow Type', td: node.analysis.workflow_type },
              {
                th: 'Workflow Completion Date',
                td:
                  node.analysis.updated_datetime &&
                    moment(node.analysis.updated_datetime).format('YYYY-MM-DD'),
              },
              {
                th: 'Source Files',
                td: node.analysis.input_files.hits.total === 1
                  ? <FileLink
                      uuid={
                        node.analysis.input_files.hits.edges[0].node.file_id
                      }
                    >
                      1
                    </FileLink>
                  : sourceFilesRepoLink,
              },
            ]}
          />
          <EntityPageVerticalTable
            className="test-reference-genome"
            title="Reference Genome"
            style={{ width: '50%' }}
            thToTd={[
              { th: 'Genome Build', td: 'GRCh38.p0' },
              { th: 'Genome Name', td: 'GRCh38.d1.vd1' },
            ]}
          />
        </Row>}
      {node.analysis.metadata &&
        displaySection('readGroup', node.data_category) &&
        <Row style={{ paddingTop: '2rem' }}>
          <Column style={{ flexGrow: 1 }}>
            <EntityPageHorizontalTable
              className="test-read-groups"
              title="Read Groups"
              emptyMessage="No read group files found."
              headings={[
                { key: 'read_group_id', title: 'Read Group ID' },
                { key: 'is_paired_end', title: 'Is Paired End' },
                { key: 'read_length', title: 'Read Length' },
                { key: 'library_name', title: 'Library Name' },
                { key: 'sequencing_center', title: 'Sequencing Center' },
                { key: 'sequencing_date', title: 'Sequencing Date' },
              ]}
              data={node.analysis.metadata.read_groups.hits.edges.map(
                readGroup => readGroup.node,
              )}
            />
          </Column>
        </Row>}
      {!!node.metadata_files.hits.edges.length &&
        <Row style={{ paddingTop: '2rem' }}>
          <Column style={{ flexGrow: 1 }}>
            <EntityPageHorizontalTable
              className="test-metadata-files"
              title="Metadata Files"
              emptyMessage="No metadata files found."
              headings={[
                {
                  key: 'file_name',
                  title: 'File Name',
                  style: {
                    maxWidth: '150px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  },
                  tooltip: true,
                },
                { key: 'data_category', title: 'Data Category' },
                { key: 'data_type', title: 'Data Type' },
                { key: 'data_format', title: 'Data Format' },
                { key: 'file_size', title: 'File Size' },
                { key: 'action', title: 'Action' },
              ]}
              data={node.metadata_files.hits.edges.map(md => ({
                ...md,
                action: (
                  <Row>
                    <AddToCartButtonSingle
                      file={{ ...md, cases: node.cases }}
                      style={{ padding: '3px 5px' }}
                    />
                    <DownloadFile
                      file={{ ...md, cases: node.cases }}
                      style={styles.tableDownloadAction}
                    />
                  </Row>
                ),
              }))}
            />
          </Column>
        </Row>}
      {displaySection('downstreamAnalysis', node.data_category) &&
        <Row style={{ paddingTop: '2rem' }}>
          <Column style={{ flexGrow: 1 }}>
            <EntityPageHorizontalTable
              className="test-downstream-analyses"
              title="Downstream Analyses Files"
              emptyMessage="No Downstream Analysis files found."
              headings={[
                {
                  key: 'file_name',
                  title: 'File Name',
                  style: { whiteSpace: 'pre-wrap', wordBreak: 'break-all' },
                },
                { key: 'data_category', title: 'Data Category' },
                { key: 'data_type', title: 'Data Type' },
                { key: 'data_format', title: 'Data Format' },
                { key: 'workflow_type', title: 'Analysis workflow' },
                {
                  key: 'file_size',
                  title: 'File Size',
                  style: { textAlign: 'right' },
                },
                { key: 'action', title: 'Action' },
              ]}
              data={node.downstream_analyses.hits.edges.reduce(
                (acc, { node: { output_files, workflow_type } }) => [
                  ...acc,
                  ...output_files.hits.edges.map(({ node: file }) => ({
                    ...file,
                    file_size: formatFileSize(file.file_size),
                    file_name: (
                      <FileLink uuid={file.file_id}>{file.file_name}</FileLink>
                    ),
                    workflow_type,
                    action: (
                      <Row>
                        <AddToCartButtonSingle
                          file={{
                            ...file,
                            projects: [
                              //output file has no project, get parent project
                              node.cases.hits.edges[0].node.project.project_id,
                            ],
                            acl: node.acl,
                          }}
                          style={{ padding: '3px 5px' }}
                        />
                        <DownloadFile
                          file={{
                            ...file,
                            projects: [
                              //output file has no project, get parent project
                              node.cases.hits.edges[0].node.project.project_id,
                            ],
                            acl: node.acl,
                          }}
                          style={styles.tableDownloadAction}
                        />
                      </Row>
                    ),
                  })),
                ],
                [],
              )}
            />
          </Column>
        </Row>}
    </Column>
  );
};

export default compose(
  withRouter,
  withTheme,
  connect(state => ({ ...state.cart })),
)(File);
