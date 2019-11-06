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
  MAXIMUM_CURVES,
  SURVIVAL_PLOT_COLORS,
} from '@ncigdc/utils/survivalplot';
import { withTheme } from '@ncigdc/theme';
import { updateClinicalAnalysisVariable } from '@ncigdc/dux/analysis';

import { makeDocCountInteger } from './helpers';
import ClinicalVariableCard from './ClinicalVariableCard';

export default compose(
  setDisplayName('EnhancedSharedVariableCard'),
  connect((state: any) => ({ analysis: state.analysis })),
  withTheme,
  withState('selectedBins', 'setSelectedBins', []),
  withState('selectedSurvivalBins', 'setSelectedSurvivalBins', []),
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
      isEqual(props.selectedSurvivalBins, nextProps.selectedSurvivalBins) &&
      isEqual(props.survivalPlotValues, nextProps.survivalPlotValues) &&
      isEqual(props.filters, nextProps.filters)
    ),
    ({
      dispatch,
      fieldName,
      id,
      selectedSurvivalBins,
      setSelectedSurvivalBins,
      setSelectedSurvivalLoadingIds,
      setSurvivalDataLoading,
      survivalPlotValues,
      survivalTableValues,
      updateSurvivalPlot,
      variable: { plotTypes },
    }) => ({
      populateSurvivalData: () => {
        setSurvivalDataLoading(true);
        setSelectedSurvivalBins(survivalTableValues);
        setSelectedSurvivalLoadingIds(survivalTableValues);
        updateSurvivalPlot(survivalPlotValues);
      },
      updateSelectedSurvivalBins: (data, bin) => {
        if (
          selectedSurvivalBins.map(sBin => sBin.keyName).indexOf(bin.displayName) === -1 &&
          selectedSurvivalBins.length >= MAXIMUM_CURVES
        ) {
          return;
        }
        setSurvivalDataLoading(true);

        const isSelected = selectedSurvivalBins
          .map(sBin => sBin.keyName).indexOf(bin.displayName) >= 0;

        const availableColors = SURVIVAL_PLOT_COLORS.filter(color => !find(selectedSurvivalBins, ['color', color]));

        const nextSelectedBins = isSelected
          ? selectedSurvivalBins.filter(s => s.keyName !== bin.displayName)
          : selectedSurvivalBins.concat({
            color: bin.color || availableColors[0],
            keyArray: bin.keyArray,
            keyName: bin.displayName,
          });

        setSelectedSurvivalBins(nextSelectedBins);
        setSelectedSurvivalLoadingIds(nextSelectedBins);

        const nextBinsForPlot = plotTypes === 'categorical'
          ? nextSelectedBins.filter(nextBin => (
            data.find(datum => datum.displayName === nextBin.keyName)
          ))
          : nextSelectedBins
            .map(nextBin => data.find(datum => datum.displayName === nextBin.keyName))
            .map(nextBin => makeDocCountInteger(nextBin));
        updateSurvivalPlot(nextBinsForPlot);

        const survivalDeselectedAndDuplicatesRemoved = uniq(nextSelectedBins
          .filter(filterBin => !(isSelected && filterBin.name === bin.displayName)));

        dispatch(updateClinicalAnalysisVariable({
          fieldName,
          id,
          variable: {
            customSurvivalPlots: survivalDeselectedAndDuplicatesRemoved,
            isSurvivalCustom: true,
            showOverallSurvival: survivalDeselectedAndDuplicatesRemoved.length === 0,
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
        // duplicate props check
        // because this component re-mounts often
        // and withPropsOnChange conditions are ignored on mount
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
