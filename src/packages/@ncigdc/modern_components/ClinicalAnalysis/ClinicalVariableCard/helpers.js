import React from 'react';
import {
  get,
  max,
  min,
} from 'lodash';
import { scaleOrdinal, schemeCategory10 } from 'd3';
import { addInFilters } from '@ncigdc/utils/filters';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import {
  humanify,
} from '@ncigdc/utils/string';

export const colors = scaleOrdinal(schemeCategory10);
export const CHART_HEIGHT = 250;
export const QQ_PLOT_RATIO = '70%';
export const BOX_PLOT_RATIO = '30%';

export const dataDimensions = {
  age_at_diagnosis: {
    axisTitle: 'Age',
    unit: 'Years',
  },
  cigarettes_per_day: {},
  circumferential_resection_margin: {},
  days_to_birth: { unit: 'Days' },
  days_to_death: { unit: 'Days' },
  days_to_hiv_diagnosis: { unit: 'Days' },
  days_to_last_follow_up: { unit: 'Days' },
  days_to_last_known_disease_status: { unit: 'Days' },
  days_to_new_event: { unit: 'Days' },
  days_to_recurrence: { unit: 'Days' },
  days_to_treatment_end: { unit: 'Days' },
  days_to_treatment_start: { unit: 'Days' },
  height: {
    axisTitle: 'Height',
    unit: 'cm',
  },
  // ldh_level_at_diagnosis
  // ldh_normal_range_upper
  lymph_nodes_positive: {},
  pack_years_smoked: {},
  tumor_largest_dimension_diameter: {
    axisTitle: 'Diameter',
    unit: 'cm',
  },
  weight: {
    axisTitle: 'Weight',
    unit: 'kg',
  },
  year_of_diagnosis: { unit: 'Years' },
  years_smoked: { unit: 'Years' },
};

// TODO the following table config warrants isolating a custom component

export const boxTableAllowedStats = [
  'min',
  'max',
  'mean',
  'median',
  'sd',
  'iqr',
];

export const boxTableRenamedStats = {
  Max: 'Maximum',
  Min: 'Minimum',
  SD: 'Standard Deviation',
};

export const getHeadings = (chartType, dataDimension, fieldName) => (chartType === 'box'
? [
  {
    key: 'stat',
    title: 'Statistics',
  },
  {
    key: 'count',
    style: { textAlign: 'right' },
    title: `${dataDimension || 'Quantities'}`,
  },
]
: [
  {
    key: 'select',
    thStyle: {
      position: 'sticky',
      top: 0,
    },
    title: 'Select',
  },
  {
    key: 'key',
    thStyle: {
      position: 'sticky',
      top: 0,
    },
    title: humanify({ term: fieldName }),
  },
  {
    key: 'doc_count',
    style: { textAlign: 'right' },
    thStyle: {
      position: 'sticky',
      textAlign: 'right',
      top: 0,
    },
    title: '# Cases',
  },
].concat(chartType === 'survival'
  ? {
    key: 'survival',
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    thStyle: {
      position: 'sticky',
      textAlign: 'right',
      top: 0,
    },
    title: 'Survival',
  }
  : []));

const getCategoricalSetFilters = (selectedBuckets, fieldName, filters) => {
  const bucketFilters = []
    .concat(selectedBuckets.filter(bucket => bucket.key !== '_missing').length > 0 && [
      {
        content: {
          field: fieldName,
          value: selectedBuckets
            .filter(bucket => bucket.key !== '_missing')
            .reduce((acc, selectedBucket) => [...acc, ...selectedBucket.keyArray], []),
        },
        op: 'in',
      },
    ])
    .concat(selectedBuckets.some(bucket => bucket.key === '_missing') && [
      {
        content: {
          field: fieldName,
          value: 'MISSING',
        },
        op: 'is',
      },
    ])
    .filter(item => item);

  return Object.assign(
    {},
    filters,
    bucketFilters.length && {
      content: filters.content
        .concat(
          bucketFilters.length > 1
            ? {
              content: bucketFilters,
              op: 'or',
            }
            : bucketFilters[0]
        ),
    }
  );
};

const getContinuousSetFilters = (selectedBuckets, fieldName, filters) => {
  const bucketRanges = selectedBuckets.map(bucket => bucket.rangeValues);

  return addInFilters(filters, {
    content: bucketRanges.length === 1 && bucketRanges[0].max === -1
      ? [
        {
          content: {
            field: fieldName,
            value: [bucketRanges[0].min],
          },
          op: '>=',
        },
      ]
      : [
        {
          content: {
            field: fieldName,
            value: [min(bucketRanges.map(range => range.min))],
          },
          op: '>=',
        },
        {
          content: {
            field: fieldName,
            value: [max(bucketRanges.map(range => range.max))],
          },
          op: '<',
        },
      ],
    op: 'and',
  });
};

export const getCardFilters = (variablePlotTypes, selectedBuckets, fieldName, filters) => (
  get(selectedBuckets, 'length', 0)
    ? variablePlotTypes === 'continuous'
      ? getContinuousSetFilters(selectedBuckets, fieldName, filters)
      : getCategoricalSetFilters(selectedBuckets, fieldName, filters)
    : filters);

export const getCountLink = ({ doc_count, filters, totalDocs }) => {
  return (
    <span>
      <ExploreLink
        query={{
          filters,
          searchTableTab: 'cases',
        }}
        >
        {(doc_count || 0).toLocaleString()}
      </ExploreLink>
      <span>{` (${(((doc_count || 0) / totalDocs) * 100).toFixed(2)}%)`}</span>
    </span>
  );
};
