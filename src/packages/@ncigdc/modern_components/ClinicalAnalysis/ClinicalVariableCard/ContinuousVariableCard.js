import React from 'react';
import {
  compose,
  lifecycle,
  setDisplayName,
  withHandlers,
  withProps,
  withPropsOnChange,
  withState,
  flattenProp,
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
  cardDefaults,
  dataDimensions,
  DEFAULT_BIN_TYPE,
  filterSurvivalData,
  getRawQueryData,
  makeBinData,
  makeContinuousGroupName,
  makeCountLink,
  parseContinuousKey,
  parseContinuousValue,
} from './helpers';
import EnhancedClinicalVariableCard from './EnhancedClinicalVariableCard';

const makeContinuousBins = ({
  binData = [],
  continuousBinType,
  fieldName,
  setId,
  totalDocs,
}) => binData.reduce((acc, {
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
            ? makeContinuousGroupName(key)
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
        doc_count: makeCountLink({
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
  }, []);

const makeDefaultDataOnLoad = ({ explore, fieldName }) => {
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

const makeContinuousProps = ({ data, fieldName }) => {
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
};

const makeVariableBins = ({ 
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

export default compose(
  setDisplayName('EnhancedContinuousVariableCard'),
  connect((state: any) => ({ analysis: state.analysis })),
  withTheme,
  flattenProp('variable'),
  withState('qqData', 'setQQData', []),
  withState('qqDataIsSet', 'setQQDataIsSet', false),
  withProps(
    ({
      data: { explore },
      fieldName,
    }) => makeDefaultDataOnLoad({ explore, fieldName })
  ),
  withPropsOnChange(
    ['continuousBinType'],
    ({ continuousBinType }) => ({
      binsAreCustom: continuousBinType !== DEFAULT_BIN_TYPE,
    })
  ),
  withHandlers({
    handleCloseModal: ({ dispatch }) => () => {
      dispatch(setModal(null));
    },
    handleUpdateCustomBins: ({
      continuousBinType,
      customInterval,
      customRanges,
      defaultData,
      dispatch,
      fieldName,
      id,
    }) => ({
      continuousReset,
      newBins,
      nextContinuousBinType,
      nextCustomInterval,
      nextCustomRanges,
    }) => {
      dispatch(updateClinicalAnalysisVariable({
        fieldName,
        id,
        variable: {
          ...continuousReset
            ? {
              bins: defaultData.bins,
              ...cardDefaults.continuous,
              ...cardDefaults.survival,
            }
            : {
              bins: newBins,
              continuousBinType: nextContinuousBinType,
              ...nextContinuousBinType === 'interval' &&
                !isEqual(customInterval, nextCustomInterval) &&
                {
                  customInterval: nextCustomInterval,
                  ...cardDefaults.survival,
                },
              ...nextContinuousBinType === 'range' &&
                !isEqual(customRanges, nextCustomRanges) &&
                {
                  customRanges: nextCustomRanges,
                  ...cardDefaults.survival,
                },
            },
        },
      }));
      dispatch(setModal(null));
    }
  }),
  withHandlers({
    openCustomBinModal: ({
      continuousBinType,
      customInterval,
      customRanges,
      defaultData,
      dispatch,
      fieldName,
      handleCloseModal,
      handleUpdateCustomBins,
      id,
    }) => () => {
      dispatch(setModal(
        <ContinuousCustomBinsModal
          continuousBinType={continuousBinType}
          customInterval={customInterval}
          customRanges={customRanges}
          defaultData={defaultData}
          fieldName={humanify({ term: fieldName })}
          onClose={() => handleCloseModal()}
          onUpdate={e => handleUpdateCustomBins(e)}
          />
      ));
    },
  }),
  withPropsOnChange(
    (props, nextProps) => !isEqual(props.data, nextProps.data),
    ({ data, fieldName }) => makeContinuousProps({ data, fieldName }),
  ),
  withPropsOnChange(
    (props, nextProps) => !(
      isEqual(props.dataBuckets, nextProps.dataBuckets) &&
      props.setId === nextProps.setId
    ),
    ({
      bins = {},
      continuousBinType,
      dataBuckets,
      dispatch,
      fieldName,
      id,
    }) => {
      makeVariableBins({
        bins,
        continuousBinType,
        dataBuckets,
        dispatch,
        fieldName,
        id,
      });
    },
  ),
  withProps(
    ({
      bins = {},
      data: { explore },
      dataBuckets,
      fieldName,
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

      return makeBinData(binsForBinData, dataBuckets);
    }
  ),
  withPropsOnChange(
    (props, nextProps) => nextProps.active_chart === 'survival' && !(
      isEqual(props.selectedSurvivalBins, nextProps.selectedSurvivalBins) &&
      isEqual(props.bins, nextProps.bins) &&
      isEqual(props.customSurvivalPlots, nextProps.customSurvivalPlots) &&
      props.setId === nextProps.setId &&
      props.active_chart === nextProps.active_chart &&
      props.isSurvivalCustom === nextProps.isSurvivalCustom
    ),
    ({
      active_chart,
      bins = {},
      continuousBinType,
      customSurvivalPlots,
      dispatch,
      fieldName,
      id,
      isSurvivalCustom,
      setId,
      totalDocs,
    }) => {
      // prevent survival API requests on mount
      // when a non-survival plot is active
      if (active_chart !== 'survival') {
        return {
          survivalPlotValues: [],
          survivalTableValues: [],
        };
      }

      const binsWithNames = Object.keys(bins).map(bin => ({
        ...bins[bin],
        displayName: continuousBinType === 'default'
          ? makeContinuousGroupName(bins[bin].key)
          : bins[bin].groupName,
      }));

      const availableColors = SURVIVAL_PLOT_COLORS
        .filter(color => !find(customSurvivalPlots, ['color', color]));

      const customBinMatches = isSurvivalCustom
        ? binsWithNames.filter(bin => find(customSurvivalPlots, ['keyName', bin.displayName])).map((b, i) => {
          const match = find(customSurvivalPlots, ['keyName', b.displayName]);
          return {
            ...b,
            color: (match && match.color) || availableColors[i],
          };
        })
        : [];

      const isUsingCustomSurvival = customBinMatches.length > 0;

      const survivalBins = isUsingCustomSurvival
        ? filterSurvivalData(makeContinuousBins({
          binData: customBinMatches,
          continuousBinType,
          fieldName,
          setId,
          totalDocs,
        }))
        : filterSurvivalData(makeContinuousBins({
          binData: binsWithNames.sort((a, b) => a.key - b.key),
          continuousBinType,
          fieldName,
          setId,
          totalDocs,
        }))
        .sort((a, b) => b.chart_doc_count - a.chart_doc_count)
        .map((bin, i) => ({
          ...bin,
          color: availableColors[i],
        }))
        .slice(0, 2);

      const survivalPlotValues = survivalBins.map(bin => ({
        ...bin,
        filters: bin.filters,
        key: bin.key,
        keyName: bin.key,
      }));

      const survivalTableValues = survivalBins
        .map(bin => ({
          ...bin,
          keyName: bin.displayName,
        }));

      const nextCustomSurvivalPlots = customBinMatches
        .map(bin => ({
          ...bin,
          keyName: bin.displayName,
        }));

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
      continuousBinType,
      fieldName,
      setId,
      totalDocs,
    }) => ({
      displayData: isEmpty(binData)
        ? []
        : makeContinuousBins({
          binData: binData.sort((a, b) => a.keyArray[0] - b.keyArray[0]),
          continuousBinType,
          fieldName,
          setId,
          totalDocs,
        }),
    }
  )),
  withPropsOnChange(
    (props, nextProps) => !(
      props.binsAreCustom === nextProps.binsAreCustom &&
      props.id === nextProps.id &&
      props.isSurvivalCustom === nextProps.isSurvivalCustom
    ),
    ({
      binsAreCustom,
      defaultData: { bins: defaultBins },
      dispatch,
      fieldName,
      id,
    }) => ({
      resetBins: () => {
        dispatch(updateClinicalAnalysisVariable({
          fieldName,
          id,
          variable: {
            ...cardDefaults.survival,
            ...binsAreCustom && {
              defaultBins,
              ...cardDefaults.continuous,
            },
          },
        }));
      },
    })
  ),
  lifecycle({
    componentDidMount() {
      console.log('continuous card mounted');
    }
  })
)(EnhancedClinicalVariableCard);
