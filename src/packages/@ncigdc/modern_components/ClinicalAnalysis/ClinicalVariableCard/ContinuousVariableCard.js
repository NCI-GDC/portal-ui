import React from 'react';
import {
  compose,
  setDisplayName,
  withProps,
  withPropsOnChange,
  withState,
} from 'recompose';
import { connect } from 'react-redux';
import {
  get,
  isEmpty,
  isEqual,
  isFinite,
  map,
} from 'lodash';

import { withTheme } from '@ncigdc/theme';
import {
  humanify,
  createFacetFieldString,
} from '@ncigdc/utils/string';
import { setModal } from '@ncigdc/dux/modal';
import { DAYS_IN_YEAR } from '@ncigdc/utils/ageDisplay';
import { updateClinicalAnalysisVariable } from '@ncigdc/dux/analysis';

import ContinuousCustomBinsModal from './modals/ContinuousCustomBinsModal';
import {
  createContinuousGroupName,
  dataDimensions,
  filterSurvivalData,
  getBinData,
  getCountLink,
  getRawQueryData,
  parseContinuousKey,
  parseContinuousValue,
  DEFAULT_BIN_TYPE,
  resetVariableDefaults,
} from './helpers';
import EnhancedClinicalVariableCard from './EnhancedClinicalVariableCard';

