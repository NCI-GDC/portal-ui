import {
  get,
  map,
  max,
  min,
  sortBy,
} from 'lodash';

import { addInFilters } from '@ncigdc/utils/filters';
import { createFacetFieldString } from '@ncigdc/utils/string';
import { updateClinicalAnalysisVariable } from '@ncigdc/dux/analysis';
import { DAYS_IN_YEAR } from '@ncigdc/utils/ageDisplay';

import { dataDimensions, getRawQueryData, makeCountLink } from './shared';

export const QQ_PLOT_RATIO = '70%';
export const BOX_PLOT_RATIO = '30%';

export const FIELDS_WITHOUT_BOX_OR_QQ = [
  'demographic.year_of_birth',
  'demographic.year_of_death',
  'diagnoses.year_of_diagnosis',
  'exposures.tobacco_smoking_onset_year',
  'exposures.tobacco_smoking_quit_year',
];

const boxTableAllowedStats = [
  'min',
  'max',
  'mean',
  'median',
  'sd',
  'iqr',
];

const boxTableRenamedStats = {
  Max: 'Maximum',
  Min: 'Minimum',
  SD: 'Standard Deviation',
};

export const makeContinuousSetFilters = (selectedBuckets, fieldName, filters) => {
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

const parseContinuousValue = continuousValue =>
  Number(Number(continuousValue).toFixed(2));

export const parseContinuousKey = keyValue =>
  keyValue.split('-')
    .map((val, idx, src) => (parseContinuousValue(src[idx - 1] === ''
      ? `-${val}`
      : val)));

export const makeContinuousDefaultLabel = keyValue =>
  parseContinuousKey(keyValue).join(' to \u003c');

export const makeBoxTableData = (data = {}) =>
  sortBy(Object.keys(data), datum =>
    boxTableAllowedStats.indexOf(datum.toLowerCase()))
    .reduce(
      (acc, curr) => (
    boxTableAllowedStats.includes(curr.toLowerCase())
      ? acc.concat({
        count: parseContinuousValue(data[curr]),
        stat: boxTableRenamedStats[curr] || curr, // Shows the descriptive label
      })
      : acc
      ), [],
    );

export const makeContinuousBins = ({
  binData = [],
  continuousBinType,
  fieldName,
  setId,
  totalDocs,
}) => binData.reduce((acc, {
  color, doc_count, groupName = '', key, keyArray = [],
}) => {
  const keyValues = parseContinuousKey(key);
    // continuous survival doesn't have keyArray, it has filters
  const keyArrayValues = keyArray.length > 0
      ? parseContinuousKey(keyArray[0])
      : keyValues;

  const groupNameFormatted = groupName !== '' &&
      continuousBinType === 'range'
      ? groupName
      : keyValues.length === 2 &&
          isFinite(keyValues[0]) &&
          isFinite(keyValues[1])
            ? makeContinuousDefaultLabel(key)
            : key;

  const [keyMin, keyMax] = keyArrayValues;
  const filters = {
    content: [
      {
        content: {
          field: 'cases.case_id',
          value: `set_id:${setId}`,
        },
        op: 'in',
      },
      {
        content: {
          field: fieldName,
          value: [keyMin],
        },
        op: '>=',
      },
      {
        content: {
          field: fieldName,
          value: [keyMax],
        },
        op: '<',
      },
    ],
    op: 'and',
  };

  return acc.concat(
    {
      doc_count,
      color,
      displayName: groupNameFormatted,
      doc_count_link: makeCountLink({
        doc_count,
        filters,
        totalDocs,
      }),
      filters,
      groupName: groupNameFormatted,
      key: `${keyMin}-${keyMax}`,
      rangeValues: {
        max: keyMax,
        min: keyMin,
      },
    },
  );
}, []);

export const makeDefaultDataOnLoad = ({ explore, fieldName }) => {
  const dataStats = typeof explore === 'undefined'
    ? {
      Max: null,
      Min: null,
    }
    : explore.cases.aggregations[
      `${createFacetFieldString(fieldName)}`].stats;

  const min = dataStats.Min;
  const max = dataStats.Max + 1; // api excludes the max value

  const defaultNumberOfBins = 5;
  const defaultBinSize = (max - min) / defaultNumberOfBins;

  const bins = Array(defaultNumberOfBins)
    .fill(1)
    .map((val, key) => {
      const from = key * defaultBinSize + min;
      const to = (key + 1) === defaultNumberOfBins // last bin
        ? max
        : (min + (key + 1) * defaultBinSize);
      const objKey = `${from}-${to}`;

      return ({
        [objKey]: {
          key: objKey,
        },
      });
    })
    .reduce((acc, curr) => ({
      ...acc,
      ...curr,
    }), {});

  return ({
    defaultData: {
      bins,
      max,
      min,
      quarter: (max - min) / 4,
    },
  });
};

export const makeContinuousProps = ({ data, fieldName }) => {
  const sanitisedId = fieldName.split('.').pop();
  const rawQueryData = getRawQueryData(data, fieldName);
  const dataDimension = dataDimensions[sanitisedId] &&
    dataDimensions[sanitisedId].unit;

  return {
    boxPlotValues: map(
      {
        ...rawQueryData.stats,
        ...rawQueryData.percentiles,
      },
      (value, stat) => {
        switch (dataDimension) {
          case 'Year': {
            return ({
              [stat]: parseContinuousValue(value / DAYS_IN_YEAR),
            });
          }
          default:
            return ({
              [stat]: value,
            });
        }
      },
    )
      .reduce((acc, item) => ({
        ...acc,
        ...item,
      }), {}),
    dataBuckets: get(rawQueryData, 'range.buckets', []),
    dataDimension,
    totalDocs: get(data, 'hits.total', 0),
    wrapperId: `${sanitisedId}-chart`,
    ...dataDimensions[sanitisedId] && {
      axisTitle: dataDimensions[sanitisedId].axisTitle,
      boxPlotValues: map(
        {
          ...rawQueryData.stats,
          ...rawQueryData.percentiles,
        },
        (value, stat) => {
          switch (dataDimension) {
            case 'Years': {
              // TODO ugly hack until API provides units
              const converter = sanitisedId === 'year_of_diagnosis' ? 1 : DAYS_IN_YEAR;
              return ({
                [stat]: parseContinuousValue(value / converter),
              });
            }
            default:
              return ({
                [stat]: value,
              });
          }
        },
      )
        .reduce((acc, item) => ({
          ...acc,
          ...item,
        }), {}),
    },
  };
};

export const dispatchVariableBins = ({
  bins,
  continuousBinType,
  dataBuckets,
  dispatch,
  fieldName,
  id,
}) => {
  dispatch(updateClinicalAnalysisVariable({
    fieldName,
    id,
    variable: {
      bins: continuousBinType === 'default'
        ? dataBuckets.reduce((acc, curr, index) => ({
          ...acc,
          [dataBuckets[index].key]: {
            ...dataBuckets[index],
            groupName: dataBuckets[index].key,
          },
        }), {})
        : Object.keys(bins)
          .reduce((acc, curr, index) => ({
            ...acc,
            [curr]: {
              ...bins[curr],
              doc_count: dataBuckets[index]
                ? dataBuckets[index].doc_count
                : 0,
            },
          }), {}),
    },
  }));
};
