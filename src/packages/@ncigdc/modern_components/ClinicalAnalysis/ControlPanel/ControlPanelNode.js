import React from 'react';
import {
  compose,
  lifecycle,
  pure,
  setDisplayName,
  withPropsOnChange,
  withState,
} from 'recompose';
import {
  capitalize,
  groupBy,
  isEqual,
  orderBy,
  toLower,
} from 'lodash';
import { connect } from 'react-redux';
import { singular } from 'pluralize';
import Toggle from 'react-toggle';
import {
  customSorting,
} from '@ncigdc/containers/explore/presetFacets';
import './reactToggle.css';

import { humanify } from '@ncigdc/utils/string';
import termCapitaliser from '@ncigdc/utils/customisation';
import { Row, Column } from '@ncigdc/uikit/Flex';
import { theme, withTheme } from '@ncigdc/theme/index';

import styled from '@ncigdc/theme/styled';
import AngleIcon from '@ncigdc/theme/icons/AngleIcon';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { internalHighlight } from '@ncigdc/uikit/Highlight';
import {
  addClinicalAnalysisVariable,
  removeClinicalAnalysisVariable,
} from '@ncigdc/dux/analysis';
import { ToggleMoreLink } from '@ncigdc/components/Aggregations/TermAggregation';

const MAX_VISIBLE_FACETS = 5;
const MAX_FIELDS_LENGTH = 20;

const getPlotType = field => (
  (!field || !field.type)
    ? 'categorical'
    : ( // yes NumericAggregations is spelled wrong in the index, will be fixed in 1.21.0
      field.type.name === 'Float' ||
      field.type.name === 'NumericAggergations' ||
      field.type.name === 'NumericAggregations'
    )
    ? 'continuous'
    : 'categorical'
);

const parseFieldName = field => field.replace(/__/g, '.');

const defaultDescription = 'No description available';

const styles = {
  category: ({ primary }) => ({
    color: primary,
  }),
};

const StyledToggleMoreLink = styled(ToggleMoreLink, {
  margin: '10px 0 1px auto',
});

const ClinicalGrouping = ({
  analysis_id,
  collapsed,
  currentAnalysis,
  dispatch,
  fields,
  name,
  searchValue,
  setCollapsed,
  setShowingMore,
  showingMore,
  style = {},
}) => (
  <Column style={{ marginBottom: 2 }}>
    {(searchValue === '' || fields.length > 0) && (
      <Row
        style={{
          alignItems: 'center',
          backgroundColor: theme.greyScale6,
          padding: '0 10px 0 5px',
          position: 'sticky',
          top: 0,
          zIndex: 99,
        }}
        >
        <h3
          onClick={() => setCollapsed(!collapsed)}
          style={{
            ...style,
            cursor: 'pointer',
            margin: '10px 0',
          }}
          >
          <AngleIcon
            style={{
              paddingRight: '0.5rem',
              transform: `rotate(${collapsed ? 270 : 0}deg)`,
            }}
            />
          {name}
        </h3>
      </Row>
    )}

    {collapsed || (
      <Column
        style={{
          padding: '0 10px',
        }}
        >
        {fields.length > MAX_FIELDS_LENGTH && showingMore && (
          <Row>
            <StyledToggleMoreLink
              onClick={() => setShowingMore(!showingMore)}
              >
              Less...
            </StyledToggleMoreLink>
          </Row>
        )}

        {orderBy(fields, [(field) => customSorting(field.name.replace(/__/g, '.')), 'name'])
          .slice(0, showingMore ? Infinity : MAX_VISIBLE_FACETS)
          .map(field => ({
            fieldDescription: field.description || defaultDescription,
            fieldName: parseFieldName(field.name),
            fieldTitle: field.title,
            plotTypes: getPlotType(field),
            type: field.type,
          }))
          .map(({
            fieldDescription,
            fieldName,
            fieldTitle,
            plotTypes,
            type,
          }) => {
            const checked = Object.keys(
              currentAnalysis.displayVariables
            ).includes(fieldName);
            const toggleAction = checked
              ? removeClinicalAnalysisVariable
              : addClinicalAnalysisVariable;
            const queryLower = searchValue.toLowerCase();
            const descLower = toLower(fieldDescription);
            const descMatch =
              queryLower !== '' && fieldDescription !== defaultDescription
                ? descLower.match(queryLower) !== null
                : false;
            const DescEl = () => (
              <div
                style={{
                  fontSize: '1.3rem',
                  fontStyle: descMatch ? 'italic' : 'normal',
                  marginBottom: descMatch ? '10px' : '0',
                  maxWidth: '24em',
                }}
                >
                {descMatch
                  ? internalHighlight(searchValue, fieldDescription, {
                    backgroundColor: '#FFFF00',
                  })
                  : fieldDescription}
              </div>
            );
            const TitleEl = () => (
              <h4
                style={{
                  display: 'inline-block',
                  fontSize: '1.4rem',
                  marginRight: '50px',
                }}
                >
                {internalHighlight(searchValue, fieldTitle, {
                  backgroundColor: '#FFFF00',
                })}
              </h4>
            );
            const ToggleEl = () => (
              <Toggle
                checked={checked}
                disabled={!type.name}
                icons={false}
                id={fieldName}
                name={fieldName}
                onChange={() => type.name && dispatch(
                  toggleAction({
                    fieldName,
                    fieldType: name,
                    id: analysis_id,
                    plotTypes,
                    scrollToCard: !checked,
                  })
                )}
                />
            );

            return (
              <Row
                key={fieldName}
                style={{
                  alignItems: 'center',
                  borderBottom: `1px solid ${theme.greyScale5}`,
                  justifyContent: 'space-between',
                }}
                >
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                  }}
                  >
                  <label
                    className={`toggle-wrapper--${name}`}
                    htmlFor={fieldName}
                    style={{
                      width: '100%',
                      display: 'block',
                      cursor: descMatch ? 'default' : 'pointer',
                    }}
                    >
                    {descMatch
                      ? (
                        <React.Fragment>
                          <div>
                            <TitleEl />
                            {' '}
                            <ToggleEl />
                          </div>
                          <DescEl />
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <Tooltip Component={<DescEl />}>
                            <TitleEl />
                          </Tooltip>
                          <ToggleEl />
                        </React.Fragment>
                      )}
                  </label>
                </div>
              </Row>
            );
          })}

        {fields.length > MAX_VISIBLE_FACETS && (
          <Row>
            <StyledToggleMoreLink
              onClick={() => setShowingMore(!showingMore)}
              >
              {showingMore
                ? 'Less...'
                : fields.length - MAX_VISIBLE_FACETS &&
                `${fields.length - 5} More...`}
            </StyledToggleMoreLink>
          </Row>
        )}

        {searchValue === '' &&
          fields.length === 0 && <Row>No fields found</Row>}
      </Column>
    )}
  </Column>
);

