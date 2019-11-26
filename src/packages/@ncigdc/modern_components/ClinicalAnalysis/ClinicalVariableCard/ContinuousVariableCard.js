import React from 'react';
import {
  compose,
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
  isEmpty,
  isEqual,
  map,
} from 'lodash';

import { withTheme } from '@ncigdc/theme';
import {
  humanify,
  createFacetFieldString,
} from '@ncigdc/utils/string';
import { setModal } from '@ncigdc/dux/modal';
import { updateClinicalAnalysisVariable } from '@ncigdc/dux/analysis';
import { SURVIVAL_PLOT_COLORS } from '@ncigdc/utils/survivalplot';

import ContinuousCustomBinsModal from './modals/ContinuousCustomBinsModal';

import {
  parseContinuousKey,
  makeContinuousDefaultLabel,
  makeContinuousBins,
  makeDefaultDataOnLoad,
  makeContinuousProps,
  dispatchVariableBins,
} from './utils/continuous';

import {
  DEFAULT_BIN_TYPE,
  cardDefaults,
  filterSurvivalData,
  makeBinData,
} from './utils/shared';

import SharedVariableCard from './SharedVariableCard';

export default compose(
  setDisplayName('EnhancedContinuousVariableCard'),
  connect(({ analysis }) => ({ analysis })),
  withTheme,
  flattenProp('variable'),
  withState('qqData', 'setQQData', []),
  withState('qqDataIsSet', 'setQQDataIsSet', false),
  withProps(
    ({
      data: { explore },
      fieldName,
    }) => makeDefaultDataOnLoad({
      explore,
      fieldName,
    }),
  ),
  withPropsOnChange(
    ['continuousBinType'],
    ({ continuousBinType }) => ({
      binsAreCustom: continuousBinType !== DEFAULT_BIN_TYPE,
    }),
  ),
  withHandlers({
    handleCloseModal: ({ dispatch }) => () => {
      dispatch(setModal(null));
    },
  }),
  withHandlers({
    handleUpdateCustomBins: ({
      customInterval,
      customRanges,
      defaultData,
      dispatch,
      fieldName,
      handleCloseModal,
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
      handleCloseModal();
    },
    resetBins: ({
      binsAreCustom,
      defaultData: { bins: defaultBins },
      dispatch,
      fieldName,
      id,
    }) => () => {
      dispatch(updateClinicalAnalysisVariable({
        fieldName,
        id,
        variable: {
          ...cardDefaults.survival,
          ...binsAreCustom && {
            bins: defaultBins,
            ...cardDefaults.continuous,
          },
        },
      }));
    },
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
          />,
      ));
    },
  }),
  withPropsOnChange(
    ({ data }, { data: nextData }) => !isEqual(data, nextData),
    ({ data, fieldName }) => makeContinuousProps({
      data,
      fieldName,
    }),
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
      dispatchVariableBins({
        bins,
        continuousBinType,
        dataBuckets,
        dispatch,
        fieldName,
        id,
      });
    },
  ),
  withPropsOnChange(
    (props, nextProps) => !(isEqual(props.bins, nextProps.bins) &&
    isEqual(props.data.explore, nextProps.data.explore) &&
    isEqual(props.dataBuckets, nextProps.dataBuckets)),
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
        // making sure continuous data has loaded
        // because it loads after the page loads
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
    },
  ),
  withPropsOnChange(
    (props, nextProps) => nextProps.active_chart === 'survival' && !(
      isEqual(props.selectedSurvivalPlots, nextProps.selectedSurvivalPlots) &&
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
      // when a different plot is selected
      // or continuous bins haven't loaded yet.
      // if bins are truly empty, the card will show "no data".
      if (active_chart !== 'survival' || isEmpty(bins)) {
        return {
          survivalPlotValues: [],
          survivalTableValues: [],
        };
      }

      const binsWithNames = map(bins, (bin, binKey) => ({
        ...bin,
        displayName: continuousBinType === 'default'
          ? makeContinuousDefaultLabel(binKey)
          : bin.groupName,
      }));

      const availableColors = SURVIVAL_PLOT_COLORS
        .filter(color => !find(customSurvivalPlots, ['color', color]));

      const customBinMatches = isSurvivalCustom
        ? binsWithNames
          .filter(bin => find(customSurvivalPlots, ['keyName', bin.displayName]))
          .map((bin, i) => {
            const match = find(customSurvivalPlots, ['keyName', bin.displayName]);
            return {
              ...bin,
              color: (match && match.color) || availableColors[i],
            };
          })
        : [];

      const isShowingDefaultSurvival = customBinMatches.length === 0;

      const survivalBins = isShowingDefaultSurvival
        ? filterSurvivalData(makeContinuousBins({
          binData: binsWithNames.sort((a, b) => a.key - b.key),
          continuousBinType,
          fieldName,
          setId,
          totalDocs,
        }))
          .sort((a, b) => b.doc_count - a.doc_count)
          .map((bin, i) => ({
            ...bin,
            color: availableColors[i],
          }))
          .slice(0, 2)
        : filterSurvivalData(makeContinuousBins({
          binData: customBinMatches,
          continuousBinType,
          fieldName,
          setId,
          totalDocs,
        }));

      const survivalPlotValues = survivalBins
        .map(({ color, filters, key }) => ({
          color,
          filters, // for survivalcurvesarray
          keyName: key,
        }));

      // becomes customSurvivalPlots when plots are selected
      // or deselected by the user
      const survivalTableValues = survivalBins
        .map(({ color, displayName, filters }) => ({
          color,
          filters,
          keyName: displayName,
        }));

      const nextCustomSurvivalPlots = customBinMatches
        .map(({ color, displayName, filters }) => ({
          color,
          filters,
          keyName: displayName,
        }));

      dispatch(updateClinicalAnalysisVariable({
        fieldName,
        id,
        variable: {
          customSurvivalPlots: nextCustomSurvivalPlots,
          isSurvivalCustom: !isShowingDefaultSurvival,
          showOverallSurvival: false,
        },
      }));

      return {
        survivalPlotValues,
        survivalTableValues,
      };
    },
  ),
  withPropsOnChange(
    (props, nextProps) => !isEqual(props.binData, nextProps.binData),
    ({
      binData = [],
      continuousBinType,
      fieldName,
      setId,
      totalDocs,
    }) => ({
      displayData: makeContinuousBins({
        binData,
        continuousBinType,
        fieldName,
        setId,
        totalDocs,
      }),
    }),
  ),
)(SharedVariableCard);
