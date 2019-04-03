import React from 'react';
import { compose, withState, withPropsOnChange, withProps } from 'recompose';
import { connect } from 'react-redux';
import SearchIcon from 'react-icons/lib/fa/search';
import DownCaretIcon from 'react-icons/lib/fa/caret-down';
import _ from 'lodash';

import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import {
  DownloadIcon,
  CloseIcon,
  SurvivalIcon,
  BarChartIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@ncigdc/theme/icons';
import CopyIcon from '@ncigdc/theme/icons/Copy';
import Hidden from '@ncigdc/components/Hidden';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { zDepth1 } from '@ncigdc/theme/mixins';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import Dropdown from '@ncigdc/uikit/Dropdown';
import ClinicalVariableCard from './ClinicalVariableCard.js';
import ContinuousAggregation from './ContinuousAggregationQuery';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Input from '@ncigdc/uikit/Form/Input';
import { withTheme } from '@ncigdc/theme';
import countComponents from '@ncigdc/modern_components/Counts';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import ControlPanelNode from './ControlPanelNode.js';
import {
  updateClinicalAnalysisProperty,
  addAnalysis,
  updateClinicalAnalysisSet,
} from '@ncigdc/dux/analysis';
import withRouter from '@ncigdc/utils/withRouter';
import BaseModal from '@ncigdc/components/Modals/BaseModal';
import { setModal } from '@ncigdc/dux/modal';
import EditableLabel from '@ncigdc/uikit/EditableLabel';
import tryParseJSON from '@ncigdc/utils/tryParseJSON';
import getUsefulFacets from '@ncigdc/utils/getUsefulFacets';

// survival plot
import { getDefaultCurve, enoughData } from '@ncigdc/utils/survivalplot';
import SurvivalPlotWrapper from '@ncigdc/components/SurvivalPlotWrapper';

interface IAnalysisResultProps {
  sets: any;
  config: any;
  label: string;
  Icon: () => React.Component<any>;
  analysis: any;
}
//
// interface ISavedSet {
//   id: string;
//   sets: any;
//   type: string;
//   created: string;
//   message?: string;
//   config: any;
// }
// interface IState {
//   saved: ISavedSet[];
// }

const styles = {
  searchIcon: theme => ({
    backgroundColor: theme.greyScale5,
    color: theme.greyScale2,
    padding: '0.8rem',
    width: '3.4rem',
    height: '3.4rem',
    borderRadius: '4px 0 0 4px',
    border: `1px solid ${theme.greyScale4}`,
    borderRight: 'none',
  }),
  collapseIcon: {
    fontSize: '2rem',
    padding: 10,
    cursor: 'pointer',
  },
  sectionHeader: {
    fontSize: '2rem',
    paddingLeft: 5,
  },
};

const plotTypes = {
  categorical: ['histogram', 'survival'],
  continuous: ['histogram', 'survival', 'box'],
};

const CopyAnalysisModal = compose(
  withState(
    'modalInputValue',
    'setModalInputValue',
    ({ analysis }) => `${analysis.name} copy`
  )
)(({ analysis, modalInputValue, setModalInputValue, dispatch, push }) => {
  return (
    <BaseModal
      title={'Copy Analysis'}
      onClose={() => {
        const created = new Date().toISOString();
        const id = created;
        dispatch(
          addAnalysis({
            ...analysis,
            id,
            created,
            name: modalInputValue,
          })
        ).then(() => {
          push({
            query: {
              analysisTableTab: 'result',
              analysisId: id,
            },
          });
        });
      }}
      extraButtons={
        <Button onClick={() => dispatch(setModal(null))}>Cancel</Button>
      }
    >
      <Row style={{ marginBottom: 10 }}>
        Please enter a name for the new analysis.
      </Row>
      <Row>
        <label htmlFor={'copy-analysis-input'}>
          <Hidden>{modalInputValue}</Hidden>
        </label>
        <Input
          id={'copy-analysis-input'}
          value={modalInputValue}
          onChange={e => setModalInputValue(e.target.value)}
          style={{ borderRadius: '4px' }}
          autoFocus
          onFocus={e => e.target.select()}
        />
      </Row>
    </BaseModal>
  );
});

const enhance = compose(
  connect((state: any, props: any) => ({
    allSets: state.sets,
    currentAnalysis: state.analysis.saved.find(a => a.id === props.id),
  })),
  withState('controlPanelExpanded', 'setControlPanelExpanded', true),
  withState('overallSurvivalData', 'setOverallSurvivalData', {}),
  withState('survivalPlotLoading', 'setSurvivalPlotLoading', true),
  withPropsOnChange(
    ['viewer'],
    ({
      viewer: {
        explore: {
          cases: { facets, hits },
        },
      },
    }) => ({
      parsedFacets: facets ? tryParseJSON(facets) : {},
      hits,
    })
  ),
  withProps(
    ({
      setOverallSurvivalData,
      currentAnalysis,
      setState,
      setSurvivalPlotLoading,
    }) => ({
      populateSurvivalData: async () => {
        setSurvivalPlotLoading(true);
        const setId = Object.keys(currentAnalysis.sets.case)[0];
        const analysisFilters = {
          op: 'and',
          content: [
            {
              op: '=',
              content: {
                field: `cases.case_id`,
                value: [`set_id:${setId}`],
              },
            },
          ],
        };
        const nextSurvivalData = await getDefaultCurve({
          currentFilters: analysisFilters,
          slug: 'Clinical Analysis',
        });

        setOverallSurvivalData(nextSurvivalData);

        setSurvivalPlotLoading(false);
      },
    })
  ),
  withPropsOnChange(
    ['currentAnalysis'],
    ({ currentAnalysis, populateSurvivalData }) => {
      populateSurvivalData();
    }
  ),
  withTheme,
  withRouter
);

const ClinicalAnalysisResult = ({
  sets,
  Icon,
  label,
  allSets,
  theme,
  controlPanelExpanded,
  setControlPanelExpanded,
  variables,
  id,
  dispatch,
  currentAnalysis,
  push,
  overallSurvivalData,
  populateSurvivalData,
  survivalPlotLoading,
  parsedFacets,
  displayVariables,
  clinicalAnalysisFields,
  hits,
  ...props
}: IAnalysisResultProps) => {
  const setName = Object.values(sets.case)[0];
  const setId = Object.keys(currentAnalysis.sets.case)[0];

  if (hits.total === 0) {
    return (
      <Column style={{ margin: '2rem' }}>
        <Row spacing={'10px'} style={{ alignItems: 'center', width: '80%' }}>
          <Icon style={{ height: 50, width: 50 }} />
          <h1 style={{ fontSize: '2.5rem', margin: 5 }}>Clinical Analysis</h1>
        </Row>
        <Row style={{ marginTop: '1rem', marginLeft: '1rem' }}>
          Analysis is deprecated because {currentAnalysis.name} is a deprecated
          set.
        </Row>
      </Column>
    );
  }

  const CountComponent = countComponents.case;
  const dropdownItems = _.map(allSets.case, (name, setKey) => {
    if (setKey !== _.keys(currentAnalysis.sets.case)[0]) {
      return (
        <DropdownItem
          key={setKey}
          className="all-sets-item"
          onClick={() => {
            dispatch(
              updateClinicalAnalysisSet({ id, setId: setKey, setName: name })
            );
          }}
          aria-label={`Switch selected set to ${name}`}
        >
          {name}
        </DropdownItem>
      );
    }
  });

  return (
    <div style={{ padding: 5 }}>
      <Row
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 10,
        }}
      >
        <Row spacing={'10px'} style={{ alignItems: 'center', width: '80%' }}>
          <Icon style={{ height: 50, width: 50 }} />
          <Column style={{ width: '100%' }}>
            <Row style={{ alignItems: 'center' }} spacing={'5px'}>
              <div style={{ width: '70%' }}>
                <EditableLabel
                  text={currentAnalysis.name}
                  handleSave={value =>
                    dispatch(
                      updateClinicalAnalysisProperty({
                        value: _.trim(value),
                        property: 'name',
                        id,
                      })
                    )
                  }
                  iconStyle={{
                    marginLeft: 10,
                    fontSize: '1.8rem',
                    cursor: 'pointer',
                  }}
                  containerStyle={{ justifyContent: 'flex-start' }}
                >
                  <h1 style={{ fontSize: '2.5rem', margin: 5 }}>
                    {currentAnalysis.name}{' '}
                  </h1>
                </EditableLabel>
              </div>
            </Row>
            <span style={{ margin: '0 0 5px 5px' }}>{label}</span>
          </Column>
        </Row>
        <Row spacing={'5px'}>
          <Button
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
            leftIcon={<CopyIcon />}
          >
            Copy Analysis
          </Button>
          <Tooltip Component={<span>Download</span>}>
            <Button
              style={{ ...visualizingButton, height: '100%' }}
              disabled={false}
            >
              <DownloadIcon />
              <Hidden>Download</Hidden>
            </Button>
          </Tooltip>
        </Row>
      </Row>
      <Row>
        {!controlPanelExpanded && (
          <Column>
            <Tooltip Component={'Show Control Panel'}>
              <DoubleArrowRightIcon
                style={styles.collapseIcon}
                onClick={() => setControlPanelExpanded(!controlPanelExpanded)}
              />
            </Tooltip>
          </Column>
        )}
        {controlPanelExpanded && (
          <Column
            style={{
              ...zDepth1,
              flex: 1,
              minWidth: 260,
              marginBottom: '1rem',
            }}
          >
            <Row style={{ justifyContent: 'flex-end' }}>
              <Tooltip Component={'Hide Control Panel'}>
                <DoubleArrowLeftIcon
                  style={styles.collapseIcon}
                  onClick={() => setControlPanelExpanded(!controlPanelExpanded)}
                />
              </Tooltip>
            </Row>
            <Row
              style={{
                justifyContent: 'space-between',
                padding: '10px 10px 0px',
              }}
            >
              <span style={{ fontWeight: 'bold' }}>Cohort</span>
              <span style={{ fontWeight: 'bold' }}>{`# Cases`}</span>
            </Row>
            <Row
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 10px 15px',
                borderBottom: `1px solid ${theme.greyScale4}`,
              }}
            >
              <Dropdown
                style={{
                  justifyContent: 'flex-start',
                }}
                button={
                  <Button
                    className="cohort-dropdown"
                    style={{
                      ...visualizingButton,
                      padding: '0 6px',
                      width: 140,
                      justifyContent: 'flex-start',
                    }}
                    rightIcon={<DownCaretIcon />}
                    buttonContentStyle={{
                      width: '100%',
                      justifyContent: 'space-between',
                    }}
                  >
                    {_.truncate(setName, { length: 16 })}
                  </Button>
                }
                dropdownStyle={{ left: 0, cursor: 'pointer' }}
              >
                {dropdownItems}
              </Dropdown>
              <ExploreLink
                query={{
                  filters: {
                    op: 'and',
                    content: [
                      {
                        op: '=',
                        content: {
                          field: `cases.case_id`,
                          value: `set_id:${setId}`,
                        },
                      },
                    ],
                  },
                }}
              >
                <CountComponent
                  filters={{
                    op: '=',
                    content: {
                      field: `cases.case_id`,
                      value: `set_id:${setId}`,
                    },
                  }}
                />
              </ExploreLink>
            </Row>
            <Row
              style={{
                height: 30,
                margin: 15,
              }}
            >
              <label htmlFor="search-facets">
                <SearchIcon style={styles.searchIcon(theme)} />
                <Hidden>Search</Hidden>
              </label>
              <Input
                id="search-facets"
                name="search-facets"
                onChange={() => console.log('search')}
                placeholder="Search"
                value={''}
                style={{ borderRadius: '0 4px 4px 0' }}
              />
            </Row>
            <Column style={{ marginTop: 10 }}>
              <ControlPanelNode
                parsedFacets={parsedFacets}
                clinicalAnalysisFields={clinicalAnalysisFields}
                usefulFacets={getUsefulFacets(parsedFacets)}
                currentAnalysis={currentAnalysis}
                analysis_id={id}
              />
            </Column>
          </Column>
        )}
        <Column style={{ flex: 4, minWidth: 0 }}>
          {/* <Column
            style={{
              ...zDepth1,
              margin: '0 1rem 1rem',
              height: 300,
              padding: 5,
            }}
          >
            <h2 style={styles.sectionHeader}>Survival Analysis</h2>
            <Row style={{ justifyContent: 'space-around' }}>
              <Column
                style={{
                  width: '99%',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}
              >
                <div style={{ position: 'absolute', top: 0 }}>
                  Overall Survival
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '0 0 auto',
                    height: 250,
                    margin: '5px 5px 10px',
                  }}
                >
                  <SurvivalPlotWrapper
                    {...overallSurvivalData}
                    height={180}
                    customClass="categorical-survival-plot"
                    survivalPlotLoading={survivalPlotLoading}
                  />
                </div>
              </Column>
            </Row>
          </Column> */}
          <Column
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
                    marginTop: 10,
                    marginBottom: 0,
                  }}
                >
                  Overall Survival
                </h2>
              </div>
              <div
                style={{
                  height: '250px',
                  margin: '5px 5px 10px',
                }}
              >
                <SurvivalPlotWrapper
                  {...overallSurvivalData}
                  height={180}
                  customClass="categorical-survival-plot"
                  survivalPlotLoading={survivalPlotLoading}
                />
              </div>
            </Column>

            {_.map(displayVariables, (varProperties, varFieldName) => {
              const filters = {
                op: 'and',
                content: [
                  {
                    op: '=',
                    content: {
                      field: `cases.case_id`,
                      value: [`set_id:${setId}`],
                    },
                  },
                ],
              };

              if (varProperties.plotTypes === 'continuous') {
                return (
                  <ContinuousAggregation
                    key={varFieldName}
                    fieldName={varFieldName}
                    stats={parsedFacets[varFieldName].stats}
                    hits={hits}
                    filters={filters}
                    variable={varProperties}
                    plots={plotTypes[varProperties.plotTypes || 'categorical']}
                    style={{ minWidth: controlPanelExpanded ? 310 : 290 }}
                    id={id}
                    setId={setId}
                  />
                );
              }
              return (
                <ClinicalVariableCard
                  key={varFieldName}
                  fieldName={varFieldName}
                  variable={varProperties}
                  plots={plotTypes[varProperties.plotTypes || 'categorical']}
                  style={{ minWidth: controlPanelExpanded ? 310 : 290 }}
                  id={id}
                  facetField={varFieldName.replace('cases.', '')}
                  filters={filters}
                  setId={setId}
                  data={{ ...parsedFacets[varFieldName], hits }}
                />
              );
            })}
          </Column>
        </Column>
      </Row>
    </div>
  );
};

export default enhance(ClinicalAnalysisResult);
