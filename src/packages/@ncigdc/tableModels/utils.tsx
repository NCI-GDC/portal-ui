import React from 'react';
import _ from 'lodash';
import Tooltip from '@ncigdc/uikit/Tooltip/Tooltip';
import Hidden from '@ncigdc/components/Hidden';
import { tableToolTipHint } from '@ncigdc/theme/mixins';
import { DATA_CATEGORIES } from '@ncigdc/utils/constants';
import { Th, Td, ThNum, TdNum } from '@ncigdc/uikit/Table';
import { makeFilter } from '@ncigdc/utils/filters';
import { findDataCategory } from '@ncigdc/utils/data';
import { IListLinkProps } from '@ncigdc/components/Links/types';
import { TCategoryAbbr, IDataCategory } from '@ncigdc/utils/data/types';
interface ICreateDataCategoryColumnsProps{
  title: string; 
  countKey: string; 
  Link: (props: IListLinkProps) => React.Component<any>; 
  getCellLinkFilters: (arg: {[x:string]: any}) => IFilter[]; 
  getTotalLinkFilters: (arg: {[x:string]: any}) => IFilter[];
}

interface IFilter{
    field: string;
    value: string;
}

interface IThProps {
  nodes: Array<IColumnProps<false>>;
  selectedIds: string[];
  setSelectedIds: (props: string[]) => void;
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
  th: (props: any) => JSX.Element;
  td: NoTH extends true? undefined : (props: any) => JSX.Element;
}
export const createDataCategoryColumns = ({
  title,
  countKey,
  Link,
  getCellLinkFilters,
  getTotalLinkFilters,
}: ICreateDataCategoryColumnsProps)=> {
  return [
    {
      name: 'Data Categories',
      id: 'data_category',
      field: `summary.data_categories.data_category,summary.data_categories.${countKey}`,
      th: () => (
        <Th
          key="data_category"
          colSpan={Object.keys(DATA_CATEGORIES).length}
          style={{ textAlign: 'center' }}
        >
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
      td: ({ node }: { node: { summary: { data_categories: IDataCategory[] }}; [x:string]: any }) => {
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
                    { field: 'files.data_category', value: category.full },
                  ]),
                }}
              >
                {count.toLocaleString()}
              </Link>
            )}
          </TdNum>
        );
      },
      total: ({ hits }: {hits: {edges: any }}) => (
        <TdNum>
          <Link
            query={{
              filters: makeFilter([
                ...getTotalLinkFilters(hits),
                { field: 'files.data_category', value: category.full },
              ]),
            }}
          >
            {_.sumBy(
              hits.edges,
              (x: any) =>
                findDataCategory(category.abbr, x.node.summary.data_categories)[
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
      const ids = nodes.map((node: any) => node[idField] || node.node[idField]);
      const allSelected = ids.every((id: string) => selectedIds.includes(id));
      return (
        <Th rowSpan={headerRowSpan}>
          <Hidden>Select column</Hidden>
          <input
            type="checkbox"
            aria-label="Select column"
            checked={allSelected}
            onChange={e => {
              setSelectedIds(
                allSelected
                  ? _.xor(selectedIds, ids)
                  : _.uniq(ids.concat(selectedIds))
              );
            }}
          />
        </Th>
      );
    },
    td: ({
      node,
      selectedIds,
      setSelectedIds,
    }: {
      node: IColumnProps<boolean>;
      selectedIds: string[];
      setSelectedIds: (props: string[]) => void;
    }) => (
      <Td>
        <input
          type="checkbox"
          aria-label={`Select ${node[idField]}`}
          value={node[idField]}
          checked={selectedIds.includes(node[idField])}
          onChange={e => {
            setSelectedIds(_.xor(selectedIds, [node[idField]]));
          }}
        />
      </Td>
    ),
  };
};
