import {
  compose,
  lifecycle,
  setDisplayName,
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
  connect((state: any) => ({ analysis: state.analysis })),
  withTheme,
  withState('selectedBins', 'setSelectedBins', []),
  withState('selectedSurvivalPlots', 'setSelectedSurvivalPlots', []),
  withState('selectedSurvivalData', 'setSelectedSurvivalData', {}),
  withState('selectedSurvivalLoadingIds', 'setSelectedSurvivalLoadingIds', []),
  withState('survivalDataLoading', 'setSurvivalDataLoading', true),
  withProps(({
    fieldName,
    filters,
    setSelectedSurvivalData,
    setSelectedSurvivalLoadingIds,
    setSurvivalDataLoading,
    variable: { plotTypes },
  }) => ({
    updateSurvivalPlot: values => getSurvivalCurvesArray({
      currentFilters: filters,
      field: fieldName,
      plotType: plotTypes,
      values,
    }).then(data => {
      setSelectedSurvivalData(data);
      setSurvivalDataLoading(false);
      setSelectedSurvivalLoadingIds([]);
    }),
  })),
  withPropsOnChange(
    (props, nextProps) => !(
      props.variable.setId === nextProps.variable.setId &&
      isEqual(props.variable.customSurvivalPlots, nextProps.variable.customSurvivalPlots) &&
      isEqual(props.selectedSurvivalPlots, nextProps.selectedSurvivalPlots) &&
      isEqual(props.survivalPlotValues, nextProps.survivalPlotValues) &&
      isEqual(props.filters, nextProps.filters)
    ),
    ({
      dispatch,
      fieldName,
      id,
      selectedSurvivalPlots,
      setSelectedSurvivalPlots,
      setSelectedSurvivalLoadingIds,
      setSurvivalDataLoading,
      survivalPlotValues,
      survivalTableValues,
      updateSurvivalPlot,
      variable: { plotTypes },
    }) => ({
      populateSurvivalData: () => {
        setSurvivalDataLoading(true);
        setSelectedSurvivalPlots(survivalTableValues);
        setSelectedSurvivalLoadingIds(survivalTableValues);
        updateSurvivalPlot(survivalPlotValues);
      },
      updateSelectedSurvivalPlots: (data, bin) => {
        const isSelected = selectedSurvivalPlots
          .map(sBin => sBin.keyName)
          .includes(bin.displayName);

        if (
          !isSelected &&
          selectedSurvivalPlots.length === MAX_SURVIVAL_CURVES
        ) {
          // survival chart is full, can't add more lines
          return;
        }

        setSurvivalDataLoading(true);

        const availableColors = SURVIVAL_PLOT_COLORS
          .filter(color => !find(selectedSurvivalPlots, ['color', color]));

        const nextSelectedBins = isSelected
          ? selectedSurvivalPlots.filter(s => s.keyName !== bin.displayName)
          : selectedSurvivalPlots.concat({
            color: bin.color || availableColors[0],
            ...plotTypes === 'continuous'
              ? { filters: bin.filters }
              : { keyArray: bin.keyArray },
            keyName: bin.displayName,
          });

        setSelectedSurvivalPlots(nextSelectedBins);
        setSelectedSurvivalLoadingIds(nextSelectedBins);

        const nextBinsForPlot = plotTypes === 'categorical'
          ? nextSelectedBins.filter(nextBin => (
            data.find(datum => datum.displayName === nextBin.keyName)
          ))
          : nextSelectedBins.map(nextBin => data
            .find(datum => datum.displayName === nextBin.keyName));

        updateSurvivalPlot(nextBinsForPlot);

        // remove deselected plots and duplicates
        const nextSurvivalPlots = uniq(nextSelectedBins
          .filter(filterBin => !(isSelected && filterBin.keyName === bin.displayName)));

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
    })
  ),
  withPropsOnChange(
    (props, nextProps) => nextProps.variable.active_chart === 'survival' &&
      (props.variable.active_chart !== nextProps.variable.active_chart ||
      props.id !== nextProps.id ||
      !isEqual(props.variable.bins, nextProps.variable.bins) ||
      (props.variable.isSurvivalCustom !== nextProps.variable.isSurvivalCustom &&
        !nextProps.variable.isSurvivalCustom)),
    ({ populateSurvivalData, variable: { active_chart } }) => {
      if (active_chart === 'survival') {
        // prevent survival loading on mount
        // when a different plot is selected
        populateSurvivalData();
      }
    }
  ),
  withPropsOnChange(
    (props, nextProps) => props.id !== nextProps.id,
    ({ setSelectedBins }) => setSelectedBins([])
  ),
  lifecycle({
    componentDidMount(): void {
      const {
        binsOrganizedByKey,
        dispatch,
        fieldName,
        id,
        variable,
        wrapperId,
      } = this.props;
      if (variable.bins === undefined || isEmpty(variable.bins)) {
        dispatch(updateClinicalAnalysisVariable({
          fieldName,
          id,
          variable: {
            bins: binsOrganizedByKey,
          },
        }));
      }

      if (variable.scrollToCard) {
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
