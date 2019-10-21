import React from 'react';
import {
  compose,
  lifecycle,
  pure,
  setDisplayName,
  withHandlers,
  withPropsOnChange,
  withState,
} from 'recompose';
import { connect } from 'react-redux';
import {
  isEqual,
  map,
  mapKeys,
  maxBy,
  trim,
} from 'lodash';

import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import CopyIcon from '@ncigdc/theme/icons/Copy';
import Hidden from '@ncigdc/components/Hidden';
import { visualizingButton, zDepth1 } from '@ncigdc/theme/mixins';

import Input from '@ncigdc/uikit/Form/Input';
import {
  updateClinicalAnalysisProperty,
  addAnalysis,
} from '@ncigdc/dux/analysis';
import withRouter from '@ncigdc/utils/withRouter';
import BaseModal from '@ncigdc/components/Modals/BaseModal';
import { setModal } from '@ncigdc/dux/modal';
import EditableLabel from '@ncigdc/uikit/EditableLabel';
import tryParseJSON from '@ncigdc/utils/tryParseJSON';
import { getDefaultCurve } from '@ncigdc/utils/survivalplot';
import SurvivalPlotWrapper from '@ncigdc/components/SurvivalPlotWrapper';
import DeprecatedSetResult from './DeprecatedSetResult';
import {
  getBoxQQDownload,
  getDownloadSlug,
  getDownloadSlugArray,
  getDownloadSvgInfo,
  getHistogramDownload,
  getSurvivalDownload,
  OVERALL_SURVIVAL_SLUG,
  PLOT_TYPES,
} from './helpers';
import './print.css';
import './survivalPlot.css';
import './boxplot.css';
import './qq.css';

import ControlPanel from './ControlPanel';
import ContinuousAggregationQuery from './ContinuousAggregationQuery';
import { CategoricalVariableCard } from './ClinicalVariableCard';
import wrapSvg from '@ncigdc/utils/wrapSvg';

interface IAnalysisResultProps {
  sets: any;
  config: any;
  label: string;
  Icon: () => React.Component<any>;
  analysis: any;
}

const CopyAnalysisModal = compose(
  setDisplayName('EnhancedCopyAnalysisModal'),
  withState(
    'modalInputValue',
    'setModalInputValue',
    ({ analysis }) => `${analysis.name} copy`
  )
)(({
  analysis,
  dispatch,
  modalInputValue,
  push,
  setModalInputValue,
}) => (
  <BaseModal
    extraButtons={
      <Button onClick={() => dispatch(setModal(null))}>Cancel</Button>
      }
    onClose={() => {
      const created = new Date().toISOString();
      const id = created;
      dispatch(
        addAnalysis({
          ...analysis,
          created,
          id,
          name: modalInputValue,
        })
      ).then(() => {
        push({
          query: {
            analysisId: id,
            analysisTableTab: 'result',
          },
        });
      });
    }}
    title="Copy Analysis"
    >
    <Row style={{ marginBottom: 10 }}>
        Please enter a name for the new analysis.
    </Row>
    <Row>
      <label htmlFor="copy-analysis-input">
        <Hidden>{modalInputValue}</Hidden>
      </label>
      <Input
        autoFocus
        id="copy-analysis-input"
        onChange={e => setModalInputValue(e.target.value)}
        onFocus={e => e.target.select()}
        style={{ borderRadius: '4px' }}
        value={modalInputValue}
        />
    </Row>
  </BaseModal>
));

