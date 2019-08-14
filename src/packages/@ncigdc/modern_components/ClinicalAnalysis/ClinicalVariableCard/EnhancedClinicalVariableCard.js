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
  uniqWith,
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
    !isEqual(props.variable.savedSurvivalBins, nextProps.variable.savedSurvivalBins) ||
    !isEqual(props.selectedSurvivalBins, nextProps.selectedSurvivalBins) ||
    props.variable.setId === nextProps.variable.setId, 
    ({
      dispatchUpdateClinicalVariable,
      selectedSurvivalBins,
      setSelectedSurvivalBins,
      setSelectedSurvivalLoadingIds,
      setSurvivalPlotLoading,
      survivalPlotValues,
      survivalTableValues,
      updateSurvivalPlot,
      variable: { plotTypes, savedSurvivalBins },
    }) => ({
      populateSurvivalData: () => {
        console.log('survivalTableValues populate', survivalTableValues);
        setSurvivalPlotLoading(true);
        setSelectedSurvivalBins(survivalTableValues);
        setSelectedSurvivalLoadingIds(survivalTableValues);
        updateSurvivalPlot(survivalPlotValues);
      },
      updateSelectedSurvivalBins: (data, bin) => {
        if (
          selectedSurvivalBins.indexOf(bin.key) === -1 &&
          selectedSurvivalBins.length >= MAXIMUM_CURVES
        ) {
          return;
        }
        setSurvivalPlotLoading(true);

        console.log('bin', bin);
        console.log('data', data);
        console.log('selectedSurvivalBins', selectedSurvivalBins);

        const deselectingBin = selectedSurvivalBins.indexOf(bin.key) >= 0;

        const nextBins = deselectingBin 
          ? selectedSurvivalBins.filter(s => s !== bin.key)
          : selectedSurvivalBins.concat(bin.key);
        console.log('nextBins', nextBins);

        setSelectedSurvivalBins(nextBins);
        setSelectedSurvivalLoadingIds(nextBins);

        const nextBinsForPlot = plotTypes === 'categorical'
          ? nextBins
          : nextBins
            .map(nextBin => data.filter(datum => datum.key === nextBin)[0])
            .map(nextBin => makeDocCountInteger(nextBin));

        updateSurvivalPlot(nextBinsForPlot);

        const nextBinsWithValues = nextBins.map(bin => ({
          name: plotTypes === 'categorical' 
            ? bin 
            : find(data, { key: bin }).groupName,
          values: [].concat((find(data, { key: bin })[
            plotTypes === 'categorical' 
              ? 'keyArray' 
              : 'key'
          ])),
        }));

        const filteredSurvivalBins = savedSurvivalBins
          .filter(savedBin => !(deselectingBin && savedBin.name === bin.key));

        const nextSavedBins = uniqWith(filteredSurvivalBins
          .concat(nextBinsWithValues), isEqual);

        console.log('nextSavedBins', nextSavedBins);

        dispatchUpdateClinicalVariable({
          value: nextSavedBins,
          variableKey: 'savedSurvivalBins',
        });
      },
    })
  ),
  withPropsOnChange(
    (props, nextProps) => nextProps.variable.active_chart === 'survival' &&
      (props.variable.active_chart !== nextProps.variable.active_chart ||
      props.id !== nextProps.id ||
      !isEqual(props.variable.bins, nextProps.variable.bins) ||
      (!isEqual(props.variable.savedSurvivalBins, nextProps.variable.savedSurvivalBins) &&
        nextProps.variable.savedSurvivalBins.length === 0)),
    ({ populateSurvivalData }) => { populateSurvivalData(); }
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
