import React from 'react';
import { compose, withPropsOnChange } from 'recompose';

import {
  removeClinicalAnalysisVariable,
  updateClinicalAnalysisVariable,
} from '@ncigdc/dux/analysis';
import {
  get,
  groupBy,
  map,
  max,
  min,
} from 'lodash';
import { scaleOrdinal, schemeCategory10 } from 'd3';
import { addInFilters } from '@ncigdc/utils/filters';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import {
  humanify,
} from '@ncigdc/utils/string';
import { MINIMUM_CASES } from '@ncigdc/utils/survivalplot';

import {
  CloseIcon,
  SurvivalIcon,
  BarChartIcon,
  BoxPlot,
} from '@ncigdc/theme/icons';

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

export const styles = {
  actionMenuItem: {
    cursor: 'pointer',
    lineHeight: '1.5',
  },
  actionMenuItemDisabled: theme => ({
    ':hover': {
      backgroundColor: 'transparent',
      color: theme.greyScale5,
      cursor: 'not-allowed',
    },
    color: theme.greyScale5,
    cursor: 'not-allowed',
  }),
  activeButton: theme => ({
    ...styles.common(theme),
    backgroundColor: theme.primary,
    border: `1px solid ${theme.primary}`,
    color: '#fff',
  }),
  chartIcon: {
    height: '14px',
    width: '14px',
  },
  common: theme => ({
    ':hover': {
      backgroundColor: 'rgb(0,138,224)',
      border: '1px solid rgb(0,138,224)',
      color: '#fff',
    },
    backgroundColor: 'transparent',
    border: `1px solid ${theme.greyScale4}`,
    color: theme.greyScale2,
    justifyContent: 'flex-start',
  }),
  histogram: theme => ({
    axis: {
      fontSize: '1.1rem',
      fontWeight: '500',
      stroke: theme.greyScale4,
      textFill: theme.greyScale3,
    },
  }),
};

export const vizButtons = {
  box: {
    action: updateClinicalAnalysisVariable,
    icon: <BoxPlot style={styles.chartIcon} />,
    title: 'Box/QQ Plot',
  },
  delete: {
    action: removeClinicalAnalysisVariable,
    icon: <CloseIcon style={styles.chartIcon} />,
    title: 'Remove Card',
  },
  histogram: {
    action: updateClinicalAnalysisVariable,
    icon: <BarChartIcon style={styles.chartIcon} />,
    title: 'Histogram',
  },
  survival: {
    action: updateClinicalAnalysisVariable,
    icon: <SurvivalIcon style={styles.chartIcon} />,
    title: 'Survival Plot',
  },
};

export const parseContinuousValue = continuousValue =>
  Number(Number(continuousValue).toFixed(2));

export const parseContinuousKey = keyValue =>
  keyValue.split('-')
    .map((val, idx, src) => (src[idx - 1] === '' ? `-${val}` : val))
    .filter(val => val !== '')
    .map(val => parseContinuousValue(val));

export const createContinuousGroupName = keyValue =>
  parseContinuousKey(keyValue).join(' to \u003c');

export const filterSurvivalData = data => data
  .filter(x => x.chart_doc_count >= MINIMUM_CASES)
  .filter(x => x.key !== '_missing');

export const getBinData = (bins, dataBuckets) => ({
  binData: map(groupBy(bins, bin => bin.groupName), (values, key) => ({
    doc_count: values.reduce((acc, value) => acc + value.doc_count, 0),
    key,
    keyArray: values.reduce((acc, value) => acc.concat(value.key), []),
  })).filter(bin => bin.key),
  binsOrganizedByKey: dataBuckets.reduce((acc, bucket) => Object.assign(
    {},
    acc,
    {
      [bucket.key]: Object.assign(
        {},
        bucket,
        {
          groupName: bucket.groupName !== undefined &&
            bucket.groupName !== ''
            ? bucket.groupName
            : bucket.key,
        }
      ),
    }
  ), {}),
});

export default compose(
  withPropsOnChange(
    (props, nextProps) => props.id !== nextProps.id,
    ({
      dispatch,
      fieldName,
      id,
    }) => ({
      dispatchUpdateClinicalVariable: ({ value, variableKey }) => {
        dispatch(
          updateClinicalAnalysisVariable({
            fieldName,
            id,
            value,
            variableKey,
          })
        );
      },
    }),
  ),
);
