/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { uniq } from 'lodash';

import { toggleFilesInCart } from '@ncigdc/dux/cart';

import FileLink from '@ncigdc/components/Links/FileLink';
import CaseLink from '@ncigdc/components/Links/CaseLink';
import { RepositoryCasesLink } from '@ncigdc/components/Links/RepositoryLink';
import FileSize from '@ncigdc/components/FileSize';
import AddToCartButtonSingle from '@ncigdc/components/AddToCartButtonSingle';

import { Tr, Td, TdNum } from '@ncigdc/uikit/Table';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import Button from '@ncigdc/uikit/Button';

import { withTheme } from '@ncigdc/theme';
import styled from '@ncigdc/theme/styled';
import { makeFilter } from '@ncigdc/utils/filters';
import ProjectLink from '@ncigdc/components/Links/ProjectLink';

type TNode = {
  access: string,
  cases: {
    hits: {
      total: number,
      edges: Array<{
        node: {
          case_id: string,
          project: {
            project_id: string,
          },
        },
      }>,
    },
  },
  annotations: {
    hits: {
      total: number,
    },
  },
  data_category: string,
  data_format: string,
  file_id: string,
  file_name: string,
  file_size: number,
};

export type TProps = {
  dispatch: Function,
  canAddToCart: boolean,
  index: number,
  node: TNode,
  theme: Object,
};

const RemoveButton = styled(Button, ({
  backgroundColor: '#FFF',
  borderColor: '#CCC',
  color: '#333',
  margin: '0 auto',
  padding: '0px 5px',
  ':hover': {
    background: 'linear-gradient(to bottom, #ffffff 50%, #e6e6e6 100%) repeat scroll 0 0 #E6E6E6',
    borderColor: '#ADADAD',
  },
}));

function getCaseLink({ cases: { hits: { total = 0, edges: cases } }, file_id: fileId }: TNode): any {
  if (total > 1) {
    return (
      <RepositoryCasesLink query={{ filters: makeFilter([{ field: 'files.file_id', value: [fileId] }], false) }} >
        {total.toLocaleString()}
      </RepositoryCasesLink>
    );
  } else if (total === 1) {
    return <CaseLink uuid={cases[0].node.case_id}>{total}</CaseLink>;
  }

  return total.toLocaleString();
}

export const FileTrComponent = ({ node, index, theme, canAddToCart = true, dispatch }: TProps) => (
  <Tr
    style={{
      backgroundColor: index % 2 === 0 ? theme.tableStripe : '#fff',
    }}
  >
    <Td>
      { canAddToCart &&
        <AddToCartButtonSingle file={node} />
      }
      { !canAddToCart &&
        <RemoveButton
          onClick={() => dispatch(toggleFilesInCart(node))}
          aria-label='Remove'
        >
          <Tooltip
            Component={'Remove'}
          >
            <i className='fa fa-trash-o' />
          </Tooltip>
        </RemoveButton>
      }
    </Td>
    <Td>
      {node.access === 'open' &&
        <i className='fa fa-unlock-alt' />
      }
      {node.access === 'controlled' &&
        <i className='fa fa-lock' />
      }
      <span
        style={{
          marginLeft: '0.3rem',
        }}
      >
        {node.access}
      </span>
    </Td>
    <Td>
      <FileLink uuid={node.file_id} style={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>
        {node.file_name}
      </FileLink>
    </Td>
    <TdNum>{getCaseLink(node)}</TdNum>
    <Td>
      {
        uniq(node.cases.hits.edges.map(e => e.node.project.project_id))
          .map(pId => <ProjectLink key={pId} uuid={pId}>{pId}</ProjectLink>)
      }
    </Td>
    <Td>{node.data_category}</Td>
    <Td>{node.data_format}</Td>
    <TdNum><FileSize bytes={node.file_size} /></TdNum>
    <TdNum>{node.annotations.hits.total}</TdNum>
  </Tr>
);

export default compose(connect(), withTheme)(FileTrComponent);
