import React from 'react';
import {
  compose,
  setDisplayName,
  withPropsOnChange,
  withProps,
  withState,
} from 'recompose';
import {
  sortBy,
  isArray,
  isPlainObject,
  isNumber,
  isEqual,
} from 'lodash';

import { addInFilters } from '@ncigdc/utils/filters';
import { fetchApi } from '@ncigdc/utils/ajax';
import Spinner from '@ncigdc/uikit/Loaders/Material';
import { qnorm } from './qqUtils';
import QQPlot from './QQPlot';

const QQPlotQueryWrapper = ({
  chartHeight,
  clinicalType,
  data,
  fieldName,
  isLoading,
  queryField,
  ...props
}) => (isLoading
  ? (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        height: 250,
        justifyContent: 'center',
      }}
      >
      <Spinner />
    </div>
    )
  : (
    <QQPlot
      clinicalType={clinicalType}
      data={data}
      exportCoordinates
      height={chartHeight}
      queryField={queryField}
      {...props}
      fieldName={fieldName}
      styles={{
        margin: {
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
        },
      }}
      />
  ));

export default compose(
  setDisplayName('EnhancedQQPlotQueryWrapper'),
  withState('data', 'setData', null),
  withState('isLoading', 'setIsLoading', true),
  withProps({
    updateData: async ({
      dataHandler,
      fieldName,
      filters,
      first,
      setData,
      setDataHandler,
      setIsLoading,
    }) => {
      setIsLoading(true);
      setDataHandler(false);

      const missingFilter = {
        content: [
          {
            content: {
              field: `cases.${fieldName}`,
              value: ['MISSING'],
            },
            op: 'NOT',
          },
        ],
        op: 'and',
      };
      const newFilters = addInFilters(filters, missingFilter);
      const res = await fetchApi('case_ssms', {
        body: {
          fields: fieldName,
          filters: JSON.stringify(newFilters),
          size: first,
        },
        headers: { 'Content-Type': 'application/json' },
      });

      const [ // The order of these is on purpose.
        clinicalType,
        clinicalField,
        clinicalNestedField,
      ] = fieldName.split('.');
      const data = res && res.data ? res.data.hits : [];
      const continuousValues = data.reduce((values, hit) => values.concat(
        isArray(hit[clinicalType])
          ? hit[clinicalType].reduce((acc, subType) => acc.concat(clinicalNestedField
              ? subType[clinicalField].map(sub => ({
                id: hit.id,
                value: sub[clinicalNestedField],
              }))
              : ({
                id: hit.id,
                value: subType[clinicalField],
              })), [])
          : ({
            id: hit.id,
            value: isPlainObject(hit[clinicalType])
              ? hit[clinicalType][clinicalField]
              : hit[clinicalType],
          })
      ), []);

      const parsedData = sortBy(
        continuousValues.filter(b => isNumber(b.value)),
        'value',
      ).map((item, i, arr) => ({
        id: item.id,
        x: qnorm((i + 1 - 0.5) / arr.length),
        y: item.value,
      }));

      setData(parsedData, () => setIsLoading(false));
      dataHandler(parsedData.map(d => ({
        id: d.id,
        'Sample Quantile': d.y,
        'Theoretical Normal Quantile': d.x,
      })), () => setDataHandler(true));
    },
  }),
  withPropsOnChange(
    (props, nextProps) => !isEqual(
      props.dataBuckets,
      nextProps.dataBuckets
    ),
    ({ updateData, ...props }) => updateData(props)
  ),
)(QQPlotQueryWrapper);
