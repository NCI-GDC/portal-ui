import React from 'react';
import {
  compose, withPropsOnChange, withProps, withState, // branch, renderComponent,
} from 'recompose';
import _ from 'lodash';

import { addInFilters } from '@ncigdc/utils/filters';
import Loader from '@ncigdc/uikit/Loaders/Loader';
import { fetchApi } from '@ncigdc/utils/ajax';
import QQPlot from './QQPlot';

export default compose(
  withState('data', 'setData', null),
  withState('isLoading', 'setIsLoading', true),
  withPropsOnChange(['filters', 'fieldName'], ({ fieldName, filters, first }) => {
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
    return {
      newFilters: addInFilters(filters, missingFilter),
      first,
    };
  }),
  withProps({
    updateData: async ({
      newFilters,
      first,
      setData,
      setIsLoading,
      fieldName,
    }) => {
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
      const { clinicalType, clinicalField, clinicalNestedField } = parsedFieldName(fieldName);


      const continuousValues = [];

      data.forEach(hit => {
        if (_.isArray(hit[clinicalType])) {
          return hit[clinicalType].map(subType => {
            if (clinicalNestedField) {
              return subType[clinicalField].map(sub => {
                return continuousValues.push(sub[clinicalNestedField]);
              });
            }
            return continuousValues.push(subType[clinicalField]);
          });
        } if (_.isPlainObject(hit[clinicalType])) {
          return continuousValues.push(hit[clinicalType][clinicalField]);
        }
        return continuousValues.push(hit[clinicalType]);
      });
      setData(continuousValues.filter(b => _.isNumber(b)), () => setIsLoading(false));
    },
  }),
  withPropsOnChange(['fieldName'], ({ updateData, ...props }) => updateData(props))
)(({
  isLoading, data, clinicalType, queryField, facetName, ...props
}) => {
  if (isLoading) {
    return <Loader />;
  }
  return (
    <QQPlot
      clinicalType={clinicalType}
      data={data}
      queryField={queryField}
      width={200}
      {...props}
      fieldName={facetName} />
  );
});
