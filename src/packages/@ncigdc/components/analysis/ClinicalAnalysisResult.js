import React from 'react';
import { compose, withState } from 'recompose';
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
  ChevronRight,
  ChevronLeft,
} from '@ncigdc/theme/icons';
import Pencil from '@ncigdc/theme/icons/Pencil';
import CopyIcon from '@ncigdc/theme/icons/Copy';
import Hidden from '@ncigdc/components/Hidden';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { zDepth1 } from '@ncigdc/theme/mixins';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import Dropdown from '@ncigdc/uikit/Dropdown';
import VariableCard from './VariableCard';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Input from '@ncigdc/uikit/Form/Input';
import { withTheme } from '@ncigdc/theme';
import countComponents from '@ncigdc/modern_components/Counts';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import styled from '@ncigdc/theme/styled';
import ControlPanelNode from '@ncigdc/modern_components/IntrospectiveType';
import {
  updateClinicalAnalysisProperty,
  addAnalysis,
} from '@ncigdc/dux/analysis';
import { CLINICAL_PREFIXES } from '@ncigdc/utils/constants';
import withRouter from '@ncigdc/utils/withRouter';
import BaseModal from '@ncigdc/components/Modals/BaseModal';
import { setModal } from '@ncigdc/dux/modal';

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
  icon: theme => ({
    width: 30,
    height: 30,
    ...zDepth1,
  }),
  sectionHeader: {
    fontSize: '2rem',
    paddingLeft: 5,
  },
};

// will need to update with correct type names for molecular and follow-up
const clinicalTypes = Object.keys(CLINICAL_PREFIXES).filter(
  clinicalType =>
    clinicalType !== 'Molecular_test' && clinicalType !== 'Treatment'
);

const plotTypes = {
  categorical: ['histogram', 'survival'],
  continuous: ['histogram', 'survival', 'box'],
};

const ChevronLeftIcon = styled(ChevronLeft, {
  fontSize: '2rem',
  fontWeight: 'lighter',
  padding: 10,
  ':hover::before': {
    textShadow: '0 0 25px rgba(0, 66,	107, 1)',
  },
});

const ChevronRightIcon = styled(ChevronRight, {
  fontSize: '2rem',
  fontWeight: 'lighter',
  padding: 10,
  ':hover::before': {
    textShadow: '0 0 25px rgba(0, 66,	107, 1)',
  },
});

const CopyAnalysisModal = compose(
  withState('modalInputValue', 'setModalInputValue', '')
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
          placeholder={`${analysis.name} copy`}
          onChange={e => setModalInputValue(e.target.value)}
          style={{ borderRadius: '4px' }}
          autoFocus
        />
      </Row>
    </BaseModal>
  );
});