const ClinicalAnalysisResult = ({
  allSets,
  clinicalAnalysisFields,
  controlPanelExpanded,
  currentAnalysis,
  currentAnalysis: { displayVariables },
  dispatch,
  hits,
  Icon,
  id,
  label,
  overallSurvivalData,
  parsedFacets,
  push,
  setControlPanelExpanded,
  setId,
  survivalDataLoading,
}: IAnalysisResultProps) => {
  const downloadSvgInfo = getDownloadSvgInfo(displayVariables);
  return hits.total === 0
    ? (
      <DeprecatedSetResult
        allSets={allSets}
        currentAnalysis={currentAnalysis}
        dispatch={dispatch}
        Icon={Icon}
        />
    )
    : (
      <div style={{ padding: 5 }}>
        <Row
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 10,
          }}
          >
          <Row
            spacing="10px"
            style={{
              alignItems: 'center',
              width: '80%',
            }}
            >
            <Icon
              style={{
                height: 50,
                width: 50,
              }}
              />
            <Column style={{ width: '100%' }}>
              <Row spacing="5px" style={{ alignItems: 'center' }}>
                <div style={{ width: '70%' }}>
                  <EditableLabel
                    containerStyle={{ justifyContent: 'flex-start' }}
                    disabled={currentAnalysis.id === 'demo-clinical_data'}
                    disabledMessage="Editing analysis name is not available in demo mode"
                    handleSave={value => dispatch(
                      updateClinicalAnalysisProperty({
                        id,
                        property: 'name',
                        value: trim(value),
                      })
                    )}
                    iconStyle={{
                      cursor: 'pointer',
                      fontSize: '1.8rem',
                      marginLeft: 10,
                    }}
                    text={currentAnalysis.name}
                    >
                    <h1
                      className="print-w500"
                      style={{
                        fontSize: '2.5rem',
                        margin: 5,
                      }}
                      >
                      {`${currentAnalysis.name} `}
                    </h1>
                  </EditableLabel>
                </div>
              </Row>
              <div
                className="print-w500"
                style={{ margin: '0 0 5px 5px' }}
                >
                {label}
              </div>
            </Column>
          </Row>
          <Row spacing="5px">
            <Button
              leftIcon={<CopyIcon />}
              onClick={() => {
                dispatch(
                  setModal(
                    <CopyAnalysisModal
                      analysis={currentAnalysis}
                      dispatch={dispatch}
                      push={push}
                      />
                  )
                );
              }}
              >
              Copy Analysis
            </Button>
            <DownloadVisualizationButton
              buttonStyle={{
                ...visualizingButton,
                height: '100%',
              }}
              noText
              slug={getDownloadSlugArray(downloadSvgInfo)}
              svg={downloadSvgInfo
                .reduce((acc, {
                  chart, fieldName, slug, type,
                }) => ([
                  ...acc,
                  ...[
                    'box',
                    'histogram',
                    'survival',
                  ].includes(chart) &&
                    [
                      () => wrapSvg(
                      chart === 'box'
                        ? getBoxQQDownload(fieldName, 'Box', type)
                        : chart === 'histogram'
                          ? getHistogramDownload(fieldName)
                          : getSurvivalDownload(slug)
                      ),
                    ],
                  ...chart === 'box' &&
                    [
                      () => wrapSvg(
                        getBoxQQDownload(fieldName, 'QQ', type)
                      ),
                    ],
                ]),
                        [() => wrapSvg(getSurvivalDownload(OVERALL_SURVIVAL_SLUG))])}
              tooltipHTML="Download all images"
              />
          </Row>
        </Row>
        <Row>
          <ControlPanel
            allSets={allSets}
            clinicalAnalysisFields={clinicalAnalysisFields}
            controlPanelExpanded={controlPanelExpanded}
            currentAnalysis={currentAnalysis}
            dispatch={dispatch}
            id={id}
            parsedFacets={parsedFacets}
            setControlPanelExpanded={setControlPanelExpanded}
            setId={setId}
            />

          <Column
            style={{
              flex: 4,
              minWidth: 0,
            }}
            >
            <Column
              className="print-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: controlPanelExpanded
                  ? '50% 50%'
                  : '33% 33% 33%',
                gridTemplateRows: 'repeat(auto)',
                ...(controlPanelExpanded ? {} : { marginLeft: '1%' }),
              }}
              >
              <Column
                className="print-w500"
                style={{
                  ...zDepth1,
                  height: 560,
                  margin: '0 1rem 1rem',
                  padding: '0.5rem 1rem 1rem',
                }}
                >
                <div
                  style={{
                    margin: '5px 0 10px',
                  }}
                  >
                  <h2
                    style={{
                      fontSize: '1.8rem',
                      marginBottom: 0,
                      marginTop: 10,
                    }}
                    >
                    Overall Survival
                  </h2>
                </div>
                <div
                  style={{
                    height: '250px',
                    margin: '5px 2px 10px',
                  }}
                  >
                  <SurvivalPlotWrapper
                    {...overallSurvivalData}
                    height={430}
                    plotType="clinicalOverall"
                    slug={OVERALL_SURVIVAL_SLUG}
                    survivalDataLoading={survivalDataLoading}
                    uniqueClass="clinical-survival-plot"
                    />
                </div>
              </Column>

              {setId && map(displayVariables, (varProperties, varFieldName) => {
                const filters = {
                  content: [
                    {
                      content: {
                        field: 'cases.case_id',
                        value: [`set_id:${setId}`],
                      },
                      op: '=',
                    },
                  ],
                  op: 'and',
                };

                return varProperties.plotTypes === 'continuous'
                  ? (
                    <ContinuousAggregationQuery
                      currentAnalysis={currentAnalysis}
                      fieldName={varFieldName}
                      filters={filters}
                      hits={hits}
                      id={id}
                      key={varFieldName}
                      overallSurvivalData={overallSurvivalData}
                      plots={PLOT_TYPES[varProperties.plotTypes || 'categorical']}
                      setId={setId}
                      stats={parsedFacets[varFieldName].stats}
                      style={{ minWidth: controlPanelExpanded ? 310 : 290 }}
                      variable={varProperties}
                      />
                  )
                  : (
                    <CategoricalVariableCard
                      currentAnalysis={currentAnalysis}
                      data={{
                        ...parsedFacets[varFieldName],
                        hits,
                      }}
                      facetField={varFieldName.replace('cases.', '')}
                      fieldName={varFieldName}
                      filters={filters}
                      id={id}
                      key={varFieldName}
                      overallSurvivalData={overallSurvivalData}
                      plots={PLOT_TYPES[varProperties.plotTypes || 'categorical']}
                      setId={setId}
                      style={{ minWidth: controlPanelExpanded ? 310 : 290 }}
                      variable={varProperties}
                      />
                  );
              })}
            </Column>
          </Column>
        </Row>
      </div>
    );
};

