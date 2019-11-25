import {
  compose,
  flattenProp,
  lifecycle,
  setDisplayName,
  withHandlers,
  withProps,
  withPropsOnChange,
  withState,
} from 'recompose';
import { connect } from 'react-redux';
import {
  find,
  isEmpty,
  isEqual,
  uniq,
} from 'lodash';

import {
  getSurvivalCurvesArray,
  MAX_SURVIVAL_CURVES,
  SURVIVAL_PLOT_COLORS,
} from '@ncigdc/utils/survivalplot';
import { withTheme } from '@ncigdc/theme';
import { updateClinicalAnalysisVariable } from '@ncigdc/dux/analysis';

import ClinicalVariableCard from './ClinicalVariableCard';

export default compose(
  setDisplayName('EnhancedSharedVariableCard'),
  connect(({ analysis }) => ({ analysis })),
  withTheme,
  flattenProp('variable'),
  withState('selectedBins', 'setSelectedBins', []),
  withState('selectedSurvivalPlots', 'setSelectedSurvivalPlots', []),
  withState('selectedSurvivalData', 'setSelectedSurvivalData', {}),
  withState('selectedSurvivalLoadingIds', 'setSelectedSurvivalLoadingIds', []),
  withState('survivalDataLoading', 'setSurvivalDataLoading', true),
  withHandlers({
    updateSurvivalPlot: ({
      fieldName,
      filters,
      plotTypes,
      setSelectedSurvivalData,
      setSelectedSurvivalLoadingIds,
      setSurvivalDataLoading,
    }) => values => getSurvivalCurvesArray({
      currentFilters: filters,
      field: fieldName,
      plotType: plotTypes,
      values,
    }).then(data => {
      setSelectedSurvivalData(data);
      setSurvivalDataLoading(false);
      setSelectedSurvivalLoadingIds([]);
    }),
  }),
  withHandlers({
    populateSurvivalData: ({
      survivalTableValues,
      survivalPlotValues,
      setSurvivalDataLoading,
      setSelectedSurvivalPlots,
      setSelectedSurvivalLoadingIds,
      updateSurvivalPlot,
    }) => () => {
      setSurvivalDataLoading(true);
      setSelectedSurvivalPlots(survivalTableValues);
      setSelectedSurvivalLoadingIds(survivalTableValues);
      updateSurvivalPlot(survivalPlotValues);
    },
    updateSelectedSurvivalPlots: ({
      dispatch,
      fieldName,
      id,
      plotTypes,
      selectedSurvivalPlots,
      setSelectedSurvivalLoadingIds,
      setSelectedSurvivalPlots,
      setSurvivalDataLoading,
      survivalPlotValues,
      survivalTableValues,
      updateSurvivalPlot,
    }) => (displayData, { color, displayName, keyArray }) => {
      const isSelectedPlot = selectedSurvivalPlots
        .map(sBin => sBin.keyName)
        .includes(displayName);          

      if (
        !isSelectedPlot &&
        selectedSurvivalPlots.length === MAX_SURVIVAL_CURVES
      ) {
        // survival chart is full, can't add more lines
        return;
      }

      setSurvivalDataLoading(true);

      const availableColors = SURVIVAL_PLOT_COLORS
        .filter(spColor => !find(selectedSurvivalPlots, ['color', spColor]));

      const nextSelectedBins = isSelectedPlot
        ? selectedSurvivalPlots.filter(s => s.keyName !== displayName)
        : selectedSurvivalPlots.concat({
          color: color || availableColors[0],
          ...plotTypes === 'categorical' &&
            { keyArray },
          keyName: displayName,
        });

      setSelectedSurvivalPlots(nextSelectedBins);
      setSelectedSurvivalLoadingIds(nextSelectedBins);

      const nextBinsForPlot = plotTypes === 'categorical'
        ? nextSelectedBins.filter(nextBin => (
          displayData.find(datum => datum.displayName === nextBin.keyName)
        ))
        : nextSelectedBins.map(nextBin => displayData
          .find(datum => datum.displayName === nextBin.keyName));

      updateSurvivalPlot(nextBinsForPlot);

      // remove deselected plots and duplicates
      const nextSurvivalPlots = uniq(nextSelectedBins
        .filter(filterBin => !(isSelectedPlot && filterBin.keyName === displayName)));

      dispatch(updateClinicalAnalysisVariable({
        fieldName,
        id,
        variable: {
          customSurvivalPlots: nextSurvivalPlots,
          isSurvivalCustom: true,
          // survival is custom if the user selects/deselects anything,
          // until they reset the card
          showOverallSurvival: nextSurvivalPlots.length === 0,
        },
      }));
    },
  }),
  withPropsOnChange(
    (props, nextProps) => nextProps.active_chart === 'survival' &&
      (props.active_chart !== nextProps.active_chart ||
      props.id !== nextProps.id ||
      !isEqual(props.bins, nextProps.bins) ||
      (props.isSurvivalCustom !== nextProps.isSurvivalCustom &&
        !nextProps.isSurvivalCustom)),
    ({ active_chart, populateSurvivalData }) => {
      if (active_chart === 'survival') {
        // prevent survival loading on mount
        // when a different plot is selected
        populateSurvivalData();
      }
    }
  ),
  withPropsOnChange(
    ({ id }, { id: nextId }) => id !== nextId,
    ({ setSelectedBins }) => setSelectedBins([])
  ),
  lifecycle({
    componentDidMount(): void {
      const {
        bins,
        binsOrganizedByKey,
        dispatch,
        fieldName,
        id,
        scrollToCard,
        wrapperId,
      } = this.props;
      if (bins === undefined || isEmpty(bins)) {
        dispatch(updateClinicalAnalysisVariable({
          fieldName,
          id,
          variable: {
            bins: binsOrganizedByKey,
          },
        }));
      }

      if (scrollToCard) {
        const offset = document.getElementById('header')
          .getBoundingClientRect().bottom + 10;
        const $anchor = document.getElementById(`${wrapperId}-container`);
        if ($anchor) {
          const offsetTop = $anchor.getBoundingClientRect().top + window.pageYOffset;
          window.scroll({
            behavior: 'smooth',
            top: offsetTop - offset,
          });
        }
        dispatch(updateClinicalAnalysisVariable({
          fieldName,
          id,
          variable: {
            scrollToCard: false,
          },
        }));
      }
    },
  })
)(ClinicalVariableCard);
