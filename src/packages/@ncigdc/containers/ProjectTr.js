/* @flow */

import React from 'react';

import {
  RepositoryCasesLink,
  RepositoryFilesLink,
} from '@ncigdc/components/Links/RepositoryLink';
import ProjectLink from '@ncigdc/components/Links/ProjectLink';
import { findDataCategory } from '@ncigdc/utils/data';
import { makeFilter } from '@ncigdc/utils/filters';
import { DATA_CATEGORIES } from '@ncigdc/utils/constants';

import type { TCategory } from '@ncigdc/utils/data/types';

import { Tr, Td, TdNum } from '@ncigdc/uikit/Table';
import CollapsibleList from '@ncigdc/uikit/CollapsibleList';

import { withTheme } from '@ncigdc/theme';

export type TProps = {|
  index: number,
  node: {|
    disease_type: string,
    name: string,
    primary_site: string,
    program: {|
      name: string,
    |},
    project_id: string,
    summary: {|
      case_count: number,
      data_categories: Array<{|
        case_count?: number,
        data_category: TCategory,
      |}>,
      file_count: number,
    |},
  |},
  theme: Object,
|};

export const ProjectTrComponent = ({ node, index, theme }: TProps) => {
  const caseCount = node.summary.case_count;
  const fileCount = node.summary.file_count;

  type TLinkProps = { fields?: Array<Object>, children?: mixed };
  type TLink = (props: TLinkProps) => any;

  const CasesLink: TLink = ({ fields = [], children }) =>
    <RepositoryCasesLink
      query={{
        filters: makeFilter([
          { field: 'cases.project.project_id', value: [node.project_id] },
          ...fields,
        ]),
      }}
    >
      {children}
    </RepositoryCasesLink>;

  return (
    <Tr
      style={{
        backgroundColor: index % 2 === 0 ? theme.tableStripe : '#fff',
      }}
    >
      <Td>
        <ProjectLink uuid={node.project_id} />
      </Td>
      <Td style={{ whiteSpace: 'normal' }}>
        <CollapsibleList data={node.disease_type} />
      </Td>
      <Td>
        <CollapsibleList data={node.primary_site} />
      </Td>
      <Td>{node.program.name}</Td>
      <TdNum>
        {caseCount > 0
          ? <CasesLink>{caseCount.toLocaleString()}</CasesLink>
          : 0}
      </TdNum>
      {Object.values(DATA_CATEGORIES).map(category => {
        const count =
          findDataCategory(category.abbr, node.summary.data_categories)
            .case_count || 0;

        return (
          <TdNum key={category.abbr}>
            {count > 0
              ? <CasesLink
                  fields={[
                    { field: 'files.data_category', value: category.full },
                  ]}
                >
                  {count.toLocaleString()}
                </CasesLink>
              : 0}
          </TdNum>
        );
      })}
      <TdNum>
        {fileCount > 0
          ? <RepositoryFilesLink
              query={{
                filters: makeFilter([
                  {
                    field: 'cases.project.project_id',
                    value: node.project_id,
                  },
                ]),
              }}
            >
              {fileCount.toLocaleString()}
            </RepositoryFilesLink>
          : 0}
      </TdNum>
    </Tr>
  );
};

export default withTheme(ProjectTrComponent);
