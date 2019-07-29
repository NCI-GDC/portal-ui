import React from 'react';
import {
  compose,
  setDisplayName,
  withProps,
  withPropsOnChange,
} from 'recompose';
import { connect } from 'react-redux';
import {
  get,
  isEmpty,
  isEqual,
  reduce,
} from 'lodash';

import { makeFilter } from '@ncigdc/utils/filters';
import { setModal } from '@ncigdc/dux/modal';
import GroupValuesModal from '@ncigdc/components/Modals/GroupValuesModal';
import {
  humanify,
  createFacetFieldString,
} from '@ncigdc/utils/string';
import { IS_CDAVE_DEV } from '@ncigdc/utils/constants';
import { withTheme } from '@ncigdc/theme';
import {
  getSurvivalCurvesArray,
  MAXIMUM_CURVES,
  MINIMUM_CASES,
} from '@ncigdc/utils/survivalplot';

import RecomposeUtils, {
  dataDimensions,
  getBinData,
  getCountLink,
} from './helpers';
import EnhancedShared from './EnhancedShared';

export default compose(
  setDisplayName('EnhancedCategoricalVariableCard'),
  connect((state: any) => ({ analysis: state.analysis })),
  withTheme,
  RecomposeUtils,
  withPropsOnChange(
    (props, nextProps) => !isEqual(props.data, nextProps.data),
    ({ data, fieldName }) => {
      const sanitisedId = fieldName.split('.').pop();
      const rawQueryData = get(data,
        `explore.cases.aggregations.${createFacetFieldString(fieldName)}`, data);

      return Object.assign(
        {
          dataBuckets: get(rawQueryData, 'buckets', []),
          totalDocs: get(data, 'hits.total', 0),
          wrapperId: `${sanitisedId}-chart`,
        },
        dataDimensions[sanitisedId] && {
          axisTitle: dataDimensions[sanitisedId].axisTitle,
          dataDimension: dataDimensions[sanitisedId].unit,
        },
      );
    }
  ),
  withPropsOnChange(
    (props, nextProps) => !isEqual(props.dataBuckets, nextProps.dataBuckets) ||
      props.setId !== nextProps.setId,
    ({
      dataBuckets,
      dispatchUpdateClinicalVariable,
      variable,
    }) => {
      dispatchUpdateClinicalVariable({
        value: Object.assign(
          {},
          reduce(variable.bins, (acc, bin, key) => Object.assign(
            {},
            acc,
            bin.groupName && bin.groupName !== key
              ? {
                [key]: {
                  doc_count: 0,
                  groupName: bin.groupName,
                  key,
                },
              }
              : {}
          ), {}),
          dataBuckets.reduce((acc, bucket) => Object.assign(
            {},
            acc,
            {
              [bucket.key]: Object.assign(
                {},
                bucket,
                {
                  groupName:
                  typeof get(variable, `bins.${bucket.key}.groupName`, undefined) === 'string'
                    // hidden value have groupName '', so check if it is string
                    ? get(variable, `bins.${bucket.key}.groupName`, undefined)
                    : bucket.key,
                },
              ),
            }
          ), {}),
        ),
        variableKey: 'bins',
      });
    }
  ),
  withProps(
    ({
      dataBuckets,
      variable: { bins },
    }) => getBinData(bins, dataBuckets)
  ),
  withProps(
    // SLIGHTLY DIFFERENT
    ({
      binData,
      fieldName,
      filters,
      selectedSurvivalValues,
      setSelectedSurvivalData,
      setSelectedSurvivalLoadingIds,
      setSelectedSurvivalValues,
      setSurvivalPlotLoading,
      variable,
    }) => ({
      populateSurvivalData: () => {
        setSurvivalPlotLoading(true);
        const dataForSurvival = binData
          .filter(bucket => (IS_CDAVE_DEV ? bucket.key : bucket.key !== '_missing'))
          .map(bucket => Object.assign(
            {},
            bucket,
            { chart_doc_count: bucket.doc_count }
          ));

        const filteredData = dataForSurvival
          .filter(x => x.chart_doc_count >= MINIMUM_CASES)
          .filter(x => x.key !== '_missing')
          .sort((a, b) => b.chart_doc_count - a.chart_doc_count);

        const valuesForTable = filteredData.map(d => d.key).slice(0, 2);

        const valuesForPlot = filteredData
          .map(d => d.keyArray).slice(0, 2);

        setSelectedSurvivalValues(valuesForTable);
        setSelectedSurvivalLoadingIds(valuesForTable);

        getSurvivalCurvesArray({
          currentFilters: filters,
          field: fieldName,
          plotType: variable.plotTypes,
          values: valuesForPlot,
        }).then(data => {
          setSelectedSurvivalData(data);
          setSurvivalPlotLoading(false);
          setSelectedSurvivalLoadingIds([]);
        });
      },
      updateSelectedSurvivalValues: (data, value) => {
        if (
          selectedSurvivalValues.indexOf(value.key) === -1 &&
          selectedSurvivalValues.length >= MAXIMUM_CURVES
        ) {
          return;
        }
        setSurvivalPlotLoading(true);

        const nextValues =
          selectedSurvivalValues.indexOf(value.key) === -1
            ? selectedSurvivalValues.concat(value.key)
            : selectedSurvivalValues.filter(s => s !== value.key);

        setSelectedSurvivalValues(nextValues);
        setSelectedSurvivalLoadingIds(nextValues);

        getSurvivalCurvesArray({
          currentFilters: filters,
          field: fieldName,
          plotType: variable.plotTypes,
          values: nextValues,
        }).then(receivedData => {
          setSelectedSurvivalData(receivedData);
          setSurvivalPlotLoading(false);
          setSelectedSurvivalLoadingIds([]);
        });
      },
    })
  ),
  withPropsOnChange(
    (props, nextProps) =>
      !isEqual(props.variable.bins, nextProps.variable.bins),
    ({ variable: { bins } }) => ({
      resetBinsDisabled: Object.keys(bins)
        .filter(bin => bins[bin].key !== bins[bin].groupName)
        .length === 0,
    })
  ),
  withPropsOnChange(
    (props, nextProps) =>
      props.resetBinsDisabled !== nextProps.resetBinsDisabled ||
      !isEqual(props.dataBuckets, nextProps.dataBuckets),
    ({
      dataBuckets,
      dispatchUpdateClinicalVariable,
      resetBinsDisabled,
    }) => ({
      resetBins: () => {
        if (resetBinsDisabled) return;
        dispatchUpdateClinicalVariable({
          value: dataBuckets
            .reduce((acc, bucket) => Object.assign(
              {},
              acc,
              {
                [bucket.key]: Object.assign(
                  {},
                  bucket,
                  { groupName: bucket.key }
                ),
              }
            ), {}),
          variableKey: 'bins',
        });
      },
    })
  ),
  withPropsOnChange(
    (props, nextProps) =>
      !isEqual(props.binData, nextProps.binData),
    ({
      binData, fieldName, setId, totalDocs,
    }) => ({
      displayData: isEmpty(binData)
        ? []
        : binData
          .filter(bucket => (
          IS_CDAVE_DEV
            ? bucket.key
            : bucket.key !== '_missing'
          ))
          .sort((a, b) => b.doc_count - a.doc_count)
          .map(bin => Object.assign(
            {},
            bin,
            {
              chart_doc_count: bin.doc_count,
              doc_count: getCountLink({
                doc_count: bin.doc_count,
                filters:
                bin.key === '_missing'
                  ? {
                    content: [
                      {
                        content: {
                          field: fieldName,
                          value: bin.keyArray,
                        },
                        op: 'IS',
                      },
                      {
                        content: {
                          field: 'cases.case_id',
                          value: `set_id:${setId}`,
                        },
                        op: 'in',
                      },
                    ],
                    op: 'AND',
                  }
                  : makeFilter([
                    {
                      field: 'cases.case_id',
                      value: `set_id:${setId}`,
                    },
                    {
                      field: fieldName,
                      value: bin.keyArray,
                    },
                  ]),
                totalDocs,
              }),
              key: bin.key,
            }
          )),
    })
  ),
  withPropsOnChange(
    (props, nextProps) =>
      !isEqual(props.variable.bins, nextProps.variable.bins) ||
      !isEqual(props.dataBuckets, nextProps.dataBuckets),
    ({
      dataBuckets,
      dispatch,
      dispatchUpdateClinicalAnalysisVariable,
      fieldName,
      variable: { bins },
    }) => ({
      openCustomBinModal: () => dispatch(setModal(
        <GroupValuesModal
          bins={bins}
          dataBuckets={dataBuckets}
          fieldName={humanify({ term: fieldName })}
          modalStyle={{
            maxWidth: '720px',
            width: '90%',
          }}
          onClose={() => dispatch(setModal(null))}
          onUpdate={(newBins) => {
            dispatchUpdateClinicalAnalysisVariable({
              value: newBins,
              variableKey: 'bins',
            });
            dispatch(setModal(null));
          }}
          />
      )),
    })
  )
)(EnhancedShared);
