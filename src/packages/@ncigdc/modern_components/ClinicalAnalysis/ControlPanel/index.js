import React from 'react';
import {
  compose,
  lifecycle,
  pure,
  setDisplayName,
  withHandlers,
  withState,
} from 'recompose';
import { isEqual } from 'lodash';

import SearchIcon from 'react-icons/lib/fa/search';

import { Row, Column } from '@ncigdc/uikit/Flex';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@ncigdc/theme/icons';
import Hidden from '@ncigdc/components/Hidden';
import { zDepth1 } from '@ncigdc/theme/mixins';

import Input from '@ncigdc/uikit/Form/Input';
import { withTheme } from '@ncigdc/theme';
import { ExploreCaseCount } from '@ncigdc/modern_components/Counts';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import getUsefulFacets from '@ncigdc/utils/getUsefulFacets';
import CohortDropdown from '../CohortDropdown';
import ControlPanelNode from './ControlPanelNode';

const styles = {
  collapseIcon: {
    cursor: 'pointer',
    fontSize: '2rem',
    padding: 10,
  },
  searchIcon: theme => ({
    backgroundColor: theme.greyScale5,
    border: `1px solid ${theme.greyScale4}`,
    borderRadius: '4px 0 0 4px',
    borderRight: 'none',
    color: theme.greyScale2,
    height: '3.4rem',
    padding: '0.8rem',
    width: '3.4rem',
  }),
  sectionHeader: {
    fontSize: '2rem',
    paddingLeft: 5,
  },
};

const ControlPanel = ({
  allSets,
  clinicalAnalysisFields,
  controlPanelExpanded,
  currentAnalysis,
  dispatch,
  handleQueryInputChange,
  id,
  parsedFacets,
  searchValue,
  setControlPanelExpanded,
  setId,
  theme,
}) => (controlPanelExpanded // REVERT LATER
  ? (
    <Column
      className="no-print"
      style={{
        ...zDepth1,
        alignSelf: 'flex-start',
        flex: 1,
        marginBottom: '1rem',
        maxHeight: 'calc(100vh - 50px',
        minHeight: '560px',
        minWidth: 260,
        overflowY: 'hidden',
        position: 'sticky',
        top: 50,
      }}
      >
      <Row style={{ justifyContent: 'flex-end' }}>
        <Tooltip Component="Hide Control Panel">
          <DoubleArrowLeftIcon
            onClick={() => setControlPanelExpanded(false)}
            style={styles.collapseIcon}
            />
        </Tooltip>
      </Row>
      <Row
        style={{
          justifyContent: 'space-between',
          padding: '0 10px',
        }}
        >
        <span style={{ fontWeight: 'bold' }}>Case Set</span>
        <span style={{ fontWeight: 'bold' }}># Cases</span>
      </Row>

      <Row
        style={{
          alignItems: 'center',
          borderBottom: `1px solid ${theme.greyScale4}`,
          justifyContent: 'space-between',
          padding: '10px 10px 15px',
        }}
        >
        <CohortDropdown
          currentAnalysis={currentAnalysis}
          disabled={currentAnalysis.id === 'demo-clinical_data'}
          disabledMessage="Switching cohorts is not available in demo mode"
          dispatch={dispatch}
          sets={allSets}
          />
        {setId && (
          <ExploreLink
            query={{
              filters: {
                content: [
                  {
                    content: {
                      field: 'cases.case_id',
                      value: `set_id:${setId}`,
                    },
                    op: '=',
                  },
                ],
                op: 'and',
              },
            }}
            >
            <ExploreCaseCount
              filters={{
                content: {
                  field: 'cases.case_id',
                  value: `set_id:${setId}`,
                },
                op: '=',
              }}
              />
          </ExploreLink>
        )}
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
          onChange={handleQueryInputChange}
          placeholder="Search"
          style={{ borderRadius: '0 4px 4px 0' }}
          value={searchValue}
          />
      </Row>

      <Column>
        <ControlPanelNode
          analysis_id={id}
          clinicalAnalysisFields={clinicalAnalysisFields || []}
          currentAnalysis={currentAnalysis}
          searchValue={searchValue}
          usefulFacets={Object.keys(getUsefulFacets(parsedFacets)) || []}
          />
      </Column>
    </Column>
  )
  : (
    <Column>
      <Tooltip Component="Show Control Panel">
        <DoubleArrowRightIcon
          onClick={() => setControlPanelExpanded(true)}
          style={styles.collapseIcon}
          />
      </Tooltip>
    </Column>
  ));

export default compose(
  setDisplayName('EnhancedControlPanel'),
  withTheme,
  // withState('controlPanelExpanded', 'setControlPanelExpanded', true),
  withState('searchValue', 'setSearchValue', ''),
  withHandlers({
    handleQueryInputChange: ({
      setSearchValue,
    }) => event => setSearchValue(event.target.value),
  }),
  lifecycle({
    shouldComponentUpdate({
      controlPanelExpanded: nextControlPanelExpanded,
      currentAnalysis: { displayVariables: nextDisplayVariables },
      searchValue: nextSearchValue,
      setId: nextSetId,
    }) {
      const {
        controlPanelExpanded,
        currentAnalysis: { displayVariables },
        searchValue,
        setId,
      } = this.props;

      return !(
        isEqual(nextDisplayVariables === displayVariables) &&
        nextControlPanelExpanded === controlPanelExpanded &&
        nextSetId === setId &&
        nextSearchValue === searchValue
      );
    },
  }),
  pure,
)(ControlPanel);
