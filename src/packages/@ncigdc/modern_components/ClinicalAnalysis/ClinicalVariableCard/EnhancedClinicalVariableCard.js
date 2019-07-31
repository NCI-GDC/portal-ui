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
  isEmpty,
  isEqual,
} from 'lodash';

import {
  getSurvivalCurvesArray,
  MAXIMUM_CURVES,
} from '@ncigdc/utils/survivalplot';
import { withTheme } from '@ncigdc/theme';

import ClinicalVariableCard from './ClinicalVariableCard';

export default compose(
  setDisplayName('EnhancedSharedVariableCard'),
  connect((state: any) => ({ analysis: state.analysis })),
  withTheme,
  withState('selectedSurvivalData', 'setSelectedSurvivalData', {}),
  withState('selectedSurvivalBins', 'setSelectedSurvivalBins', []),
  withState('selectedSurvivalLoadingIds', 'setSelectedSurvivalLoadingIds', []),
  withState('survivalPlotLoading', 'setSurvivalPlotLoading', true),
  withState('selectedBins', 'setSelectedBins', []),
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
  withProps(
    ({
      selectedSurvivalBins,
      setSelectedSurvivalBins,
      setSelectedSurvivalLoadingIds,
      setSurvivalPlotLoading,
      survivalPlotValues,
      survivalTableValues,
      updateSurvivalPlot,
    }) => ({
      populateSurvivalData: () => {
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

        const nextBins =
          selectedSurvivalBins.indexOf(bin.key) === -1
            ? selectedSurvivalBins.concat(bin.key)
            : selectedSurvivalBins.filter(s => s !== bin.key);

        setSelectedSurvivalBins(nextBins);
        setSelectedSurvivalLoadingIds(nextBins);

        const binsForPlot = nextBins
          .map(nextBin => data.filter(datum => datum.key === nextBin)[0])
          .map(nextBin => Object.assign({}, nextBin, { doc_count: 0 },));

        updateSurvivalPlot(binsForPlot);
      },
    })
  ),
  withPropsOnChange(
    (props, nextProps) => nextProps.variable.active_chart === 'survival' &&
      (props.variable.active_chart !== nextProps.variable.active_chart ||
      props.id !== nextProps.id ||
      !isEqual(props.variable.bins, nextProps.variable.bins)),
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
      if (variable.scrollToCard === false) return;

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
    },
  })
)(ClinicalVariableCard);
