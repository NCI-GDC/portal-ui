// @flow
import React from 'react';
import _ from 'lodash';
import Tooltip from '@ncigdc/uikit/Tooltip/Tooltip';
import { tableToolTipHint } from '@ncigdc/theme/mixins';
import { DATA_CATEGORIES } from '@ncigdc/utils/constants';
import { Th, Td, ThNum, TdNum } from '@ncigdc/uikit/Table';
import { makeFilter } from '@ncigdc/utils/filters';
import { findDataCategory } from '@ncigdc/utils/data';

export const createDataCategoryColumns = ({
  title,
  countKey,
  Link,
  getCellLinkFilters,
  getTotalLinkFilters,
}) => {
  return [
    {
      name: 'Data Categories',
      id: 'data_category',
      field: `summary.data_categories.data_category,summary.data_categories.${countKey}`,
      th: () =>
        <Th
          key="data_category"
          colSpan={Object.keys(DATA_CATEGORIES).length}
          style={{ textAlign: 'center' }}
        >
          {title}
        </Th>,
      downloadable: true,
      subHeadingIds: _.map(DATA_CATEGORIES, category => category.abbr),
    },
    ..._.map(DATA_CATEGORIES, (category, key) => ({
      name: category.abbr,
      id: category.abbr,
      subHeading: true,
      parent: 'data_category',
      th: () =>
        <ThNum>
          <abbr>
            <Tooltip Component={category.full} style={tableToolTipHint()}>
              {category.abbr}
            </Tooltip>
          </abbr>
        </ThNum>,
      td: ({ node }) => {
        const count = findDataCategory(
          category.abbr,
          node.summary.data_categories,
        )[countKey];
        return (
          <TdNum>
            {count === 0
              ? '0'
              : <Link
                  query={{
                    filters: makeFilter([
                      ...getCellLinkFilters(node),
                      { field: 'files.data_category', value: category.full },
                    ]),
                  }}
                >
                  {count.toLocaleString()}
                </Link>}
          </TdNum>
        );
      },
      total: ({ hits }) =>
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
              x =>
                findDataCategory(category.abbr, x.node.summary.data_categories)[
                  countKey
                ],
            ).toLocaleString()}
          </Link>
        </TdNum>,
    })),
  ];
};

type TCreateSelectColumn = ({
  idField: string,
  headerRowSpan?: number,
}) => {};
export const createSelectColumn: TCreateSelectColumn = ({
  idField,
  headerRowSpan,
}) => {
  return {
    name: 'Select',
    id: 'select',
    sortable: false,
    downloadable: false,
    hidden: false,
    th: ({ nodes, selectedIds, setSelectedIds }) => {
      const ids = nodes.map(node => node[idField]);
      const allSelected = ids.every(id => selectedIds.includes(id));

      return (
        <Th rowSpan={headerRowSpan}>
          <input
            type="checkbox"
            checked={allSelected}
            onChange={e => {
              setSelectedIds(
                allSelected
                  ? _.xor(selectedIds, ids)
                  : _.uniq(ids.concat(selectedIds)),
              );
            }}
          />
        </Th>
      );
    },
    td: ({ node, selectedIds, setSelectedIds }) =>
      <Td>
        <input
          type="checkbox"
          value={node[idField]}
          checked={selectedIds.includes(node[idField])}
          onChange={e => {
            setSelectedIds(_.xor(selectedIds, [node[idField]]));
          }}
        />
      </Td>,
  };
};
