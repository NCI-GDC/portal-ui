import React from 'react';
import {
  compose,
  withState,
  withPropsOnChange,
} from 'recompose';
import _ from 'lodash';
import { connect } from 'react-redux';
import { singular } from 'pluralize';
import Toggle from 'react-toggle';
import './reactToggle.css';

import { humanify } from '@ncigdc/utils/string';
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

const getPlotType = field => {
  if (!field || !field.type) {
    return 'categorical';
  }
  // yes NumericAggregations is spelled wrong in the index, will be fixed in 1.21.0
  if (
    field.type.name === 'Float' ||
    field.type.name === 'NumericAggergations' ||
    field.type.name === 'NumericAggregations'
  ) {
    return 'continuous';
  }
  return 'categorical';
};

// will need to add other types as they become available
const clinicalTypeOrder = [
  'demographic',
  'diagnoses',
  'treatments',
  'exposures',
  // 'follow_ups',
];

const parseFieldName = field => field.replace(/__/g, '.');

const defaultDescription = 'No description available';

const styles = {
  category: cTheme => ({
    color: cTheme.primary,
  }),
};

const StyledToggleMoreLink = styled(ToggleMoreLink, {
  margin: '10px 0 1px auto',
});

const ClinicalGrouping = compose(
  connect(),
  withState('collapsed', 'setCollapsed', false),
  withState('showingMore', 'setShowingMore', false)
)(
  ({
    style = {},
    showingMore,
    setShowingMore,
    collapsed,
    setCollapsed,
    analysis_id,
    dispatch,
    children,
    fields,
    name,
    currentAnalysis,
    searchValue,
  }) => {
    return (
      <Column style={{ marginBottom: 2 }}>
        {(searchValue === '' || fields.length > 0) && (
          <Row
            style={{
              alignItems: 'center',
              padding: '0 10px 0 5px',
              backgroundColor: theme.greyScale6,
              position: 'sticky',
              top: 0,
              zIndex: 99,
            }}
            >
            <h3
              onClick={() => setCollapsed(!collapsed)}
              style={{
                ...style,
                margin: '10px 0',
                cursor: 'pointer',
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

        {!collapsed && (
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
                  {'Less...'}
                </StyledToggleMoreLink>
              </Row>
            )}
            {_.orderBy(fields, 'name', 'asc')
              .slice(0, showingMore ? Infinity : MAX_VISIBLE_FACETS)
              .map(
                (field, i) => {
                  const fieldDescription = field.description || defaultDescription;
                  const fieldName = parseFieldName(field.name);
                  const fieldTitle = field.title;
                  const { type } = field;
                  const plotTypes = getPlotType(field);
                  const checked = Object.keys(
                    currentAnalysis.displayVariables
                  ).includes(fieldName);
                  const toggleAction = checked
                    ? removeClinicalAnalysisVariable
                    : addClinicalAnalysisVariable;
                  const queryLower = _.toLower(searchValue);
                  const descLower = _.toLower(fieldDescription);
                  const descMatch =
                    queryLower !== '' && fieldDescription !== defaultDescription
                      ? descLower.match(queryLower) !== null
                      : false;
                  const DescEl = () => (
                    <div
                      style={{
                        maxWidth: '24em',
                        fontSize: '1.3rem',
                        marginBottom: descMatch ? '10px' : '0',
                        fontStyle: descMatch ? 'italic' : 'normal',
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
                        fontSize: '1.4rem',
                        display: 'inline-block',
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
                      onChange={() => {
                        if (!type.name) {
                          return;
                        }
                        dispatch(
                          toggleAction({
                            fieldName,
                            id: analysis_id,
                            fieldType: name,
                            plotTypes,
                            scrollToCard: !checked,
                            color: field.color || currentAnalysis.colorSets[i % currentAnalysis.colorSets.length],
                          })
                        );
                      }}
                      />
                  );
                  return (
                    <Row
                      key={i}
                      style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: `1px solid ${theme.greyScale5}`,
                      }}
                      >
                      <div style={{
                        display: 'flex',
                        width: '100%',
                      }}
                           >
                        <label
                          htmlFor={fieldName}
                          style={{
                            width: '100%',
                            display: 'block',
                            cursor: descMatch ? 'default' : 'pointer',
                          }}
                          >
                          {descMatch ? (
                            <React.Fragment>
                              <div>
                                <TitleEl />
                                {' '}
                                <ToggleEl />
                              </div>
                              <DescEl />
                            </React.Fragment>
                          )
                            : (
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
                }
              )}
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
  }
);

export default compose(
  withTheme,
  withPropsOnChange(
    (props, nextProps) => props.searchValue !== nextProps.searchValue,
    ({ clinicalAnalysisFields, searchValue }) => {
      const filteredFields = clinicalAnalysisFields
        .map(field => ({
          ...field,
          title: humanify({ term: _.last(field.name.split('__')) }),
        }))
        .filter(field => {
          if (searchValue === '') return true;
          const titleLower = _.toLower(field.title);
          const queryLower = _.toLower(searchValue);
          const descLower = _.toLower(field.description);
          const descMatch =
            field.description !== defaultDescription
              ? descLower.match(queryLower) !== null
              : false;
          return descMatch || titleLower.match(queryLower) !== null;
        });
      const groupedByClinicalType = _.groupBy(filteredFields, field => {
        const sections = field.name.split('__');
        return sections.includes('treatments') ? sections[1] : sections[0];
      });

      return { groupedByClinicalType };
    }
  )
)(
  ({
    analysis_id,
    clinicalAnalysisFields,
    currentAnalysis,
    dispatch,
    groupedByClinicalType,
    searchValue,
    theme,
    usefulFacets,
  }) => {
    return (
      <div>
        <Row
          style={{
            padding: '5px 15px 15px',
          }}
          >
          <span>
            {(_.keys(usefulFacets) || []).length}
            {' '}
            of
            {' '}
            {(clinicalAnalysisFields || []).length}
            {' '}
            fields with values
          </span>
        </Row>
        <div
          style={{
            height: '100%',
            maxHeight: 'calc(100vh - 265px)',
            position: 'sticky',
            top: 0,
            overflowY: 'auto',
          }}
          >
          {clinicalTypeOrder.map(clinicalType => {
            const fields = groupedByClinicalType[clinicalType] || [];
            return (
              <ClinicalGrouping
                analysis_id={analysis_id}
                currentAnalysis={currentAnalysis}
                fields={fields}
                key={clinicalType}
                name={_.capitalize(singular(clinicalType))}
                searchValue={searchValue}
                style={styles.category(theme)}
                />
            );
          })}
        </div>
      </div>
    );
  }
);
