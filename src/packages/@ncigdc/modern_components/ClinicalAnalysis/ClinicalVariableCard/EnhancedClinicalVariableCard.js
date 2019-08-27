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
} from '@ncigdc/utils/survivalplot';
import { withTheme } from '@ncigdc/theme';

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
  withState('showOverallSurvival', 'setShowOverallSurvival', false),
  withState('survivalPlotLoading', 'setSurvivalPlotLoading', true),
  withProps(({
    fieldName,
    filters,
    setSelectedSurvivalData,
    setSelectedSurvivalLoadingIds,
    setSurvivalPlotLoading,
    variable: { plotTypes },
  }) => ({
    updateSurvivalPlot: values => getSurvivalCurvesArray({
      currentFilters: filters,
      field: fieldName,
      plotType: plotTypes,
      values,
    }).then(data => {
      setSelectedSurvivalData(data);
      setSurvivalPlotLoading(false);
      setSelectedSurvivalLoadingIds([]);
    }),
  })),
  withPropsOnChange((props, nextProps) => 
    !isEqual(props.variable.customSurvivalPlots, nextProps.variable.customSurvivalPlots) ||
    !isEqual(props.selectedSurvivalBins, nextProps.selectedSurvivalBins) ||
    props.variable.setId === nextProps.variable.setId ||
    !isEqual(props.survivalPlotValues, nextProps.survivalPlotValues ||
    !isEqual(props.variable.customSurvivalPlots, nextProps.variable.customSurvivalPlots)),
    ({
      dispatchUpdateClinicalVariable,
      selectedSurvivalBins,
      setSelectedSurvivalBins,
      setSelectedSurvivalLoadingIds,
      setShowOverallSurvival,
      setSurvivalPlotLoading,
      survivalPlotValues,
      survivalTableValues,
      updateSurvivalPlot,
      variable: { 
        customSurvivalPlots, 
        plotTypes, 
        isSurvivalCustom,
      },
    }) => ({
      populateSurvivalData: () => {
        setSurvivalPlotLoading(true);
        setSelectedSurvivalBins(survivalTableValues);
        setSelectedSurvivalLoadingIds(survivalTableValues);
        updateSurvivalPlot(survivalPlotValues);
      },
      updateSelectedSurvivalBins: (data, bin) => {
        console.log('updateSelectedSurvivalBins');
        console.log('TESTING TESTING TESTING');
        if (
          selectedSurvivalBins.indexOf(bin.displayName) === -1 &&
          selectedSurvivalBins.length >= MAXIMUM_CURVES
        ) {
          return;
        }
        setSurvivalPlotLoading(true);

        const isSelected = selectedSurvivalBins.indexOf(bin.displayName) >= 0;

        const nextSelectedBins = isSelected
          ? selectedSurvivalBins.filter(s => s !== bin.displayName)
          : selectedSurvivalBins.concat(bin.displayName);

        setSelectedSurvivalBins(nextSelectedBins);
        setSelectedSurvivalLoadingIds(nextSelectedBins);

        const nextBinsForPlot = plotTypes === 'categorical'
          ? nextSelectedBins
          : nextSelectedBins
            .map(nextBin => data.filter(datum => datum.displayName === nextBin)[0])
            .map(nextBin => makeDocCountInteger(nextBin));

        updateSurvivalPlot(nextBinsForPlot);

        const survivalDeselectedAndDuplicatesRemoved = uniq(nextSelectedBins
          .filter(filterBin => !(isSelected && filterBin.name === bin.displayName)));

        console.log('------------')
        console.log('data', data)
        console.log('bin', bin)
        console.log('isSelected', isSelected)
        console.log('nextSelectedBins', nextSelectedBins)
        console.log('nextBinsForPlot', nextBinsForPlot);
        console.log('survivalDeselectedAndDuplicatesRemoved', survivalDeselectedAndDuplicatesRemoved);

        dispatchUpdateClinicalVariable({
          value: survivalDeselectedAndDuplicatesRemoved,
          variableKey: 'customSurvivalPlots',
        });
        dispatchUpdateClinicalVariable({
          value: survivalDeselectedAndDuplicatesRemoved.length > 0,
          variableKey: 'isSurvivalCustom',
        });

        if (survivalDeselectedAndDuplicatesRemoved.length === 0) {
          setShowOverallSurvival(true);
        } else {
          setShowOverallSurvival(false);
        }
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
      console.log('update me!');
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
        dispatchUpdateClinicalVariable,
        variable,
        wrapperId,
      } = this.props;
      if (variable.bins === undefined || isEmpty(variable.bins)) {
        dispatchUpdateClinicalVariable({
          value: binsOrganizedByKey,
          variableKey: 'bins',
        });
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
        dispatchUpdateClinicalVariable({
          value: false,
          variableKey: 'scrollToCard',
        });
      }
    },
  })
)(ClinicalVariableCard);
