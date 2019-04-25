import React from 'react';
import _ from 'lodash';
import Tooltip from '@ncigdc/uikit/Tooltip/Tooltip';
import Hidden from '@ncigdc/components/Hidden';
import { tableToolTipHint } from '@ncigdc/theme/mixins';
import { DATA_CATEGORIES } from '@ncigdc/utils/constants';
import {
  Th, Td, ThNum, TdNum,
} from '@ncigdc/uikit/Table';
import { makeFilter } from '@ncigdc/utils/filters';
import { findDataCategory } from '@ncigdc/utils/data';
import { IListLinkProps } from '@ncigdc/components/Links/types';
import { TCategoryAbbr, IDataCategory } from '@ncigdc/utils/data/types';

interface ICreateDataCategoryColumnsProps{
  title: string;
  countKey: string;
  Link: (props: IListLinkProps) => React.Component<IListLinkProps>;
  getCellLinkFilters: (node: INode) => IFilter[];
  getTotalLinkFilters: (hits: IHits) => IFilter[];
}

interface IFilter{
    field: string;
    value: string;
}

interface INode {
  [x:string]: any;
}

interface IHits {
  total: number;
  edges: Array<{
    node: {
      [x: string]: any;
      summary: {
        data_categories: IDataCategory[];
        case_count: number;
        file_count: number;
        file_size: number;
      };
    };
  }>;

}

interface IThProps {
  key?: string;
  context?: string;
  nodes: INode[];
  selectedIds: string[];
  setSelectedIds: (props: string[]) => void;
  [x:string]:any;
}

interface ITdProps {
  key?: string;
  context?: string;
  node: INode;
  selectedIds: string[];
  setSelectedIds: (props: string[]) => void;
  [x:string]: any;
}
export interface IColumnProps<NoTH> {
  name: string;
  id: string;
  sortable: boolean;
  downloadable: boolean;
  hidden: boolean;
  field?: string;
  subHeading?: boolean;
  subHeadingIds?: NoTH extends true? string[] : undefined;
  parent?: string;
  th: (props: IThProps) => JSX.Element;
  td: NoTH extends true? undefined : (props: ITdProps) => JSX.Element;
}
export const createDataCategoryColumns = ({
  title,
  countKey,
  Link,
  getCellLinkFilters,
  getTotalLinkFilters,
}: ICreateDataCategoryColumnsProps) => {
  return [
    {
      name: 'Data Categories',
      id: 'data_category',
      field: `summary.data_categories.data_category,summary.data_categories.${countKey}`,
      th: () => (
        <Th
          colSpan={Object.keys(DATA_CATEGORIES).length}
          key="data_category"
          style={{ textAlign: 'center' }}>
          {title}
        </Th>
      ),
      downloadable: true,
      subHeadingIds: _.map(DATA_CATEGORIES, category => category.abbr),
    },
    ..._.map(DATA_CATEGORIES, (category: { full: string; abbr: TCategoryAbbr }) => ({
      name: category.abbr,
      id: category.abbr,
      subHeading: true,
      parent: 'data_category',
      th: () => (
        <ThNum>
          <abbr>
            <Tooltip Component={category.full} style={tableToolTipHint()}>
              {category.abbr}
            </Tooltip>
          </abbr>
        </ThNum>
      ),
      td: ({ node }: { node: INode }) => {
        const count = findDataCategory(
          category.abbr,
          node.summary.data_categories
        )[countKey];
        return (
          <TdNum>
            {count === 0 ? (
              '0'
            ) : (
              <Link
                query={{
                  filters: makeFilter([
                    ...getCellLinkFilters(node),
                    {
                      field: 'files.data_category',
                      value: category.full,
                    },
                  ]),
                }}>
                {count.toLocaleString()}
              </Link>
            )}
          </TdNum>
        );
      },
      total: ({ hits }: {hits: IHits }) => (
        <TdNum>
          <Link
            query={{
              filters: makeFilter([
                ...getTotalLinkFilters(hits),
                {
                  field: 'files.data_category',
                  value: category.full,
                },
              ]),
            }}>
            {_.sumBy(
              hits.edges,
              x => findDataCategory(category.abbr, x.node.summary.data_categories)[
                countKey
              ]
            ).toLocaleString()}
          </Link>
        </TdNum>
      ),
    })),
  ];
};

export const createSelectColumn = ({
  idField,
  headerRowSpan,
}: {
  idField: string;
  headerRowSpan?: number;
}): IColumnProps<false> => {
  return {
    name: 'Select',
    id: 'select',
    sortable: false,
    downloadable: false,
    hidden: false,
    th: ({
      nodes,
      selectedIds,
      setSelectedIds,
    }: IThProps) => {
      // NOTE: "nodes" is really "edges" in the graphql schema
      // TODO: nodes structure here may look like {idField:{...}...} or { node: {idField: {...}...}...}. Make it consistent everywhere.
      const ids = nodes.map((node: INode) => node[idField] || node.node[idField]);
      const allSelected = ids.every((id: string) => selectedIds.includes(id));
      return (
        <Th rowSpan={headerRowSpan}>
          <Hidden>Select column</Hidden>
          <input
            aria-label="Select column"
            checked={allSelected}
            onChange={e => {
              setSelectedIds(
                allSelected
                  ? _.xor(selectedIds, ids)
                  : _.uniq(ids.concat(selectedIds))
              );
            }}
            type="checkbox" />
        </Th>
      );
    },
    td: ({
      node,
      selectedIds,
      setSelectedIds,
    }: ITdProps) => (
      <Td>
        <input
          aria-label={`Select ${node[idField]}`}
          checked={selectedIds.includes(node[idField])}
          onChange={e => {
            setSelectedIds(_.xor(selectedIds, [node[idField]]));
          }}
          type="checkbox"
          value={node[idField]} />
      </Td>
    ),
  };
};
