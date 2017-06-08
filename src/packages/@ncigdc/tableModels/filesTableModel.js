// @flow

import React from 'react';
import { uniq } from 'lodash';
import { Th, Td, TdNum } from '@ncigdc/uikit/Table';
import CaseLink from '@ncigdc/components/Links/CaseLink';
import ProjectLink from '@ncigdc/components/Links/ProjectLink';
import { RepositoryCasesLink } from '@ncigdc/components/Links/RepositoryLink';
import FileLink from '@ncigdc/components/Links/FileLink';
import { makeFilter } from '@ncigdc/utils/filters';
import FileSize from '@ncigdc/components/FileSize';

const filesTableModel = [
  {
    name: 'File UUID',
    id: 'file_id',
    th: () => <Th>File UUID</Th>,
    td: ({ node }) =>
      <Td>
        <FileLink
          uuid={node.file_id}
          style={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}
        >
          {node.file_id}
        </FileLink>
      </Td>,
    sortable: true,
    hidden: true,
  },
  {
    name: 'File Submitter ID',
    id: 'submitter_id',
    sortable: true,
    hidden: true,
    th: () => <Th>File Submitter ID</Th>,
    td: ({ node }) =>
      <Td style={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>
        {node.submitter_id || '--'}
      </Td>,
  },
  {
    name: 'Access',
    id: 'access',
    sortable: true,
    th: () => <Th>Access</Th>,
    td: ({ node }) =>
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
      </Td>,
  },
  {
    name: 'File Name',
    id: 'file_name',
    sortable: true,
    th: () => <Th>File Name</Th>,
    td: ({ node }) =>
      <Td>
        <FileLink
          uuid={node.file_id}
          style={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}
        >
          {node.file_name}
        </FileLink>
      </Td>,
  },
  {
    name: 'Cases',
    id: 'cases.case_id',
    th: () => <Th>Cases</Th>,
    td: ({
      node: { cases: { hits: { total = 0, edges: cases } }, file_id: fileId },
    }) =>
      <TdNum>
        {total > 1 &&
          <RepositoryCasesLink
            query={{
              filters: makeFilter(
                [{ field: 'files.file_id', value: [fileId] }],
                false,
              ),
            }}
          >
            {total.toLocaleString()}
          </RepositoryCasesLink>}
        {total === 1 &&
          <CaseLink uuid={cases[0].node.case_id}>{total}</CaseLink>}

        {total === 0 && 0}
      </TdNum>,
  },
  {
    name: 'Project',
    id: 'cases.project.project_id',
    th: () => <Th>Project</Th>,
    td: ({ node }) =>
      <Td>
        {uniq(
          node.cases.hits.edges.map(e => e.node.project.project_id),
        ).map(pId => <ProjectLink key={pId} uuid={pId}>{pId}</ProjectLink>)}
      </Td>,
    sortable: true,
  },
  {
    name: 'Data Category',
    id: 'data_category',
    sortable: true,
    th: () => <Th>Data Category</Th>,
    td: ({ node }) => <Td>{node.data_category || '--'}</Td>,
  },
  {
    name: 'Data Format',
    id: 'data_format',
    sortable: true,
    th: () => <Th>Data Format</Th>,
    td: ({ node }) => <Td>{node.data_format || '--'}</Td>,
  },
  {
    name: 'Size',
    id: 'file_size',
    sortable: true,
    th: () => <Th>File Size</Th>,
    td: ({ node }) => <Td><FileSize bytes={node.file_size} /></Td>,
  },
  {
    name: 'Annotations',
    id: 'annotations.annotation_id',
    th: () => <Th>Annotations</Th>,
    td: ({ node }) =>
      <TdNum>
        {
          // leaving link off until we have a proper way to filter the annotation page by file
          node.annotations.hits.total
        }
      </TdNum>,
  },
  {
    name: 'Data Type',
    id: 'data_type',
    sortable: false,
    hidden: true,
    th: () => <Th>Data Type</Th>,
    td: ({ node }) => <Td>{node.data_type || '--'}</Td>,
  },
  {
    name: 'Experimental Strategy',
    id: 'experimental_strategy',
    th: () => <Th>Experimental Strategy</Th>,
    td: ({ node }) =>
      <Td>
        {node.experimental_strategy || '--'}
      </Td>,
    sortable: false,
    hidden: true,
  },
  {
    name: 'Platform',
    id: 'platform',
    th: () => <Th>Platform</Th>,
    td: ({ node }) => <Td>{node.platform || '--'}</Td>,
    sortable: false,
    hidden: true,
  },
];

export default filesTableModel;
