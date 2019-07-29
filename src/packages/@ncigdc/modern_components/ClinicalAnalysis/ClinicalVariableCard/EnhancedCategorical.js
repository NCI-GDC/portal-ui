import React, { Fragment } from 'react';
import {
  compose,
  setDisplayName,
  withProps,
  withPropsOnChange,
} from 'recompose';
import { connect } from 'react-redux';
import {
  get,
  groupBy,
  isEmpty,
  isEqual,
  map,
  reduce,
} from 'lodash';

import { makeFilter } from '@ncigdc/utils/filters';

import { setModal } from '@ncigdc/dux/modal';
import GroupValuesModal from '@ncigdc/components/Modals/GroupValuesModal';

import {
  getSurvivalCurvesArray,
  MAXIMUM_CURVES,
  MINIMUM_CASES,
} from '@ncigdc/utils/survivalplot';
import '../survivalPlot.css';
import { withTheme } from '@ncigdc/theme';

import {
  createFacetFieldString,
} from '@ncigdc/utils/string';

import { IS_CDAVE_DEV } from '@ncigdc/utils/constants';
import RecomposeUtils, {
  dataDimensions,
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
      variable,
    }) => ({
      binData: map(groupBy(variable.bins, bin => bin.groupName), (values, key) => ({
        doc_count: values.reduce((acc, value) => acc + value.doc_count, 0),
        key,
        keyArray: values.reduce((acc, value) => acc.concat(value.key), []),
      })).filter(bin => bin.key),
      bucketsOrganizedByKey: dataBuckets
        .reduce((acc, bucket) => Object.assign(
          {},
          acc,
          {
            [bucket.key]: Object.assign(
              {},
              bucket,
              {
                groupName: bucket.groupName !== undefined &&
                bucket.groupName !== ''
                ? bucket.groupName
                : bucket.key,
              }
            ),
          }
        ), {}),
    })
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
    // SAME
    (props, nextProps) => props.variable.active_chart !== nextProps.variable.active_chart ||
      !isEqual(props.data, nextProps.data) ||
      !isEqual(props.variable.bins, nextProps.variable.bins),
    ({ populateSurvivalData, variable }) => {
      if (variable.active_chart === 'survival') {
        populateSurvivalData();
      }
    }
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
)(EnhancedShared);
