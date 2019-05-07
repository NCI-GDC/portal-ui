import React from 'react';
import {
  compose, withPropsOnChange, withProps, withState, // branch, renderComponent,
} from 'recompose';

import { addInFilters } from '@ncigdc/utils/filters';
import customQuery from '@ncigdc/modern_components/QQPlot/customQuery';
import Loader from '@ncigdc/uikit/Loaders/Loader';
import QQPlot from './QQPlot';
import { fetchApi } from '@ncigdc/utils/ajax'

const myFieldName = 'diagnoses.treatments.days_to_treatment_start';

export default compose(
    // branch(
    //   ({ typeName }) => !typeName,
    //   renderComponent(() => (
    //     <div>
    //       <pre>Type name</pre> must be provided
    //     </div>
    //   ))
    // ),
  withState('data', 'setData', null),
  withState('isLoading', 'setIsLoading', true),
  withPropsOnChange(['filters', 'fieldName'], ({ fieldName, filters, first }) => {
    const fooFilters = {
      op: 'and',
      content: [
        {op: '=',
        content: {
          field: 'cases.case_id',
          value: 'set_id:AWp1PRe5MiBtcCotu6Tn'
        }
      }
    ]
  };
    const missingFilter = {
      op: 'and',
      content: [
        {
          op: 'NOT',
          content: {
            // field: `cases.${myFieldName}`,
            field: `cases.${fieldName}`,
            value: ['MISSING'],
          },
        },
      ],
    };
    return { newFilters: addInFilters(filters, missingFilter), first}

  //   const facetName = fieldName.replace(/\./g, '__');
  //
  //   return {
  //     // query: `query QQPlotQuery(\n $filters_1: FiltersArgument \n) {\n viewer {\n explore {\n cases {\n hits(first: ${first}, filters: $filters_1) {\n total \n edges {\n node {\n ${clinicalType} {\n hits(first: 99) {\n edges {\n node {\n ${queryField}\n }\n }\n }\n }\n }\n }\n }\n }\n }\n }\n }`,
  //     query: `query QQPlotQuery(\n $filters_1: FiltersArgument \n) {\n viewer {\n explore {\n cases {\n hits(filters: $filters_1) {\n total \n }\n aggregations(filters: $filters_1) {\n ${facetName} {\n histogram(interval:1) {\n buckets {\n key \n doc_count \n }\n }\n }\n }\n }\n }\n }\n }`,
  //     variables: {
  //       // filters_1: filters
  //       filters_1: addInFilters(filters, missingFilter),
  //       first
  //     },
  //     clinicalType,
  //     queryField,
  //     fieldName,
  //   };
  }),
  withProps({
    updateData: async ({
      newFilters,
      first,
      setData,
      setIsLoading,
      // query,
      // queryName = 'QQPlot',
      fieldName
    }) => {

      const res = await fetchApi(`case_ssms`, {
        headers: { 'Content-Type': 'application/json' },
        body: {
          filters: JSON.stringify(newFilters),
          size: first,
          fields: fieldName,
        },
      });
      const data = res && res.data ? res.data.hit;s : []
      // const parsedFieldName = field => {
        // return field.split('.');
          // return {
          //   clinicalType: parsed[0],
          //   queryField: parsed[1],
          // };
      // };
      // const { clinicalType, queryField } = parsedFieldName(fieldName);

      const splitName = fieldName.split('.');

      let continuousValues = []
        data.map(d => {
          return d[splitName[0]].map(firstLevel => {
            if (_.isArray(firstLevel[splitName[1]])) {
              return firstLevel[splitName[1]].map(secondLevel => {
                continuousValues.push(secondLevel[splitName[2]]);
              })
            } else {
              continuousValues.push(firstLevel[splitName[1]]);
            }
          });
        })

      console.log('values: ', continuousValues.filter(b => _.isNumber(b)))
      setData(continuousValues.filter(b => _.isNumber(b)), () => setIsLoading(false))
      // setData(res && res.data.viewer, () => setIsLoading(false));
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
