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
  find,
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

import ContinuousCustomBinsModal from './modals/ContinuousCustomBinsModal';
import RecomposeUtils, {
  createContinuousGroupName,
  dataDimensions,
  filterSurvivalData,
  getBinData,
  getCountLink,
  getRawQueryData,
  makeDocCountInteger,
  parseContinuousKey,
  parseContinuousValue,
  DEFAULT_BIN_TYPE,
  DEFAULT_INTERVAL,
  DEFAULT_RANGES,
  DEFAULT_SAVED_SURVIVAL_BINS,
} from './helpers';
import EnhancedClinicalVariableCard from './EnhancedClinicalVariableCard';
import { MAXIMUM_CURVES } from '@ncigdc/utils/survivalplot';

export default compose(
  setDisplayName('EnhancedContinuousVariableCard'),
  connect((state: any) => ({ analysis: state.analysis })),
  withTheme,
  RecomposeUtils,
  withState('qqData', 'setQQData', []),
  withState('qqDataIsSet', 'setQQDataIsSet', false),
  withProps(({ data: { explore }, fieldName }) => {
    const dataStats = explore
      ? explore.cases.aggregations[
        `${createFacetFieldString(fieldName)}`].stats
      : {
        Max: null,
        Min: null,
      };

    const defaultMin = dataStats.Min;
    const defaultMax = dataStats.Max + 1;
    // api excludes the max number

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
      }).reduce((acc, curr) => Object.assign({}, acc, curr), {});

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
    (props, nextProps) => !isEqual(
      props.defaultData,
      nextProps.defaultData
    ) ||
      !isEqual(
        props.variable.customInterval,
        nextProps.variable.customInterval
      ) ||
      !isEqual(
        props.variable.customRanges,
        nextProps.variable.customRanges
      ),
    ({
      defaultData,
      dispatch,
      dispatchUpdateClinicalVariable,
      fieldName,
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
            dispatchUpdateClinicalVariable({
              value: continuousReset
                ? defaultData.bins
                : newBins,
              variableKey: 'bins',
            });
            dispatchUpdateClinicalVariable({
              value: continuousReset
                ? 'default'
                : continuousBinType,
              variableKey: 'continuousBinType',
            });
            !continuousReset &&
              continuousBinType === 'interval' &&
              (
                dispatchUpdateClinicalVariable({
                  value: customInterval,
                  variableKey: 'customInterval',
                })
              );
            !continuousReset &&
              continuousBinType === 'range' &&
              (
                dispatchUpdateClinicalVariable({
                  value: customRanges,
                  variableKey: 'customRanges',
                })
              );
            continuousReset &&
              (
                dispatchUpdateClinicalVariable({
                  value: [],
                  variableKey: 'customRanges',
                })
              );
            continuousReset &&
              (
                dispatchUpdateClinicalVariable({
                  value: {},
                  variableKey: 'customInterval',
                })
              );
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

      return Object.assign(
        {
          boxPlotValues: map(
            Object.assign(
              {},
              rawQueryData.stats,
              rawQueryData.percentiles,
            ),
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
          ).reduce((acc, item) => Object.assign({}, acc, item), {}),
          dataBuckets: get(rawQueryData, 'range.buckets', []),
          totalDocs: get(data, 'hits.total', 0),
          wrapperId: `${sanitisedId}-chart`,
        },
        dataDimensions[sanitisedId] && {
          axisTitle: dataDimensions[sanitisedId].axisTitle,
          boxPlotValues: map(
            Object.assign(
              {},
              rawQueryData.stats,
              rawQueryData.percentiles,
            ),
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
          ).reduce((acc, item) => Object.assign({}, acc, item), {}),
          dataDimension: dataDimensions[sanitisedId].unit,
        },
      );
    }
  ),
  withPropsOnChange(
    (props, nextProps) =>
      !isEqual(props.dataBuckets, nextProps.dataBuckets) ||
      props.setId !== nextProps.setId,
    ({
      dataBuckets,
      dispatchUpdateClinicalVariable,
      variable: { bins, continuousBinType },
    }) => {
      dispatchUpdateClinicalVariable({
        value: continuousBinType === 'default'
          ? dataBuckets.reduce((acc, curr, index) => Object.assign(
            {},
            acc,
            {
              [dataBuckets[index].key]: Object.assign(
                {},
                dataBuckets[index],
                { groupName: dataBuckets[index].key },
              ),
            },
          ), {})
          : Object.keys(bins)
            .reduce((acc, curr, index) => Object.assign(
              {},
              acc,
              {
                [curr]: Object.assign(
                  {},
                  bins[curr],
                  {
                    doc_count: dataBuckets[index]
                    ? dataBuckets[index].doc_count
                    : 0,
                  }
                ),
              }
            ), {}),
        variableKey: 'bins',
      });
    }
  ),
  withProps(
    ({
      data: { explore },
      dataBuckets,
      fieldName,
      setId,
      totalDocs,
      variable,
    }) => {
      const fieldNameUnderscores = createFacetFieldString(fieldName);

      if (!(explore &&
          explore.cases &&
          explore.cases.aggregations &&
          explore.cases.aggregations[fieldNameUnderscores])) {
        return {};
      }

      const binsForBinData = explore.cases.aggregations[fieldNameUnderscores].range.buckets
        .reduce((acc, curr) => {
          const keyTrimIntegers = parseContinuousKey(curr.key).join('-');
          const currentBin = variable.bins[keyTrimIntegers] ||
              variable.bins[curr.key] ||
              { groupName: '--' };
          return Object.assign(
            {},
            acc,
            {
              [keyTrimIntegers]: {
                doc_count: curr.doc_count,
                groupName: currentBin.groupName,
                key: keyTrimIntegers,
              },
            }
          );
        }, {});

      const binData = getBinData(binsForBinData, dataBuckets);

      return Object.assign(
        {},
        binData,
        {
          getContinuousBins: (acc, { doc_count, key, keyArray }) => {
            const keyValues = parseContinuousKey(key);
            // survival doesn't have keyArray
            const keyArrayValues = keyArray
              ? parseContinuousKey(keyArray[0])
              : keyValues;

            const groupName = keyValues.length === 2 &&
              isFinite(keyValues[0]) &&
              isFinite(keyValues[1])
              ? createContinuousGroupName(key)
              : key;

            const [keyMin, keyMax] = keyArrayValues;
            const filters = {
              op: 'and',
              content: [
                {
                  op: 'in',
                  content: {
                    field: 'cases.case_id',
                    value: `set_id:${setId}`,
                  },
                },
                {
                  op: '>=',
                  content: {
                    field: fieldName,
                    value: [keyMin],
                  },
                },
                {
                  op: '<',
                  content: {
                    field: fieldName,
                    value: [keyMax],
                  },
                },
              ],
            };

            return acc.concat(
              {
                chart_doc_count: doc_count,
                doc_count: getCountLink({
                  doc_count,
                  filters,
                  totalDocs,
                }),
                filters,
                groupName,
                key: `${keyMin}-${keyMax}`,
                rangeValues: {
                  max: keyMax,
                  min: keyMin,
                },
              }
            );
          },
        }
      );
    }
  ),
  withPropsOnChange((props, nextProps) =>
  nextProps.variable.active_chart === 'survival' &&
    (!isEqual(props.binData, nextProps.binData) ||
    props.variable.active_chart !== nextProps.variable.active_chart ||
    !isEqual(props.selectedSurvivalBins, nextProps.selectedSurvivalBins) ||
    props.variable.setId !== nextProps.variable.setId),
    ({
      dataBuckets,
      getContinuousBins,
      variable: { bins, continuousBinType, savedSurvivalBins },
      variable,
    }) => {
      console.log('variable', variable)
      const parsedBins = Object.keys(bins)
        .map(bin => parseContinuousKey(bin).join('-'))
        .reduce((acc, curr, idx) => Object.assign(
          {}, 
          acc, 
          { [curr]: bins[Object.keys(bins)[idx]] } 
        ),{});
      console.log('parsedBins', parsedBins);
      console.log('savedSurvivalBins', savedSurvivalBins);
      const canUseSavedBins = savedSurvivalBins
        .some(savedBin => {
          const currentBin = parsedBins[savedBin.values[0]];
          if (typeof currentBin === 'undefined') return false;
          const currentBinParsedKey = parseContinuousKey(currentBin.key).join('-');
          
          return currentBinParsedKey === savedBin.values[0] &&
          (continuousBinType === 'default' || currentBin.groupName === savedBin.name);
        });
      console.log('canUseSavedBins', canUseSavedBins);

      const survivalPlotValues = dataBuckets.length === 0
        ? []
        : (canUseSavedBins
          ? filterSurvivalData(dataBuckets
              .filter(dataBucket => savedSurvivalBins
                .some(savedBin => savedBin.values[0] === parseContinuousKey(dataBucket.key).join('-'))
              )
              .reduce(getContinuousBins, [])
            ) 
          : filterSurvivalData(dataBuckets
              .sort((a, b) =>
                parseContinuousKey(a.key)[0] - parseContinuousKey(b.key)[0])
              .reduce(getContinuousBins, [])
            ) 
            .sort((a, b) => b.chart_doc_count - a.chart_doc_count)
          )
            .slice(0, canUseSavedBins ? MAXIMUM_CURVES - 1 : 2)
            .map(bin => makeDocCountInteger(bin));

      const survivalTableValues = survivalPlotValues
        .map(bin => bin.key);

      console.log('survivalPlotValues', survivalPlotValues);
      console.log('survivalTableValues', survivalTableValues);

      return {
        survivalPlotValues,
        survivalTableValues,
      };
    }
  ),
  withPropsOnChange(
    (props, nextProps) =>
      !isEqual(props.binData, nextProps.binData),
    ({ binData, getContinuousBins }) => ({
      displayData: isEmpty(binData)
        ? []
        : binData
          .sort((a, b) => a.keyArray[0] - b.keyArray[0])
          .reduce(getContinuousBins, []),
    })
  ),
  withPropsOnChange(
    (props, nextProps) => props.binsAreCustom !== nextProps.binsAreCustom ||
      props.variable.id !== nextProps.variable.id ||
      !isEqual(props.variable.savedSurvivalBins, nextProps.variable.savedSurvivalBins),
    ({
      binsAreCustom,
      defaultData: { bins },
      dispatchUpdateClinicalVariable,
      variable: { savedSurvivalBins },
    }) => ({
      resetBins: () => {
        if (binsAreCustom) {
          dispatchUpdateClinicalVariable({
            value: bins,
            variableKey: 'bins',
          });
          dispatchUpdateClinicalVariable({
            value: DEFAULT_BIN_TYPE,
            variableKey: 'continuousBinType',
          });
          dispatchUpdateClinicalVariable({
            value: DEFAULT_INTERVAL,
            variableKey: 'customInterval',
          });
          dispatchUpdateClinicalVariable({
            value: DEFAULT_RANGES,
            variableKey: 'customRanges',
          });
        }
        if (savedSurvivalBins.length > 0) {
          dispatchUpdateClinicalVariable({
            value: DEFAULT_SAVED_SURVIVAL_BINS,
            variableKey: 'savedSurvivalBins',
          });
        }
      },
    })
  ),
)(EnhancedClinicalVariableCard);
