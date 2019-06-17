import React from 'react';
import {
  compose, withPropsOnChange, withProps, withState,
} from 'recompose';
import {
  sortBy, isArray, isPlainObject, isNumber, isEqual
} from 'lodash';

import { addInFilters } from '@ncigdc/utils/filters';
import { fetchApi } from '@ncigdc/utils/ajax';
import Spinner from '@ncigdc/uikit/Loaders/Material';
import { withTheme } from '@ncigdc/theme';
import { qnorm } from './qqUtils';
import QQPlot from './QQPlot';

export default compose(
  withTheme,
  withState('data', 'setData', null),
  withState('isLoading', 'setIsLoading', true),
  withProps({
    updateData: async ({
      dataHandler,
      fieldName,
      first,
      filters,
      setData,
      setDataHandler,
      setIsLoading,
    }) => {
      setIsLoading(true);
      setDataHandler(false);
      const missingFilter = {
        op: 'and',
        content: [
          {
            op: 'NOT',
            content: {
              field: `cases.${fieldName}`,
              value: ['MISSING'],
            },
          },
        ],
      };
      const newFilters = addInFilters(filters, missingFilter)
      const res = await fetchApi('case_ssms', {
        headers: { 'Content-Type': 'application/json' },
        body: {
          filters: JSON.stringify(newFilters),
          size: first,
          fields: fieldName,
        },
      });
      const data = res && res.data ? res.data.hits : [];
      const parsedFieldName = field => {
        const parsed = field.split('.');
        return {
          clinicalType: parsed[0],
          clinicalField: parsed[1],
          clinicalNestedField: parsed[2],
        };
      };
      const { clinicalField, clinicalNestedField, clinicalType } = parsedFieldName(fieldName);

      const continuousValues = [];

      data.forEach(hit => {
        if (isArray(hit[clinicalType])) {
          return hit[clinicalType].map(subType => {
            if (clinicalNestedField) {
              return subType[clinicalField].map(sub => {
                return continuousValues.push(sub[clinicalNestedField]);
              });
            }
            return continuousValues.push(subType[clinicalField]);
          });
        }
        if (isPlainObject(hit[clinicalType])) {
          return continuousValues.push(hit[clinicalType][clinicalField]);
        }
        return continuousValues.push(hit[clinicalType]);
      });
      const sortedData = sortBy(continuousValues.filter(b => isNumber(b)));
      const parsedData = sortBy(sortedData).map((age, i) => ({
        x: qnorm((i + 1 - 0.5) / sortedData.length),
        y: age,
      }));
      setData(parsedData, () => setIsLoading(false));
      dataHandler(parsedData.map(d => ({
        'Sample Quantile': d.y,
        'Theoretical Quantile': d.x,
      })), () => setDataHandler(true));
    },
  }),
  withPropsOnChange((props, nextProps) => !isEqual(props.dataBuckets, nextProps.dataBuckets), ({ updateData, ...props }) => updateData(props)),
)(({
  chartHeight,
  clinicalType,
  data,
  fieldName,
  isLoading,
  queryField,
  theme,
  ...props
}) => {
  if (isLoading) {
    return (
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
    );
  }

  return (
    <QQPlot
        clinicalType={clinicalType}
        data={data}
        exportCoordinates
        height={chartHeight}
        queryField={queryField}
        {...props}
        fieldName={fieldName}
        qqPointStyles={{ color: theme.secondary }}
        styles={{
          margin: {
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
          },
        }}
        />
  );
});
