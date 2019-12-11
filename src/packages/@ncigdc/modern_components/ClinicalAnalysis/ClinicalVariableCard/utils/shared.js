import React from 'react';
import { scaleOrdinal, schemeCategory10 } from 'd3';
import { get, groupBy, map } from 'lodash';

import { MIN_SURVIVAL_CASES } from '@ncigdc/utils/survivalplot';
import {
  createFacetFieldString,
  humanify,
} from '@ncigdc/utils/string';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';

import { makeContinuousSetFilters } from './continuous';
import makeCategoricalSetFilters from './categorical';

export const colors = scaleOrdinal(schemeCategory10);
export const colorsArray = [
  'rgb(31, 119, 180)',
  'rgb(255, 127, 14)',
  'rgb(44, 160, 44)',
  'rgb(214, 39, 40)',
  'rgb(148, 103, 189)',
];

export const CHART_HEIGHT = 250;

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

export const makeHeadings = (chartType, dataDimension, fieldName) =>
  (chartType === 'box'
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
      key: 'doc_count_link',
      style: { textAlign: 'right' },
      thStyle: {
        position: 'sticky',
        textAlign: 'right',
        top: 0,
      },
      title: '# Cases',
    },
    ...chartType === 'survival' &&
    [
      {
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
      },
    ],
  ]);

export const getCardFilters = (variablePlotTypes, selectedBuckets, fieldName, filters) => (
  get(selectedBuckets, 'length', 0)
    ? variablePlotTypes === 'continuous'
      ? makeContinuousSetFilters(selectedBuckets, fieldName, filters)
      : makeCategoricalSetFilters(selectedBuckets, fieldName, filters)
    : filters);

export const makeCountLink = ({ doc_count, filters, totalDocs }) => (
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

export const filterSurvivalData = data => data
  .filter(x => x.doc_count >= MIN_SURVIVAL_CASES)
  .filter(x => x.key !== '_missing');

export const makeBinData = (bins, dataBuckets) => ({
  binData: map(groupBy(bins, bin => bin.groupName), (values, key) => ({
    doc_count: values.reduce((acc, value) => acc + value.doc_count, 0),
    key,
    keyArray: values.reduce((acc, value) => acc.concat(value.key), []),
  })).filter(bin => bin.key),
  binsOrganizedByKey: dataBuckets.reduce((acc, bucket) => ({

    ...acc,
    [bucket.key]: {

      ...bucket,
      groupName: typeof bucket.groupName === 'string' &&
            bucket.groupName !== ''
            ? bucket.groupName
            : bucket.key,
    },
  }), {}),
});

export const getRawQueryData = (data, fieldName) => get(data,
  `explore.cases.aggregations.${createFacetFieldString(fieldName)}`, data);

export const DEFAULT_BIN_TYPE = 'default';
export const DEFAULT_DATA = {
  bins: [],
  max: '',
  min: '',
  quarter: '',
};
export const DEFAULT_INTERVAL = {
  amount: '',
  max: '',
  min: '',
};
export const DEFAULT_RANGES = [];

export const cardDefaults = {
  continuous: {
    continuousBinType: DEFAULT_BIN_TYPE,
    customInterval: DEFAULT_INTERVAL,
    customRanges: DEFAULT_RANGES,
  },
  survival: {
    customSurvivalPlots: [],
    isSurvivalCustom: false,
    showOverallSurvival: false,
  },
};
