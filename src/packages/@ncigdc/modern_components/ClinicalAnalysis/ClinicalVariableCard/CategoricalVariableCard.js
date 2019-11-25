import React from 'react';
import {
  compose,
  setDisplayName,
  withHandlers,
  withProps,
  withPropsOnChange,
} from 'recompose';
import { connect } from 'react-redux';
import {
  find,
  get,
  isEqual,
  reduce,
} from 'lodash';

import { makeFilter } from '@ncigdc/utils/filters';
import { setModal } from '@ncigdc/dux/modal';
import { humanify } from '@ncigdc/utils/string';
import { withTheme } from '@ncigdc/theme';
import { updateClinicalAnalysisVariable } from '@ncigdc/dux/analysis';
import { SURVIVAL_PLOT_COLORS } from '@ncigdc/utils/survivalplot';
import CategoricalCustomBinsModal from './modals/CategoricalCustomBinsModal';

import {
  cardDefaults,
  dataDimensions,
  filterSurvivalData,
  getRawQueryData,
  makeBinData,
  makeCountLink,
} from './utils/shared';

import EnhancedClinicalVariableCard from './EnhancedClinicalVariableCard';

export default compose(
  setDisplayName('EnhancedCategoricalVariableCard'),
  connect((state: any) => ({ analysis: state.analysis })),
  withTheme,
  flattenProp('variable'),
  withHandlers({
    handleCloseModal: ({ dispatch }) => () => {
      dispatch(setModal(null));
    },
    resetBins: ({
      dataBuckets,
      dispatch,
      fieldName,
      id,
    }) => () => {
      dispatch(updateClinicalAnalysisVariable({
        fieldName,
        id,
        variable: {
          ...cardDefaults.survival,
          bins: dataBuckets
            .reduce((acc, bucket) => ({
              ...acc,
              [bucket.key]: {
                ...bucket,
                groupName: bucket.key,
              },
            }), {}),
          customBinsId: '',
          customBinsSetId: '',
        },
      }));
    },
  }),
  withHandlers({
    handleUpdateCustomBins: ({
      dispatch,
      fieldName,
      handleCloseModal,
      id,
      setId,
    }) => newBins => {
      dispatch(updateClinicalAnalysisVariable({
        fieldName,
        id,
        variable: {
          bins: newBins,
          customBinsId: id,
          customBinsSetId: setId,
          ...cardDefaults.survival,
        },
      }));
      handleCloseModal();
    }
  }),
  withHandlers({
    openCustomBinModal: ({
      bins,
      dataBuckets,
      dispatch,
      fieldName,
      handleCloseModal,
      handleUpdateCustomBins,
    }) => () => dispatch(setModal(
      <CategoricalCustomBinsModal
        bins={bins}
        dataBuckets={dataBuckets}
        fieldName={humanify({ term: fieldName })}
        modalStyle={{
          maxWidth: '720px',
          width: '90%',
        }}
        onClose={() => handleCloseModal()}
        onUpdate={e => handleUpdateCustomBins(e)}
        />
    )),
  }),
  withPropsOnChange(
    (props, nextProps) => !isEqual(props.data, nextProps.data),
    ({ data, fieldName }) => {
      const sanitisedId = fieldName.split('.').pop();
      const rawQueryData = getRawQueryData(data, fieldName);
      const dataBuckets = get(rawQueryData, 'buckets', []);
      const totalDocs = get(data, 'hits.total', 0);

      const missingNestedDocCount = totalDocs -
        dataBuckets.reduce((acc, b) => acc + b.doc_count, 0);

      const addMissingDocs = docData => (
        docData.find(bucket => bucket.key === '_missing')
          ? docData.map(dB => {
            if (dB.key === '_missing') {
              return {
                ...dB,
                doc_count: dB.doc_count + missingNestedDocCount,
              };
            }
            return dB;
          })
        : docData.concat({
          doc_count: missingNestedDocCount,
          key: '_missing',
        })
      );
      const newDataBuckets = missingNestedDocCount
        ? addMissingDocs(dataBuckets)
        : dataBuckets;

      return {
        dataBuckets: newDataBuckets.sort((a, b) => b.doc_count - a.doc_count),
        totalDocs,
        wrapperId: `${sanitisedId}-chart`,
        ...dataDimensions[sanitisedId] && {
          axisTitle: dataDimensions[sanitisedId].axisTitle,
          dataDimension: dataDimensions[sanitisedId].unit,
        },
      };
    }
  ),
  withPropsOnChange(
    (props, nextProps) => !isEqual(props.dataBuckets, nextProps.dataBuckets) ||
      props.setId !== nextProps.setId,
    ({
      dataBuckets,
      dispatch,
      fieldName,
      id,
      variable,
    }) => {
      dispatch(updateClinicalAnalysisVariable({
        fieldName,
        id,
        variable: {
          bins: {
            ...reduce(bins, (acc, bin, key) => ({
              ...acc,
              ...(bin.groupName && bin.groupName !== key
                ? {
                  [key]: {
                    doc_count: 0,
                    groupName: bin.groupName,
                    key,
                  },
                }
                : {}),
            }), {}),
            ...dataBuckets.reduce((acc, bucket) => ({
              ...acc,
              [bucket.key]: {
                ...bucket,
                groupName:
                    typeof get(variable, `bins.${bucket.key}.groupName`, undefined) === 'string'
                      // hidden value have groupName '', so check if it is string
                      ? get(variable, `bins.${bucket.key}.groupName`, undefined)
                      : bucket.key,
              },
            }), {}),
          },
        },
      }));
    }
  ),
  withProps(
    ({
      bins,
      dataBuckets,
    }) => makeBinData(bins, dataBuckets)
  ),
  withPropsOnChange(
    (props, nextProps) =>
      nextProps.active_chart === 'survival' &&
    !(isEqual(props.bins, nextProps.bins) &&
    props.active_chart === nextProps.active_chart &&
    isEqual(props.selectedSurvivalPlots, nextProps.selectedSurvivalPlots) &&
    props.setId === nextProps.setId &&
    isEqual(props.customSurvivalPlots, nextProps.customSurvivalPlots) &&
    props.isSurvivalCustom === nextProps.isSurvivalCustom),
    ({
      active_chart,
      binData,
      customSurvivalPlots,
      dispatch,
      fieldName,
      id,
      isSurvivalCustom,
    }) => {
      // prevent survival API requests on mount
      // when a different plot is selected
      if (active_chart !== 'survival') {
        return {
          survivalPlotValues: [],
          survivalTableValues: [],
        };
      }

      const binDataSelected = isSurvivalCustom
        ? binData.filter(bin => {
          return find(customSurvivalPlots, ['keyName', bin.key]);
        })
        : binData;

      const availableColors = SURVIVAL_PLOT_COLORS
        .filter(color => !find(customSurvivalPlots, ['color', color]));

      const survivalBins = filterSurvivalData(
        binDataSelected
          .map((bin, i) => {
            const currentMatch = customSurvivalPlots &&
              customSurvivalPlots.find(plot => plot.keyName === bin.key);
            return {
              ...bin,
              color: currentMatch ? currentMatch.color : availableColors[i],
            };
          })
      )
        .slice(0, isSurvivalCustom ? Infinity : 2);

      const survivalPlotValues = survivalBins.map(bin => ({
        color: bin.color,
        keyArray: bin.keyArray,
        keyName: bin.key,
      }));

      if (isSurvivalCustom) {
        dispatch(updateClinicalAnalysisVariable({
          fieldName,
          id,
          variable: {
            customSurvivalPlots: survivalPlotValues,
          },
        }));
      }

      return {
        survivalPlotValues,
        survivalTableValues: survivalPlotValues,
      };
    }
  ),
  withPropsOnChange(
    (props, nextProps) =>
      !isEqual(props.bins, nextProps.bins),
    ({ bins }) => ({
      binsAreCustom: Object.keys(bins)
        .some(bin => bins[bin].key !== bins[bin].groupName ||
          typeof bins[bin].index === 'number'),
    })
  ),
  withPropsOnChange(
    (props, nextProps) =>
      props.setId !== nextProps.setId,
    ({
      customBinsId,
      customBinsSetId,
      id,
      resetBins,
      setId,
    }) => {
      // call the reset function if you're in the same analysis tab
      // and you change the case set AND bins are custom
      if (customBinsId !== '' &&
        customBinsSetId !== '' &&
        customBinsId === id &&
        customBinsSetId !== setId) {
        resetBins();
      }
    }
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
            .map(bin => {
              const isMissing = bin.key === '_missing';
              return {
                ...bin,
                displayName: isMissing ? 'missing' : bin.key,
                doc_count_link: makeCountLink({
                  doc_count: bin.doc_count,
                  filters: isMissing
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
              };
            }),
    })
  ),
)(EnhancedClinicalVariableCard);
