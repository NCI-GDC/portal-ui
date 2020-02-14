// @flow

import React from 'react';
import { uniq } from 'lodash';
import { Th, Td, TdNum, ThNum } from '@ncigdc/uikit/Table';
import CaseLink from '@ncigdc/components/Links/CaseLink';
import ProjectLink from '@ncigdc/components/Links/ProjectLink';
import { RepositoryCasesLink } from '@ncigdc/components/Links/RepositoryLink';
import FileLink from '@ncigdc/components/Links/FileLink';
import ArrowIcon from '@ncigdc/theme/icons/ArrowIcon';
import { makeFilter } from '@ncigdc/utils/filters';
import FileSize from '@ncigdc/components/FileSize';

const filesTableModel = [
  {
    name: 'File UUID',
    id: 'file_id',
    th: ({ sorted }) => (
      <Th>
        File UUID
        {sorted && <ArrowIcon sorted={sorted} />}
      </Th>
    ),
    td: ({ node }) => (
      <Td>
        <FileLink
          uuid={node.file_id}
          style={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}
        >
          {node.file_id}
        </FileLink>
      </Td>
    ),
    sortable: true,
    downloadable: true,
    hidden: true,
  },
  {
    name: 'Access',
    id: 'access',
    sortable: true,
    downloadable: true,
    th: ({ sorted }) => (
      <Th>
        Access
        {sorted && <ArrowIcon sorted={sorted} />}
      </Th>
    ),
    td: ({ node }) => (
      <Td>
        {node.access === 'open' && <i className="fa fa-unlock-alt" />}
        {node.access === 'controlled' && <i className="fa fa-lock" />}
        <span
          style={{
            marginLeft: '0.3rem',
          }}
        >
          {node.access}
        </span>
      </Td>
    ),
  },
  {
    name: 'File Name',
    id: 'file_name',
    sortable: true,
    downloadable: true,
    th: ({ sorted }) => (
      <Th>
        File Name
        {sorted && <ArrowIcon sorted={sorted} />}
      </Th>
    ),
    td: ({ node }) => (
      <Td>
        <FileLink
          uuid={node.file_id}
          style={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}
        >
          {node.file_name}
        </FileLink>
      </Td>
    ),
  },
  {
    name: 'Cases',
    id: 'cases.case_id',
    th: ({ sorted }) => (
      <ThNum>
        Cases
        {sorted && <ArrowIcon sorted={sorted} />}
      </ThNum>
    ),
    td: ({
      node: { cases: { hits: { total = 0, edges: cases } }, file_id: fileId },
    }) => (
      <TdNum>
        {total > 1 && (
          <RepositoryCasesLink
            query={{
              filters: makeFilter(
                [{ field: 'files.file_id', value: [fileId] }],
                false,
              ),
            }}
          >
            {total.toLocaleString()}
          </RepositoryCasesLink>
        )}
        {total === 1 && (
          <CaseLink uuid={cases[0].node.case_id}>{total}</CaseLink>
        )}

        {total === 0 && 0}
      </TdNum>
    ),
    downloadable: true,
  },
  {
    name: 'Project',
    id: 'cases.project.project_id',
    th: ({ sorted }) => (
      <Th>
        Project
        {sorted && <ArrowIcon sorted={sorted} />}
      </Th>
    ),
    td: ({ node }) => (
      <Td>
        {uniq(
          node.cases.hits.edges.map(e => e.node.project.project_id),
        ).map(pId => (
          <ProjectLink key={pId} uuid={pId}>
            {pId}
          </ProjectLink>
        ))}
      </Td>
    ),
    sortable: true,
    downloadable: true,
  },
  {
    name: 'Data Category',
    id: 'data_category',
    th: ({ sorted }) => (
      <Th>
        Data Category
        {sorted && <ArrowIcon sorted={sorted} />}
      </Th>
    ),
    td: ({ node }) => <Td>{node.data_category || '--'}</Td>,
    sortable: true,
    downloadable: true,
  },
  {
    name: 'Data Format',
    id: 'data_format',
    th: ({ sorted }) => (
      <Th>
        Data Format
        {sorted && <ArrowIcon sorted={sorted} />}
      </Th>
    ),
    td: ({ node }) => <Td>{node.data_format || '--'}</Td>,
    sortable: true,
    downloadable: true,
  },
  {
    name: 'Size',
    id: 'file_size',
    th: ({ sorted }) => (
      <ThNum>
        File Size
        {sorted && <ArrowIcon sorted={sorted} />}
      </ThNum>
    ),
    td: ({ node }) => (
      <TdNum>
        <FileSize bytes={node.file_size} />
      </TdNum>
    ),
    sortable: true,
    downloadable: true,
  },
  {
    name: 'Annotations',
    id: 'annotations.annotation_id',
    th: ({ sorted }) => (
      <ThNum>
        Annotations
        {sorted && <ArrowIcon sorted={sorted} />}
      </ThNum>
    ),
    td: ({ node }) => (
      <TdNum>
        {
          // leaving link off until we have a proper way to filter the annotation page by file
          node.annotations.hits.total
        }
      </TdNum>
    ),
    downloadable: true,
  },
  {
    name: 'Data Type',
    id: 'data_type',
    th: ({ sorted }) => (
      <Th>
        Data Type
        {sorted && <ArrowIcon sorted={sorted} />}
      </Th>
    ),
    td: ({ node }) => <Td>{node.data_type || '--'}</Td>,
    sortable: false,
    downloadable: true,
    hidden: true,
  },
  {
    name: 'Experimental Strategy',
    id: 'experimental_strategy',
    th: ({ sorted }) => (
      <Th>
        Experimental Strategy
        {sorted && <ArrowIcon sorted={sorted} />}
      </Th>
    ),
    td: ({ node }) => <Td>{node.experimental_strategy || '--'}</Td>,
    sortable: false,
    downloadable: true,
    hidden: true,
  },
  {
    name: 'Platform',
    id: 'platform',
    th: ({ sorted }) => (
      <Th>
        Platform
        {sorted && <ArrowIcon sorted={sorted} />}
      </Th>
    ),
    td: ({ node }) => <Td>{node.platform || '--'}</Td>,
    sortable: false,
    downloadable: true,
    hidden: true,
  },
];

export default filesTableModel;