const EnhancedClinicalGrouping = compose(
  setDisplayName('EnhancedClinicalGrouping'),
  pure,
  connect(),
  withState('collapsed', 'setCollapsed', false),
  withState('showingMore', 'setShowingMore', false)
)(ClinicalGrouping);

const ControlPanelNode = ({
  analysis_id,
  clinicalAnalysisFields,
  currentAnalysis,
  groupedByClinicalType,
  searchValue,
  usefulFacets,
}) => (
  <React.Fragment>
    <Row
      style={{
        padding: '5px 15px 15px',
      }}
      >
      <span>
        {`${(Object.keys(usefulFacets) || []).length
          } of ${
          (clinicalAnalysisFields || []).length
          } fields with values`}
      </span>
    </Row>
    <div
      style={{
        height: '100%',
        maxHeight: 'calc(100vh - 265px)',
        overflowY: 'auto',
        position: 'sticky',
        top: 0,
      }}
      >
      {[
        'demographic',
        'diagnoses',
        'treatments',
        'exposures',
        // 'follow_ups',
      ].map(clinicalType => (
        <EnhancedClinicalGrouping
          analysis_id={analysis_id}
          currentAnalysis={currentAnalysis}
          fields={groupedByClinicalType[clinicalType] || []}
          key={clinicalType}
          name={capitalize(singular(clinicalType))}
          searchValue={searchValue}
          style={styles.category(theme)}
          />
      ))}
    </div>
  </React.Fragment>
);

export default compose(
  setDisplayName('EnhancedControlPanelNode'),
  pure,
  withTheme,
  withPropsOnChange(
    (props, nextProps) => props.searchValue !== nextProps.searchValue,
    ({ clinicalAnalysisFields, searchValue }) => {
      const filteredFields = clinicalAnalysisFields
        .map(field => ({
          ...field,
          title: humanify({ term: termCapitaliser(field.name).split('__').pop() }),
        }))
        .filter(({
          description,
          title,
        }) => {
          if (searchValue === '') return true;

          const queryLower = searchValue.toLowerCase();
          const titleLower = (title || '').toLowerCase();
          const descLower = (description || '').toLowerCase();
          const descMatch =
            description !== defaultDescription && descLower.match(queryLower) !== null;
          return descMatch || titleLower.match(queryLower) !== null;
        });

      return {
        groupedByClinicalType: groupBy(
          filteredFields,
          ({ name }) => {
            const sections = name.split('__');
            return sections.includes('treatments')
              ? sections[1]
              : sections[0];
          }
        ),
      };
    }
  ),
  lifecycle({
    shouldComponentUpdate({
      currentAnalysis: { displayVariables: nextDisplayVariables },
      searchValue: nextSearchValue,
    }) {
      const {
        currentAnalysis: { displayVariables },
        searchValue: prevSearchValue,
      } = this.props;
      return !(
        isEqual(nextDisplayVariables, displayVariables) &&
        nextSearchValue === prevSearchValue
      );
    },
  }),
)(ControlPanelNode);
