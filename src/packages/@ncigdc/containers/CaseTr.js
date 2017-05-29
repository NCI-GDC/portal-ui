/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import _ from 'lodash';

import { RepositoryFilesLink } from '@ncigdc/components/Links/RepositoryLink';
import CaseLink from '@ncigdc/components/Links/CaseLink';
import AddCaseFilesToCartButton from '@ncigdc/components/AddCaseFilesToCartButton';

import { DATA_CATEGORIES } from '@ncigdc/utils/constants';
import { findDataCategory } from '@ncigdc/utils/data';
import { makeFilter } from '@ncigdc/utils/filters';

import type { TCategory } from '@ncigdc/utils/data/types';
import { Tr, Td, TdNum } from '@ncigdc/uikit/Table';
import { withTheme } from '@ncigdc/theme';
import ProjectLink from '@ncigdc/components/Links/ProjectLink';
import AnnotationsLink from '@ncigdc/components/Links/AnnotationsLink';
import { ForTsvExport } from '@ncigdc/components/DownloadTableToTsvButton';

export type TProps = {|
  index: number,
  total: number,
  relay: {},
  node: {|
    annotations: Object,
    case_id: string,
    submitter_id: string,
    demographic: {|
      gender: string,
    |},
    project: {|
      primary_site: string,
      project_id: string,
    |},
    summary: {|
      data_categories: Array<{|
        case_count?: number,
        data_category: TCategory,
      |}>,
    |},
  |},
  theme: Object,
|};

function massageRelayFiles(files: Object, projectId: string): Array<{}> {
  return _.get(files, 'hits.edges', [])
    .map(edge => edge.node)
    .map(file => ({
      ...file,
      projects: [projectId],
    }));
}

export const CaseTrComponent = ({ node, index, theme, relay, total }: TProps) => {
  type TFilesLinkProps = { fields?: Array<Object>, children?: mixed };
  type TFilesLink = (props: TFilesLinkProps) => any;
  const FilesLink: TFilesLink = ({ fields = [], children }) => (
    <RepositoryFilesLink
      query={{
        filters: makeFilter([{ field: 'cases.case_id', value: [node.case_id] }, ...fields], false),
      }}
    >
      {children}
    </RepositoryFilesLink>
  );

  return (
    <Tr
      style={{
        backgroundColor: index % 2 === 0 ? theme.tableStripe : '#fff',
      }}
    >
      <Td>
        <AddCaseFilesToCartButton
          hasFiles={_.sum(node.summary.data_categories.map(dataCategory => dataCategory.file_count)) > 0}
          files={massageRelayFiles(node.files, node.project.project_id)}
          filteredFiles={massageRelayFiles(node.filteredFiles, node.project.project_id)}
          relay={relay}
          dropdownStyle={total - 1 === index ? { top: 'auto', bottom: '100%' } : {}}
        />
      </Td>
      <Td>
        <CaseLink uuid={node.case_id} id={`row-${index}-case-link`} merge whitelist={['filters']}>
          {node.case_id.substr(0, 8)}
        </CaseLink>
        <ForTsvExport>
          {node.case_id}
        </ForTsvExport>
      </Td>
      <Td>{node.submitter_id}</Td>
      <Td><ProjectLink uuid={node.project.project_id} id={`row-${index}-project-link`} /></Td>
      <Td>{node.primary_site || '--'}</Td>
      <Td>{node.demographic.gender || '--'}</Td>
      <TdNum>{node.summary.file_count > 0 ?
        <FilesLink>{node.summary.file_count.toLocaleString()}</FilesLink> : 0}
      </TdNum>
      {
        Object.values(DATA_CATEGORIES).map(category => {
          const count = findDataCategory(category.abbr, node.summary.data_categories).file_count || 0;
          return (
            <TdNum key={category.abbr}>
              {
                count > 0 ? (
                  <FilesLink fields={[{ field: 'files.data_category', value: category.full }]}>
                    {count.toLocaleString()}
                  </FilesLink>
                ) : 0
              }
            </TdNum>
          );
        })
      }
      <TdNum>
        {node.annotations.hits.total === 0 ? node.annotations.hits.total.toLocaleString() :
        <AnnotationsLink
          query={{
            filters: makeFilter([{ field: 'annotations.case_id', value: node.case_id }], false),
          }}
        >
          {node.annotations.hits.total.toLocaleString()}
        </AnnotationsLink>
        }
      </TdNum>
    </Tr>
  );
};

export const CaseTrQuery = {
  initialVariables: {
    isFileDataRequired: false,
    isFilteredFileDataRequired: false,
    filesFilters: null,
  },
  fragments: {
    node: () => Relay.QL`
      fragment on Case {
        case_id
        primary_site
        submitter_id
        project {
          project_id
        }
        annotations {
          hits(first:0) {
            total
          }
        }
        demographic {
          gender
        }
        summary {
          data_categories {
            file_count
            data_category
          }
          file_count
        }

        files @include(if: $isFileDataRequired){
          hits(first:99) {
            edges {
              node {
                id
                file_id
                access
                file_size
              }
            }
          }
        }

        filteredFiles: files @include(if: $isFilteredFileDataRequired){
          hits(first:99, filters: $filesFilters) {
            edges {
              node {
                id
                file_id
                access
                file_size
              }
            }
          }
        }

      }
    `,
  },
};

const CaseTr = Relay.createContainer(
  withTheme(CaseTrComponent),
  CaseTrQuery
);

export default CaseTr;
