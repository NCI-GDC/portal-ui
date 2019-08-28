import React from 'react';
import {
  compose,
  setDisplayName,
  withProps,
  withPropsOnChange,
} from 'recompose';
import { connect } from 'react-redux';
import {
  find,
  get,
  isEmpty,
  isEqual,
  reduce,
} from 'lodash';

import { makeFilter } from '@ncigdc/utils/filters';
import { setModal } from '@ncigdc/dux/modal';
import { humanify } from '@ncigdc/utils/string';
import { withTheme } from '@ncigdc/theme';
import CategoricalCustomBinsModal from './modals/CategoricalCustomBinsModal';
import { 
  updateClinicalAnalysisVariable,
  updateClinicalAnalysisVariableMulti,
} from '@ncigdc/dux/analysis';

import {
  dataDimensions,
  filterSurvivalData,
  getBinData,
  getCountLink,
  getRawQueryData,
  resetVariableDefaults,
} from './helpers';
import EnhancedClinicalVariableCard from './EnhancedClinicalVariableCard';
import { MINIMUM_CASES } from '@ncigdc/utils/survivalplot';

export default compose(
  setDisplayName('EnhancedCategoricalVariableCard'),
  connect((state: any) => ({ analysis: state.analysis })),
  withTheme,
  withPropsOnChange(
    (props, nextProps) => !isEqual(props.data, nextProps.data),
    ({ data, fieldName }) => {
      const sanitisedId = fieldName.split('.').pop();
      const rawQueryData = getRawQueryData(data, fieldName);

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
      dispatch, fieldName, id,
      variable,
    }) => {
      dispatch(updateClinicalAnalysisVariable({ fieldName, id,
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
      }));
    }
  ),
  withProps(
    ({
      dataBuckets,
      variable: { bins },
    }) => getBinData(bins, dataBuckets)
  ),
  withPropsOnChange((props, nextProps) =>
  nextProps.variable.active_chart === 'survival' &&
    (!isEqual(props.variable.bins, nextProps.variable.bins) ||
    props.variable.active_chart !== nextProps.variable.active_chart ||
    !isEqual(props.selectedSurvivalBins, nextProps.selectedSurvivalBins) ||
    props.variable.setId !== nextProps.variable.setId ||
    !isEqual(props.variable.customSurvivalPlots, nextProps.variable.customSurvivalPlots) ||
    props.variable.isSurvivalCustom !== nextProps.variable.isSurvivalCustom),
    ({
      binData,
      dispatch, fieldName, id,
      variable: { customSurvivalPlots, isSurvivalCustom },
    }) => {
      const binDataSelected = isSurvivalCustom
        ? binData.filter(bin => customSurvivalPlots.indexOf(bin.key) >= 0)
        : binData;
      
      const survivalBins = filterSurvivalData(
        binDataSelected
          .map(bin => ({
            ...bin,
            chart_doc_count: bin.doc_count,
          }))
        )
        .slice(0, isSurvivalCustom ? Infinity : 2);
      
      const survivalPlotValues = survivalBins.map(bin => bin.keyArray);
      const survivalTableValues = survivalBins.map(bin => bin.key);
      
      if (isSurvivalCustom) {
        dispatch(updateClinicalAnalysisVariable({ fieldName, id,
          value: survivalTableValues,
          variableKey: 'customSurvivalPlots',
        }));
      }

      return { survivalPlotValues, survivalTableValues };
    }
  ),
  withPropsOnChange(
    (props, nextProps) =>
      !isEqual(props.variable.bins, nextProps.variable.bins),
    ({ variable: { bins } }) => ({
      binsAreCustom: Object.keys(bins)
        .some(bin => bins[bin].key !== bins[bin].groupName ||
          typeof bins[bin].index === 'number'),
    })
  ),
  withPropsOnChange(
    (props, nextProps) =>
      props.binsAreCustom !== nextProps.binsAreCustom ||
      !isEqual(props.dataBuckets, nextProps.dataBuckets ||
      props.variable.isSurvivalCustom !== nextProps.variable.isSurvivalCustom),
    ({
      binsAreCustom,
      dataBuckets,
      dispatch, 
      fieldName, 
      id,
      variable: { isSurvivalCustom }
    }) => ({
      resetBins: () => {
        dispatch(updateClinicalAnalysisVariableMulti({
          fieldName,
          id,
          variable: {
            ...binsAreCustom
              ? { 
                bins: dataBuckets
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
                ), {})
              }
              : {},
            ...isSurvivalCustom
              ? {
                customSurvivalPlots: [],
                isSurvivalCustom: false,
                showOverallSurvival: false,
              }
              : {},
        }}));
      },
    })
  ),
  withPropsOnChange(
    (props, nextProps) =>
      !isEqual(props.binData, nextProps.binData),
    ({
      binData, binsAreCustom, fieldName, setId, totalDocs,
    }) => ({
      displayData: binData.length === 1 && 
        binData[0].key === '_missing' && 
        !binsAreCustom 
          ? [] 
          : binData
          .sort((a, b) => b.doc_count - a.doc_count)
          .map(bin => Object.assign(
            {},
            bin,
            {
              chart_doc_count: bin.doc_count,
              displayName: bin.key === '_missing' ? 'Missing' : bin.key,
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
      dispatch, fieldName, id,
      variable: { bins },
    }) => ({
      openCustomBinModal: () => dispatch(setModal(
        <CategoricalCustomBinsModal
          bins={bins}
          dataBuckets={dataBuckets}
          fieldName={humanify({ term: fieldName })}
          modalStyle={{
            maxWidth: '720px',
            width: '90%',
          }}
          onClose={() => dispatch(setModal(null))}
          onUpdate={(newBins) => {
            dispatch(updateClinicalAnalysisVariable({ fieldName, id,
              value: newBins,
              variableKey: 'bins',
            }));
            dispatch(updateClinicalAnalysisVariable({ fieldName, id,
              value: [],
              variableKey: 'customSurvivalPlots'
            }));
            dispatch(updateClinicalAnalysisVariable({ fieldName, id,
              value: false,
              variableKey: 'isSurvivalCustom',
            }));
            dispatch(updateClinicalAnalysisVariable({ fieldName, id,
              value: false,
              variableKey: 'showOverallSurvival',
            }));
            dispatch(setModal(null));
          }}
          />
      )),
    })
  ),
)(EnhancedClinicalVariableCard);
