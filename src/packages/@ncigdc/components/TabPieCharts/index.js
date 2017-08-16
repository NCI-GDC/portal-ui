/* @flow */
import React from 'react';
import styled from '@ncigdc/theme/styled';
import {
  mergeQuery,
  makeFilter,
  inCurrentFilters,
} from '@ncigdc/utils/filters';
import PieChart from '@ncigdc/components/Charts/PieChart';
import { Row, Column } from '@ncigdc/uikit/Flex';
import { stringifyJSONParam, removeEmptyKeys } from '@ncigdc/utils/uri';

const toPieData = (clickHandler, docTypeSingular) => bucket => ({
  id: bucket.key,
  doc_count: bucket.doc_count,
  clickHandler,
  tooltip: (
    <span>
      <b>{bucket.key}</b><br />
      {bucket.doc_count.toLocaleString()}
      {' '}
      {docTypeSingular}
      {bucket.doc_count > 1 ? 's' : ''}
    </span>
  ),
});

export const ColumnCenter = styled(Column, {
  justifyContent: 'center',
  alignItems: 'center',
});

export const WrappedRow = styled(Row, {
  alignItems: 'center',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
});

export const RowCenter = styled(Row, {
  justifyContent: 'space-around',
  alignItems: 'center',
  flexWrap: 'wrap',
});

export const ShowToggleBox = styled.div({
  border: ({ theme }) => `1px solid ${theme.greyScale4}`,
  padding: '0.5rem 1rem',
  backgroundColor: ({ theme }) => theme.white,
  cursor: 'pointer',
  color: ({ theme }) => theme.primary,
});

export const BottomBorderedBox = styled(Row, {
  borderBottom: ({ theme }) => `1px solid ${theme.greyScale4}`,
  paddingBottom: '1.5rem',
  justifyContent: 'center',
});

export const PieTitle = styled.h4({
  color: ({ theme }) => theme.primary || 'inherit',
});

function addFilter(query: Object, push: Function): Function {
  return (field, values) => {
    const newQuery = mergeQuery(
      {
        filters: makeFilter([
          { field, value: Array.isArray(values) ? values : [values] },
        ]),
      },
      query,
      'toggle',
    );

    push({
      query: removeEmptyKeys({
        ...newQuery,
        filters: newQuery.filters && stringifyJSONParam(newQuery.filters),
      }),
    });
  };
}

export const SelfFilteringPie = ({
  docTypeSingular,
  buckets,
  query,
  push,
  fieldName,
  currentFieldNames,
  currentFilters,
  ...props
}) =>
  <PieChart
    data={(buckets || [])
      .filter(bucket => bucket.key !== '_missing')
      .filter(
        bucket =>
          currentFieldNames.includes(fieldName)
            ? inCurrentFilters({
                key: bucket.key,
                dotField: fieldName,
                currentFilters,
              })
            : true,
      )
      .map(
        toPieData(
          ({ data }) => addFilter(query, push)(fieldName, data.id),
          docTypeSingular,
        ),
      )}
    {...props}
  />;
