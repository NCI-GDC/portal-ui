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
      isEqual(props.variable.customSurvivalPlots, nextProps.variable.customSurvivalPlots) &&
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
        // console.log('update values: ', survivalPlotValues);
        // console.log('table values: ', survivalTableValues);
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
            // ...bin,
            color: bin.color || availableColors[0],
            // filters: bin.filters,
            // key: bin.key,
            keyName: bin.displayName,
          });
        // console.log('next selected bins: ', nextSelectedBins);
        setSelectedSurvivalBins(nextSelectedBins);
        setSelectedSurvivalLoadingIds(nextSelectedBins);

        const nextBinsForPlot = plotTypes === 'categorical'
          ? nextSelectedBins.filter(nextBin => (
            data.find(datum => datum.displayName === nextBin.keyName)
          ))
          // ? nextSelectedBins.map(nextBin => data.reduce((acc, item,) => acc.concat(
          //   item.displayName === nextBin ? item.keyArray : []
          // ), []))
          : nextSelectedBins
            // .map(nextBin => data.filter(datum => datum.displayName === nextBin.keyName)[0])
            .map(nextBin => data.find(datum => datum.displayName === nextBin.keyName))
            .map(nextBin => makeDocCountInteger(nextBin));
        // console.log('next bins for plot: ', nextBinsForPlot);
        // debugger;
        // these values go to survival fetch call
        updateSurvivalPlot(nextBinsForPlot);

        const survivalDeselectedAndDuplicatesRemoved = uniq(nextSelectedBins
          .filter(filterBin => !(isSelected && filterBin.name === bin.displayName)));
        // console.log('show overall survival: ', survivalDeselectedAndDuplicatesRemoved.length === 0);
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
    ({ populateSurvivalData }) => {
      populateSurvivalData();
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
