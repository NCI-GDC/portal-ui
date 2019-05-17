import React from 'react';
import {
  compose, withPropsOnChange, withProps, withState, // branch, renderComponent,
} from 'recompose';
import { sortBy, isArray, isPlainObject } from 'lodash';

import { addInFilters } from '@ncigdc/utils/filters';
// import Loader from '@ncigdc/uikit/Loaders/Loader';
import { fetchApi } from '@ncigdc/utils/ajax';
import Spinner from '@ncigdc/uikit/Loaders/Material';
import QQPlot from './QQPlot';
import { Row } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';

import { qnorm, sortAscending } from './qqUtils'
import { mapStringArrayToTsvString } from '@ncigdc/utils/toTsvString';
import saveFile from '@ncigdc/utils/filesaver';

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
      setData(continuousValues.filter(b => _.isNumber(b)), () => setIsLoading(false));
    },
  }),
  withPropsOnChange(['filters'], ({ updateData, ...props }) => updateData(props)),
)(({
  isLoading, data, clinicalType, queryField, fieldName, ...props
}) => {
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
        width: 300,
      }}
           >
        <Spinner />
      </div>
    );
  }
  const downloadData = sortBy(data).map((val, i) => ({
    theoretical_quantile: qnorm((i + 1 - 0.5) / data.length),
    sample_quantile: val,
  }))
  return (
    <Row style={{ justifyContent: 'flex-end', width: '100%', marginBottom: 10}}>
      <QQPlot
        clinicalType={clinicalType}
        data={data}
        queryField={queryField}
        width={400}
        {...props}
        fieldName={fieldName}
        plotTitle={'QQ Plot'}
        />
      <DownloadVisualizationButton
        slug={`qq-plot-${fieldName}`}
        noText
        tooltipHTML="Download TSV or JSON data"
        data={downloadData}
        tsvData={downloadData}
      />
      </Row>
  );
});