export default compose(
  setDisplayName('EnhancedClinicalAnalysisResult'),
  withRouter,
  connect((state: any, props: any) => ({
    allSets: state.sets,
    currentAnalysis: state.analysis.saved.find(a => a.id === props.id),
  })),
  withState('controlPanelExpanded', 'setControlPanelExpanded', true),
  withState('overallSurvivalData', 'setOverallSurvivalData', {}),
  withState('survivalDataLoading', 'setSurvivalDataLoading', true),
  withState('setId', 'setSetId', ''),
  withPropsOnChange(
    ['viewer'],
    ({
      viewer: {
        explore: {
          cases: { facets, hits },
        },
      },
    }) => ({
      hits,
      parsedFacets: facets ? tryParseJSON(facets) : {},
    })
  ),
  withPropsOnChange(
    ({ currentAnalysis }, {
      currentAnalysis: nextCurrentAnalysis,
      overallSurvivalData,
      survivalDataLoading,
    }) => (
      !isEqual(currentAnalysis, nextCurrentAnalysis) ||
      (Object.keys(overallSurvivalData).length < 1 && !survivalDataLoading)
    ),
    async ({
      currentAnalysis: nextCurrentAnalysis,
      setOverallSurvivalData,
      setSetId,
      setSurvivalDataLoading,
    }) => {
      const setId = Object.keys(nextCurrentAnalysis.sets.case)[0];
      setSetId(setId);
      setSurvivalDataLoading(true);
      const nextSurvivalData = await getDefaultCurve({
        currentFilters: {
          content: [
            {
              content: {
                field: 'cases.case_id',
                value: [`set_id:${setId}`],
              },
              op: '=',
            },
          ],
          op: 'and',
        },
        slug: 'Clinical Analysis',
      });

      setOverallSurvivalData(nextSurvivalData);
      setSurvivalDataLoading(false);
    }
  ),
  withHandlers({
    handleQueryInputChange: ({
      setSearchValue,
    }) => event => setSearchValue(event.target.value),
  }),
  lifecycle({
    shouldComponentUpdate({
      controlPanelExpanded: nextControlPanelExpanded,
      loading: nextLoading,
      populateSurvivalData: nextPopulateSurvivalData,
      survivalDataLoading: nextSurvivalDataLoading,
    }) {
      const {
        controlPanelExpanded,
        loading,
        populateSurvivalData,
        survivalDataLoading,
      } = this.props;

      return !(
        nextControlPanelExpanded === controlPanelExpanded &&
        nextLoading === loading &&
        isEqual(populateSurvivalData, nextPopulateSurvivalData) &&
        nextSurvivalDataLoading === survivalDataLoading
      );
    },
  }),
  pure,
)(ClinicalAnalysisResult);