export default compose(
  setDisplayName('EnhancedContinuousVariableCard'),
  connect((state: any) => ({ analysis: state.analysis })),
  withTheme,
  withState('qqData', 'setQQData', []),
  withState('qqDataIsSet', 'setQQDataIsSet', false),
  withProps(({
    data: { explore },
    fieldName,
  }) => {
    const dataStats = explore
      ? explore.cases.aggregations[
        `${createFacetFieldString(fieldName)}`].stats
      : {
        Max: null,
        Min: null,
      };

    const defaultMin = dataStats.Min;
    const defaultMax = dataStats.Max + 1; // api excludes the max number

    const defaultQuarter = (defaultMax - defaultMin) / 4;

    const defaultNumberOfBins = 5;
    const defaultBinSize = (defaultMax - defaultMin) /
      defaultNumberOfBins;

    const defaultBins = Array(defaultNumberOfBins).fill(1)
      .map((val, key) => {
        const from = key * defaultBinSize + defaultMin;
        const to = (key + 1) === defaultNumberOfBins
          ? defaultMax
          : (defaultMin + (key + 1) * defaultBinSize);
        const objKey = `${from}-${to}`;

        return ({
          [objKey]: {
            key: objKey,
          },
        });
      }).reduce((acc, curr) => ({
        ...acc,
        ...curr,
      }), {});

    return ({
      defaultData: {
        bins: defaultBins,
        max: defaultMax,
        min: defaultMin,
        quarter: defaultQuarter,
      },
    });
  }),
  withPropsOnChange(
    (props, nextProps) =>
      props.variable.continuousBinType !== nextProps.variable.continuousBinType,
    ({ variable: { continuousBinType } }) => ({
      binsAreCustom: continuousBinType !== DEFAULT_BIN_TYPE,
    })
  ),
  withPropsOnChange(
    (props, nextProps) => !(
      isEqual(props.defaultData, nextProps.defaultData) &&
      isEqual(props.variable.customInterval, nextProps.variable.customInterval) &&
      isEqual(props.variable.customRanges, nextProps.variable.customRanges)
    ),
    ({
      defaultData,
      dispatch,
      fieldName,
      id,
      setId,
      variable,
    }) => ({
      openCustomBinModal: () => dispatch(setModal(
        <ContinuousCustomBinsModal
          continuousBinType={variable.continuousBinType}
          customInterval={variable.customInterval}
          customRanges={variable.customRanges}
          defaultData={defaultData}
          fieldName={humanify({ term: fieldName })}
          onClose={() => dispatch(setModal(null))}
          onUpdate={(
            newBins,
            continuousBinType,
            customInterval,
            customRanges,
            continuousReset,
          ) => {
            dispatch(updateClinicalAnalysisVariable({
              fieldName,
              id,
              variable: {
                ...continuousReset
                  ? {
                    bins: defaultData.bins,
                    customBinsSetId: '',
                    ...resetVariableDefaults.continuous,
                    ...resetVariableDefaults.survival,
                  }
                  : {
                    bins: newBins,
                    continuousBinType,
                    customBinsSetId: setId,
                    ...continuousBinType === 'interval' && 
                      !isEqual(variable.customInterval, customInterval)
                      ? {
                        customInterval,
                        ...resetVariableDefaults.survival,
                      }
                      : {},
                    ...continuousBinType === 'range' &&
                      !isEqual(variable.customRanges, customRanges)
                      ? {
                        customRanges,
                        ...resetVariableDefaults.survival,
                      }
                      : {},
                  },
              },
            }));
            dispatch(setModal(null));
          }}
          />
      )),
    })
  ),
  withPropsOnChange(
    (props, nextProps) => !isEqual(props.data, nextProps.data),
    ({ data, fieldName }) => {
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
          }
        ).reduce((acc, item) => ({
          ...acc,
          ...item,
        }), {}),
        dataBuckets: get(rawQueryData, 'range.buckets', []),
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
              switch (dataDimensions[sanitisedId].unit) {
                case 'Years': {
                  return ({
                    [stat]: parseContinuousValue(value / DAYS_IN_YEAR),
                  });
                }
                default:
                  return ({
                    [stat]: value,
                  });
              }
            }
          ).reduce((acc, item) => ({
            ...acc,
            ...item,
          }), {}),
          dataDimension: dataDimensions[sanitisedId].unit,
        },
      };
    }
  ),
  withPropsOnChange(
    (props, nextProps) => !(
      isEqual(props.dataBuckets, nextProps.dataBuckets) &&
      props.setId === nextProps.setId
    ),
    ({
      dataBuckets,
      dispatch,
      fieldName,
      id,
      variable: {
        bins,
        continuousBinType,
      },
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
    }
  ),
  withProps(
    ({
      data: { explore },
      dataBuckets,
      fieldName,
      setId,
      totalDocs,
      variable: {
        bins = {},
        continuousBinType,
      },
    }) => {
      const fieldNameUnderscores = createFacetFieldString(fieldName);

      if (!(
        explore &&
        explore.cases &&
        explore.cases.aggregations &&
        explore.cases.aggregations[fieldNameUnderscores]
      )) {
        return {};
      }

      const binsForBinData = explore.cases.aggregations[fieldNameUnderscores].range.buckets
        .reduce((acc, curr) => {
          const keyTrimIntegers = parseContinuousKey(curr.key).join('-');
          const currentBin = bins[keyTrimIntegers] ||
              bins[curr.key] ||
              { groupName: '--' };
          return {

            ...acc,
            [keyTrimIntegers]: {
              doc_count: curr.doc_count,
              groupName: currentBin.groupName,
              key: keyTrimIntegers,
            },
          };
        }, {});

      const binData = getBinData(binsForBinData, dataBuckets);

      return {
        ...binData,
        getContinuousBins: (
          acc,
          {
            doc_count,
            groupName = '',
            key,
            keyArray = [],
          }
        ) => {
          const keyValues = parseContinuousKey(key);
            // survival doesn't have keyArray
          const keyArrayValues = keyArray.length > 0
              ? parseContinuousKey(keyArray[0])
              : keyValues;

          const groupNameFormatted = groupName !== '' &&
              continuousBinType === 'range'
              ? groupName
              : keyValues.length === 2 &&
                  isFinite(keyValues[0]) &&
                  isFinite(keyValues[1])
                    ? createContinuousGroupName(key)
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
              chart_doc_count: doc_count,
              displayName: groupNameFormatted,
              doc_count: getCountLink({
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
            }
          );
        },
      };
    }
  ),
  withPropsOnChange(
    (props, nextProps) => nextProps.variable.active_chart === 'survival' && !(
      isEqual(props.selectedSurvivalBins, nextProps.selectedSurvivalBins) &&
      isEqual(props.variable.bins, nextProps.variable.bins) &&
      isEqual(props.variable.customSurvivalPlots, props.variable.customSurvivalPlots) &&
      props.setId === nextProps.setId &&
      props.variable.active_chart === nextProps.variable.active_chart &&
      props.variable.isSurvivalCustom === nextProps.variable.isSurvivalCustom
    ),
    ({
      dispatch,
      fieldName,
      getContinuousBins,
      id,
      variable: {
        bins,
        continuousBinType,
        customSurvivalPlots,
        isSurvivalCustom,
      },
    }) => {
      const binsWithNames = Object.keys(bins).map(bin => ({
        ...bins[bin],
        displayName: continuousBinType === 'default'
            ? createContinuousGroupName(bins[bin].key)
            : bins[bin].groupName,
      }));

      const customBinMatches = isSurvivalCustom
          ? binsWithNames.filter(bin => customSurvivalPlots
            .indexOf(bin.displayName) >= 0)
          : [];

      const isUsingCustomSurvival = customBinMatches.length > 0;

      const survivalBins = (isUsingCustomSurvival
          ? filterSurvivalData(customBinMatches
            .reduce(getContinuousBins, []))
          : filterSurvivalData(binsWithNames
            .sort((a, b) => a.key - b.key)
            .reduce(getContinuousBins, []))
            .sort((a, b) => b.chart_doc_count - a.chart_doc_count)
      )
        .slice(0, isUsingCustomSurvival ? Infinity : 2);

      const survivalPlotValues = survivalBins.map(bin => ({
        filters: bin.filters,
        key: bin.key,
      }));
      const survivalTableValues = survivalBins
        .map(bin => bin.displayName);
      const nextCustomSurvivalPlots = customBinMatches
        .map(bin => bin.displayName);

      dispatch(updateClinicalAnalysisVariable({
        fieldName,
        id,
        variable: {
          customSurvivalPlots: nextCustomSurvivalPlots,
          isSurvivalCustom: isUsingCustomSurvival,
          showOverallSurvival: false,
        },
      }));

      return {
        survivalPlotValues,
        survivalTableValues,
      };
    }
  ),
  withPropsOnChange(
    (props, nextProps) => !isEqual(props.binData, nextProps.binData),
    ({
      binData,
      getContinuousBins,
    }) => ({
      displayData: isEmpty(binData)
        ? []
        : binData
          .sort((a, b) => a.keyArray[0] - b.keyArray[0])
          .reduce(getContinuousBins, []),
    })
  ),
  withPropsOnChange(
    (props, nextProps) => !(
      props.binsAreCustom === nextProps.binsAreCustom &&
      props.variable.id === nextProps.variable.id &&
      props.variable.isSurvivalCustom === nextProps.variable.isSurvivalCustom
    ),
    ({
      defaultData: { bins },
      dispatch,
      fieldName,
      id,
    }) => ({
      resetBins: () => {
        dispatch(updateClinicalAnalysisVariable({
          fieldName,
          id,
          variable: {
            bins,
            ...resetVariableDefaults.survival,
            ...resetVariableDefaults.continuous,
          },
        }));
      },
    })
  ),
)(EnhancedClinicalVariableCard);
