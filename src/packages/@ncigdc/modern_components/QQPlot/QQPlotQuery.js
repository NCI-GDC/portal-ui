import React from 'react';
import {
  compose, withPropsOnChange, withProps, withState, // branch, renderComponent,
} from 'recompose';

import { addInFilters } from '@ncigdc/utils/filters';
import customQuery from '@ncigdc/modern_components/QQPlot/customQuery';
import Loader from '@ncigdc/uikit/Loaders/Loader';
import QQPlot from './QQPlot';

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
  withPropsOnChange(['filters', 'fieldName'], ({ filters, fieldName, first }) => {
    const parsedFieldName = field => {
      const parsed = field.split('.');
      return {
        clinicalType: parsed[0],
        queryField: parsed[1],
      };
    };

    const { clinicalType, queryField } = parsedFieldName(fieldName);
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

    const facetName = fieldName.replace(/\./g, '__');

    return {
      // query: `query QQPlotQuery(\n $filters_1: FiltersArgument \n) {\n viewer {\n explore {\n cases {\n hits(first: ${first}, filters: $filters_1) {\n total \n edges {\n node {\n ${clinicalType} {\n hits(first: 99) {\n edges {\n node {\n ${queryField}\n }\n }\n }\n }\n }\n }\n }\n }\n }\n }\n }`,
      query: `query QQPlotQuery(\n $filters_1: FiltersArgument \n) {\n viewer {\n explore {\n cases {\n hits(filters: $filters_1) {\n total \n }\n aggregations(filters: $filters_1) {\n ${facetName} {\n histogram(interval:1) {\n buckets {\n key \n doc_count \n }\n }\n }\n }\n }\n }\n }\n }`,
      variables: {
        // filters_1: filters
        filters_1: addInFilters(filters, missingFilter),
      },
      clinicalType,
      queryField,
      facetName,
    };
  }),
  withProps({
    updateData: async ({
      variables,
      setData,
      setIsLoading,
      query,
      queryName = 'QQPlot',
    }) => {
      const res = await customQuery({
        query,
        variables,
        queryName,
      });
      setData(res && res.data.viewer, () => setIsLoading(false));
    },
  }),
  withPropsOnChange(['filters'], ({ updateData, ...props }) => updateData(props))
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
