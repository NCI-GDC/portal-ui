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
import { updateClinicalAnalysisVariable } from '@ncigdc/dux/analysis';
import { SURVIVAL_PLOT_COLORS } from '@ncigdc/utils/survivalplot';

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

const getContinuousBins = ({
  binData = [],
  continuousBinType,
  fieldName,
  setId,
  totalDocs,
}) => (
  binData.reduce((acc, {
    color, doc_count, groupName = '', key, keyArray = [],
  }) => {
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
        color,
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
  }, [])
);

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
                    ...resetVariableDefaults.continuous,
                    ...resetVariableDefaults.survival,
                  }
                  : {
                    bins: newBins,
                    continuousBinType,
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
        bins = {},
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
      variable: {
        bins = {},
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

      return getBinData(binsForBinData, dataBuckets);
    }
  ),
  // withPropsOnChange(
  //   (props, nextProps) => nextProps.variable.active_chart === 'survival' &&
  //   nextProps.variable.isSurvivalCustom && !(
  //     props.setId === nextProps.setId,
  //     isEqual(props.dataBuckets, nextProps.dataBuckets)
  //   ),
  //   ({
  //     dispatch,
  //     fieldName,
  //     id,
  //   }) => {
  //     console.log('here');
  //     dispatch(updateClinicalAnalysisVariable({
  //       fieldName,
  //       id,
  //       variable: {
  //         customSurvivalPlots: [],
  //         isSurvivalCustom: false,
  //         // showOverallSurvival: false,
  //       },
  //     }));
  //   }
  // ),
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
      id,
      setId,
      totalDocs,
      variable: {
        bins = {},
        continuousBinType,
        customSurvivalPlots,
        isSurvivalCustom, // redux property
      },
    }) => {
      const binsWithNames = Object.keys(bins).map(bin => ({
        ...bins[bin],
        displayName: continuousBinType === 'default'
            ? createContinuousGroupName(bins[bin].key)
            : bins[bin].groupName,
      }));
      console.log('isSurvivalCustom:', isSurvivalCustom);
      const availableColors = SURVIVAL_PLOT_COLORS
        .filter(color => !find(customSurvivalPlots, ['color', color]));

      // somewhere after switching set with isSurvivalCustom: true,
      // customBinMatches goes back to []
      // and then isUsingCustomSurvival resets to false,
      // so you get the default survival plots again
      console.log('bins with names: ', binsWithNames);
      console.log('customSurvivalPlots: ', customSurvivalPlots);
      const customBinMatches = isSurvivalCustom
          ? binsWithNames.filter(bin => find(customSurvivalPlots, ['keyName', bin.displayName])
            // customSurvivalPlots
            // .indexOf(bin.displayName) >= 0
          ).map((b, i) => {
            const match = find(customSurvivalPlots, ['keyName', b.displayName]);
            // console.log('match: ', match);
            return {
              ...b,
              color: (match && match.color) || availableColors[i],
            };
          })
          : [];

      console.log('custom bin matches: ', customBinMatches);
      const isUsingCustomSurvival = customBinMatches.length > 0;
      console.log('isUsingCustomSurvival? ', isUsingCustomSurvival);
      // .map((bin, i) => {
      //   const currentMatch = customBinMatches &&
      //     customBinMatches.find(cBin => cBin.keyName === bin.key);
      //   debugger;
      //   return {
      //     ...bin,
      //     chart_doc_count: bin.doc_count,
      //     color: currentMatch ? currentMatch.color : availableColors[i],
      //   };
      // })
      // is custom:
      // .map(bin => {
      //   const currentMatch = customSurvivalPlots.find(plot => plot.keyName === bin.displayName);
      //   // console.log('current match:', currentMatch);
      //   console.log('current bin: ', bin);
      //   return {
      //     ...bin,
      //     // the color is not saved from the default sorting,
      //     // i think that's why you see the colour shuffle
      //     // after you select the first custom plot
      //     // color: (currentMatch && currentMatch.color) || availableColors[i],
      //   };
      // })
      const survivalBins = (isUsingCustomSurvival
        ? filterSurvivalData(getContinuousBins({
          binData: customBinMatches,
          continuousBinType,
          fieldName,
          setId,
          totalDocs,
        }))
      : filterSurvivalData(getContinuousBins({
        binData: binsWithNames.sort((a, b) => a.key - b.key),
        continuousBinType,
        fieldName,
        setId,
        totalDocs,
      })).sort((a, b) => b.chart_doc_count - a.chart_doc_count)
        .map((bin, i) => {
          // const currentMatch = customSurvivalPlots.find(plot => plot.keyName === bin.displayName);
          return {
            ...bin,
            color: availableColors[i],
            // color: (currentMatch && currentMatch.color) || availableColors[i],
          };
        })
      ).slice(0, isUsingCustomSurvival ? Infinity : 2);

        // const survivalBins = filterSurvivalData(
        //   binDataSelected
        //     .map((bin, i) => {
        //       const currentMatch = customSurvivalPlots.find(plot => plot.keyName === bin.key);
        //       return {
        //         ...bin,
        //         chart_doc_count: bin.doc_count,
        //         color: currentMatch ? currentMatch.color : availableColors[i],
        //       };
        //     })
        // )
        //   .slice(0, isSurvivalCustom ? Infinity : 2);

      // const survivalPlotValues = survivalBins.map(bin => ({
      //   filters: bin.filters,
      //   key: bin.key,
      // }));
      // const survivalTableValues = survivalBins
      //   .map(bin => bin.displayName);
      // const nextCustomSurvivalPlots = customBinMatches
      //   .map(bin => bin.displayName);
      // console.log('availableColors: ', availableColors);
      const survivalPlotValues = survivalBins.map((bin, i) => {
        // console.log('bin color: ', bin.color);
        return {
          // color: bin.color || availableColors[i],
          ...bin,
          filters: bin.filters,
          key: bin.key,
          keyName: bin.key,
        };
      });
      // console.log('survival plot values: ', survivalPlotValues);
      const survivalTableValues = survivalBins
        .map((bin, i) => {
          // console.log('color: ', bin.color);
          return {
            ...bin,
            // color: bin.color || availableColors[i],
            keyName: bin.displayName,
          };
        });
      // console.log('survival table values: ', survivalTableValues);
      const nextCustomSurvivalPlots = customBinMatches
        .map((bin, i) => {
          // console.log('next bin: ', bin);
          return {
            ...bin,
            // color: bin.color || availableColors[i],
            keyName: bin.displayName,
          };
        });
      // console.log('nextCustomSurvivalPlots: ', nextCustomSurvivalPlots);
      // debugger;
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
      fieldName,
      setId,
      totalDocs,
      variable: {
        continuousBinType,
      },
    }) => {
      return {
        displayData: isEmpty(binData)
          ? []
          : getContinuousBins({
            // binData,
            binData: binData.sort((a, b) => a.keyArray[0] - b.keyArray[0]),
            continuousBinType,
            fieldName,
            setId,
            totalDocs,
          }),
      };
    }
  ),
  withPropsOnChange(
    (props, nextProps) => !(
      props.binsAreCustom === nextProps.binsAreCustom &&
      props.variable.id === nextProps.variable.id &&
      props.variable.isSurvivalCustom === nextProps.variable.isSurvivalCustom
    ),
    ({
      binsAreCustom,
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
            ...resetVariableDefaults.survival,
            ...binsAreCustom && {
              bins,
              ...resetVariableDefaults.continuous,
            },
          },
        }));
      },
    })
  ),
)(EnhancedClinicalVariableCard);
