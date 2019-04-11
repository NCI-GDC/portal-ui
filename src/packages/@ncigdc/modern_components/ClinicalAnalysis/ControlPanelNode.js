import React from 'react';
import {
  compose,
  branch,
  renderComponent,
  withState,
  withProps,
  withPropsOnChange,
} from 'recompose';
import _ from 'lodash';
import { connect } from 'react-redux';
import { singular } from 'pluralize';
import Toggle from 'react-toggle';
import './reactToggle.css';

import { humanify } from '@ncigdc/utils/string';
import { Row, Column } from '@ncigdc/uikit/Flex';
import CollapsibleList from '@ncigdc/uikit/CollapsibleList';
import { theme } from '@ncigdc/theme/index';
import { withTheme } from '@ncigdc/theme';
import styled from '@ncigdc/theme/styled';
import AngleIcon from '@ncigdc/theme/icons/AngleIcon';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import Hidden from '@ncigdc/components/Hidden';
import { internalHighlight } from '@ncigdc/uikit/Highlight';
import {
  addClinicalAnalysisVariable,
  removeClinicalAnalysisVariable,
} from '@ncigdc/dux/analysis';
import { ToggleMoreLink } from '@ncigdc/components/Aggregations/TermAggregation';
import filesTableModel from '@ncigdc/tableModels/filesTableModel';
import { search } from '../BiospecimenCard/utils';

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
  } else {
    return 'categorical';
  }
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
  category: theme => ({
    color: theme.primary,
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
        <Row
          style={{
            alignItems: 'center',
            padding: '0 10px 0 5px',
            backgroundColor: theme.greyScale6,
          }}
        >
          <h3
            style={{ ...style, margin: '10px 0', cursor: 'pointer' }}
            onClick={() => setCollapsed(!collapsed)}
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

        {!collapsed && (
          <Column
            style={{
              padding: '0 10px',
            }}
          >
            {fields.length > MAX_FIELDS_LENGTH &&
              showingMore && (
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
              .map(field => ({
                fieldDescription: field.description || defaultDescription,
                fieldName: parseFieldName(field.name),
                fieldTitle: field.title,
                type: field.type,
                plotTypes: getPlotType(field),
              }))
              .map(
                (
                  { fieldDescription, fieldName, type, fieldTitle, plotTypes },
                  i
                ) => {
                  const checked = Object.keys(
                    currentAnalysis.displayVariables
                  ).includes(fieldName);
                  const toggleAction = checked
                    ? removeClinicalAnalysisVariable
                    : addClinicalAnalysisVariable;
                  return (
                    <Row
                      key={i}
                      style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: `1px solid ${theme.greyScale5}`,
                      }}
                    >
                      <div style={{ display: 'flex', width: '100%' }}>
                        <label
                          htmlFor={fieldName}
                          style={{
                            width: '100%',
                            display: 'block',
                            cursor: 'pointer',
                          }}
                        >
                          <Tooltip
                            Component={
                              <div style={{ maxWidth: '24em' }}>
                                {internalHighlight(
                                  searchValue,
                                  fieldDescription,
                                  {
                                    backgroundColor: '#FFFF00',
                                  }
                                )}
                              </div>
                            }
                          >
                            <h4
                              style={{
                                fontSize: '1.4rem',
                                display: 'inline-block',
                              }}
                            >
                              {internalHighlight(searchValue, fieldTitle, {
                                backgroundColor: '#FFFF00',
                              })}
                            </h4>
                          </Tooltip>
                        </label>
                      </div>
                      <Toggle
                        icons={false}
                        id={fieldName}
                        disabled={!type.name}
                        name={fieldName}
                        checked={checked}
                        onChange={() => {
                          if (!type.name) {
                            return null;
                          }
                          dispatch(
                            toggleAction({
                              fieldName,
                              id: analysis_id,
                              fieldType: name,
                              plotTypes,
                            })
                          );
                        }}
                      />
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
            {fields.length === 0 && <Row>No fields found</Row>}
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
    ({ searchValue, clinicalAnalysisFields }) => {
      const filteredFields = clinicalAnalysisFields
        .map(field => ({
          ...field,
          title: humanify({ term: _.last(field.name.split('__')) }),
        }))
        .filter(field => {
          const titleLower = _.toLower(field.title);
          const queryLower = _.toLower(searchValue);
          const descLower = _.toLower(field.description);
          const descMatch =
            field.description === defaultDescription
              ? false
              : descLower.match(queryLower);
          return descMatch || titleLower.match(queryLower);
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
    theme,
    currentAnalysis,
    dispatch,
    clinicalAnalysisFields,
    usefulFacets,
    analysis_id,
    searchValue,
    groupedByClinicalType,
  }) => {
    return (
      <div>
        <Row
          style={{
            padding: '5px 15px 15px',
          }}
        >
          <span>
            {(_.keys(usefulFacets) || []).length} of{' '}
            {(clinicalAnalysisFields || []).length} fields with values
          </span>
        </Row>
        {clinicalTypeOrder.map(clinicalType => {
          const fields = groupedByClinicalType[clinicalType] || [];
          return (
            <ClinicalGrouping
              key={clinicalType}
              name={_.capitalize(singular(clinicalType))}
              style={styles.category(theme)}
              fields={fields}
              currentAnalysis={currentAnalysis}
              analysis_id={analysis_id}
              searchValue={searchValue}
            />
          );
        })}
      </div>
    );
  }
);
