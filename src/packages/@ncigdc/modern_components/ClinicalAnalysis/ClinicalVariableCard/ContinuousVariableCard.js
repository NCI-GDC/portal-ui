import React from 'react';
import PropTypes from 'prop-types'; 
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
import {
  createContinuousGroupName,
  dataDimensions,
  dispatchUpdateClinicalVariable,
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
} from './helpers';
import EnhancedClinicalVariableCard from './EnhancedClinicalVariableCard';

export default compose(
  setDisplayName('EnhancedContinuousVariableCard'),
  connect((state: any) => ({ analysis: state.analysis })),
  withTheme,
  dispatchUpdateClinicalVariable,
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
            (continuousReset ||
              (continuousBinType === 'range' &&
                !isEqual(variable.customRanges, customRanges)) ||
              (continuousBinType === 'interval' &&
                !isEqual(variable.customInterval, customInterval))) &&
                [
                  dispatchUpdateClinicalVariable({
                    value: [],
                    variableKey: 'customSurvivalPlots'
                  }),
                  dispatchUpdateClinicalVariable({
                    value: false,
                    variableKey: 'isSurvivalCustom',
                  }),
                ];
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
                displayName: groupName,
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
      (props.variable.active_chart !== nextProps.variable.active_chart ||
      !(isEqual(props.variable.bins, nextProps.variable.bins)) ||
      props.setId !== nextProps.setId ||
      !isEqual(props.variable.customSurvivalPlots, props.variable.customSurvivalPlots) ||
      props.variable.isSurvivalCustom !== nextProps.variable.isSurvivalCustom ||
      !isEqual(props.selectedSurvivalBins, nextProps.selectedSurvivalBins)),
      ({
        binsAreCustom,
        dispatchUpdateClinicalVariable,
        getContinuousBins,
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
            : bins[bin].groupName
        }));

        const customBinMatches = isSurvivalCustom && binsAreCustom
          ? binsWithNames.filter(bin => customSurvivalPlots
              .indexOf(bin.displayName) >= 0)
          : [];
        
        const isUsingCustomSurvival = customBinMatches.length > 0;

        const survivalBins = (isUsingCustomSurvival
          ? filterSurvivalData(customBinMatches
              .reduce(getContinuousBins, [])
            ) 
          : filterSurvivalData(binsWithNames
              .sort((a, b) => a.key - b.key)
              .reduce(getContinuousBins, [])
            ) 
            .sort((a, b) => b.chart_doc_count - a.chart_doc_count)
          )
            .slice(0, isUsingCustomSurvival ? Infinity : 2);
               
        const survivalPlotValues = survivalBins.map(bin => ({
          filters: bin.filters,
          key: bin.key,
        }));

        const survivalTableValues = survivalBins
          .map(bin => bin.displayName);

        // console.log('-----------');
        // console.log('customSurvivalPlots', customSurvivalPlots);
        // console.log('binsWithNames', binsWithNames);
        // console.log('customBinMatches', customBinMatches);
        // console.log('survivalBins', survivalBins);
        // console.log('survivalPlotValues', survivalPlotValues);
        // console.log('survivalTableValues', survivalTableValues);
        // console.log('isSurvivalCustom', isSurvivalCustom);
        // console.log('customBinMatches', customBinMatches);
        // console.log('customBinMatches.length > 0', customBinMatches.length > 0)

        dispatchUpdateClinicalVariable({
          value: customBinMatches.map(match => match.displayName),
          variableKey: 'customSurvivalPlots',
        });
        dispatchUpdateClinicalVariable({
          value: customBinMatches.length > 0,
          variableKey: 'isSurvivalCustom',
        });

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
      props.variable.isSurvivalCustom !== nextProps.variable.isSurvivalCustom,
    ({
      binsAreCustom,
      defaultData: { bins },
      dispatchUpdateClinicalVariable,
      variable: { isSurvivalCustom },
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
        if (isSurvivalCustom) {
          dispatchUpdateClinicalVariable({
            value: false,
            variableKey: 'isSurvivalCustom',
          });
          dispatchUpdateClinicalVariable({
            value: [],
            variableKey: 'customSurvivalPlots',
          });
        }
      },
    })
  ),
)(EnhancedClinicalVariableCard);