const enhance = compose(
  connect((state: any) => ({ allSets: state.sets, analysis: state.analysis })),
  withState('controlPanelExpanded', 'setControlPanelExpanded', true),
  withState('editingAnalysisName', 'setEditingAnalysisName', false),
  withState('editedAnalysisName', 'setEditedAnalysisName', ''),
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
  analysis,
  editingAnalysisName,
  setEditingAnalysisName,
  editedAnalysisName,
  setEditedAnalysisName,
  push,
  ...props
}: IAnalysisResultProps) => {
  const currentAnalysis = analysis.saved.find(a => a.id === id);
  const setName = Object.values(sets.case)[0];
  const setId = Object.keys(currentAnalysis.sets.case)[0];

  const CountComponent = countComponents.case;
  const dropdownItems = Object.values(allSets.case)
    .filter(s => s !== Object.values(currentAnalysis.sets.case)[0])
    .map((n: any) => (
      <DropdownItem
        key={n}
        className="all-sets-item"
        onClick={() => console.log(n)}
        aria-label={`Switch selected set to ${n}`}
      >
        {n}
      </DropdownItem>
    ));

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
            <Row style={{ alignItems: 'center' }}>
              {!editingAnalysisName && (
                <h1 style={{ fontSize: '2.5rem', margin: 5 }}>
                  {currentAnalysis.name}{' '}
                </h1>
              )}
              {editingAnalysisName && (
                <div style={{ width: '70%', borderRadius: '4px', margin: 5 }}>
                  <label htmlFor={'analysis-name'}>
                    <Hidden>{currentAnalysis.name}</Hidden>
                  </label>
                  <Input
                    id={'analysis-name'}
                    name={'analysis-name'}
                    className="analysis-name-input"
                    onChange={e => {
                      const value = e.target.value;
                      setEditedAnalysisName(value);
                    }}
                    onBlur={e => {
                      if (e.target.value.length) {
                        dispatch(
                          updateClinicalAnalysisProperty({
                            value: _.trim(e.target.value),
                            property: 'name',
                            id,
                          })
                        );
                      }
                      setEditingAnalysisName(false);
                    }}
                    onKeyDown={e => {
                      if (e.target.value.length && e.key === 'Enter') {
                        dispatch(
                          updateClinicalAnalysisProperty({
                            value: _.trim(e.target.value),
                            property: 'name',
                            id,
                          })
                        );
                        setEditingAnalysisName(false);
                      }
                    }}
                    placeholder={currentAnalysis.name}
                    value={editedAnalysisName}
                    autoFocus
                  />
                </div>
              )}
              {!editingAnalysisName && (
                <Tooltip Component={'Edit Analysis Name'}>
                  <Pencil
                    style={{
                      marginLeft: 10,
                      fontSize: '2.5rem',
                      cursor: 'pointer',
                    }}
                    onClick={() => setEditingAnalysisName(true)}
                  />
                </Tooltip>
              )}
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
              <ChevronRightIcon
                onClick={() => setControlPanelExpanded(!controlPanelExpanded)}
              />
            </Tooltip>
          </Column>
        )}
        {controlPanelExpanded && (
          <Column style={{ ...zDepth1, flex: 1, minWidth: 260 }}>
            <Row style={{ justifyContent: 'flex-end' }}>
              <Tooltip Component={'Hide Control Panel'}>
                <ChevronLeftIcon
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
                  width: 160,
                  justifyContent: 'flex-start',
                  marginRight: 10,
                }}
                button={
                  <Button
                    style={{
                      ...visualizingButton,
                      padding: '0 6px',
                      width: '100%',
                    }}
                    rightIcon={<DownCaretIcon />}
                  >
                    {_.truncate(setName, { length: 16 })}
                  </Button>
                }
                dropdownStyle={{ width: '100%' }}
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
              {clinicalTypes.map(clinicalType => (
                <ControlPanelNode
                  key={clinicalType}
                  name={clinicalType}
                  analysis_id={id}
                />
              ))}
            </Column>
          </Column>
        )}
        <Column style={{ flex: 4 }}>
          <Column
            style={{
              ...zDepth1,
              margin: '0 1rem 1rem',
              height: 300,
              padding: 5,
            }}
          >
            <h2 style={styles.sectionHeader}>Survival Analysis</h2>
            <Row style={{ justifyContent: 'space-around' }}>
              <Column style={{ width: '47%' }}>
                <div>Overall Survival</div>
                <div
                  style={{
                    margin: 5,
                    height: 200,
                    backgroundColor: theme.greyScale5,
                  }}
                />
              </Column>
              <Column style={{ width: '47%' }}>
                <div>Progression Free Survival</div>
                <div
                  style={{
                    margin: 5,
                    height: 200,
                    backgroundColor: theme.greyScale5,
                  }}
                />
              </Column>
            </Row>
          </Column>
          <Column>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: controlPanelExpanded
                  ? '50% 50%'
                  : '33.33% 33.33% 33.33%',
                gridTemplateRows: 'repeat(200)',
              }}
            >
              {' '}
              {_.map(variables, (varProperties, varFieldname) => {
                return (
                  <VariableCard
                    key={varFieldname}
                    variable={varProperties}
                    data={[]}
                    plots={plotTypes[varProperties.plotTypes || 'categorical']}
                    variableHeadings={[]}
                    actions={['survival', 'bar_chart', 'delete']}
                    style={{ minWidth: controlPanelExpanded ? 310 : 290 }}
                    id={id}
                  />
                );
              })}
            </div>
          </Column>
        </Column>
      </Row>
    </div>
  );
};

export default enhance(ClinicalAnalysisResult);
