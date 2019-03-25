import React from 'react';
import {
  compose,
  branch,
  renderComponent,
  withState,
  withProps,
} from 'recompose';
import _ from 'lodash';
import { connect } from 'react-redux';
import { singular } from 'pluralize';

import { humanify } from '@ncigdc/utils/string';
import { Row, Column } from '@ncigdc/uikit/Flex';
import CollapsibleList from '@ncigdc/uikit/CollapsibleList';
import { theme } from '@ncigdc/theme/index';
import { withTheme } from '@ncigdc/theme';
import styled from '@ncigdc/theme/styled';
import AngleIcon from '@ncigdc/theme/icons/AngleIcon';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import Hidden from '@ncigdc/components/Hidden';
import {
  addClinicalAnalysisVariable,
  removeClinicalAnalysisVariable,
} from '@ncigdc/dux/analysis';
import { ToggleMoreLink } from '@ncigdc/components/Aggregations/TermAggregation';
import withFieldCount from '@ncigdc/modern_components/IntrospectiveType';
import { ExploreCaseFacetCount } from '@ncigdc/modern_components/Counts';
import tryParseJSON from '@ncigdc/utils/tryParseJSON';

import { CLINICAL_BLACKLIST } from '@ncigdc/utils/constants';

const MAX_VISIBLE_FACETS = 5;
const MAX_FIELDS_LENGTH = 20;

const validClinicalTypesRegex = /(demographic)|(diagnoses)|(exposures)|(treatments)|(follow_ups)/;
const blacklistRegex = new RegExp(
  CLINICAL_BLACKLIST.map(item => `(${item})`).join('|')
);

const getPlotType = field => {
  if (!field || !field.type) {
    return 'categorical';
  }
  // yes NumericAggregations is spelled wrong in the index
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

const parseFieldName = field => field.replace(/__/g, '.');

const styles = {
  category: theme => ({
    color: theme.primary,
  }),
};

const StyledToggleMoreLink = styled(ToggleMoreLink, {
  margin: '10px 0 1px auto',
});

const ClinicalGrouping = compose(
  branch(
    ({ fields, name }) => fields.length === 0,
    renderComponent(({ name }) => (
      <Column>
        <div style={{ paddingRight: 10 }}>No fields found for {name}.</div>
      </Column>
    ))
  ),
  connect((state: any, props: any) => ({
    analyses: state.analysis.saved,
  })),
  withState('collapsed', 'setCollapsed', false),
  withState('showingMore', 'setShowingMore', false)
)(
  ({
    style = {},
    showingMore,
    setShowingMore,
    collapsed,
    setCollapsed,
    analyses,
    analysis_id,
    dispatch,
    children,
    fields,
    name,
  }) => {
    const currentAnalysis = analyses.find(a => a.id === analysis_id);
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
              .map(field => ({
                fieldDescription:
                  field.description || 'No description available',
                fieldName: parseFieldName(field.name),
                type: field.type,
                plotTypes: getPlotType(field),
              }))
              .map(({ fieldDescription, fieldName, type, plotTypes }, i) => {
                const checked = Object.keys(currentAnalysis.variables).includes(
                  fieldName
                );
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
                    <Row style={{ alignItems: 'center' }}>
                      <Tooltip
                        Component={
                          <div style={{ maxWidth: '24em' }}>
                            {fieldDescription}
                          </div>
                        }
                      >
                        <h4 style={{ fontSize: '1.4rem' }}>
                          {humanify({ term: _.last(fieldName.split('.')) })}
                        </h4>
                      </Tooltip>
                    </Row>
                    <FacetCheckbox
                      fieldName={fieldName}
                      analysis_id={analysis_id}
                      fieldType={name}
                      disabled={!type.name}
                      plotTypes={plotTypes}
                      checked={checked}
                      toggleAction={toggleAction}
                      dispatch={dispatch}
                    />
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
            {fields.length === 0 && <Row>No fields found</Row>}
          </Column>
        )}
      </Column>
    );
  }
);

const FacetCheckbox = ({
  fieldName,
  dispatch,
  analysis_id,
  fieldType,
  analyses,
  disabled,
  plotTypes,
  checked,
  toggleAction,
}) => (
  <div
    onClick={() => {
      if (disabled) {
        return null;
      }
      dispatch(
        toggleAction({ fieldName, id: analysis_id, fieldType, plotTypes })
      );
    }}
  >
    <label htmlFor={fieldName}>
      <Hidden>{fieldName}</Hidden>
    </label>
    <input
      readOnly
      type="checkbox"
      style={{
        pointerEvents: 'none',
        flexShrink: 0,
        verticalAlign: 'middle',
      }}
      disabled={disabled}
      name={fieldName}
      aria-label={fieldName}
      checked={checked}
    />
  </div>
);

export default compose(
  withProps(({ __type: { fields, name } }) => {
    const filteredFields = _.head(
      fields.filter(field => field.name === 'aggregations')
    ).type.fields;

    const clinicalAnalysisFields = filteredFields
      .filter(field => validClinicalTypesRegex.test(field.name))
      .filter(field => !blacklistRegex.test(field.name));
    return { clinicalAnalysisFields };
  }),
  withTheme
)(
  ({
    theme,
    analyses,
    analysis_id,
    dispatch,
    clinicalAnalysisFields,
    filters,
  }) => {
    let groupedByClinicalType = _.groupBy(clinicalAnalysisFields, field => {
      const sections = field.name.split('__');
      if (sections.includes('treatments')) {
        return sections[1];
      } else {
        return sections[0];
      }
    });

    // will need to add other types as they become available
    const clinicalTypeOrder = [
      'demographic',
      'diagnoses',
      'treatments',
      'exposures',
      // 'follow_ups',
    ];

    const facetsForCount = clinicalAnalysisFields
      .map(field => field.name.replace('__', '.'))
      .join(',');

    return (
      <div>
        <ExploreCaseFacetCount facets={facetsForCount} filters={filters}>
          {facets => {
            const parsedFacets = facets ? tryParseJSON(facets) : {};
            const usefulFacets = _.omitBy(
              parsedFacets,
              aggregation =>
                !aggregation ||
                _.some([
                  // aggregation.buckets &&
                  //   aggregation.buckets.filter(
                  //     bucket => bucket.key !== '_missing'
                  //   ).length === 0,
                  aggregation.count === 0,
                  aggregation.count === null,
                  aggregation.stats && aggregation.stats.count === 0,
                ])
            );
            return (
              <Row
                style={{
                  padding: '5px 15px 15px',
                }}
              >
                <span>
                  {!_.isEmpty(usefulFacets)
                    ? (_.keys(usefulFacets) || []).length
                    : 'Loading...'}{' '}
                  of {(clinicalAnalysisFields || []).length} fields with values
                </span>
              </Row>
            );
          }}
        </ExploreCaseFacetCount>
        {clinicalTypeOrder.map(clinicalType => {
          const fields = groupedByClinicalType[clinicalType] || [];
          return (
            <ClinicalGrouping
              key={clinicalType}
              name={_.capitalize(singular(clinicalType))}
              style={styles.category(theme)}
              fields={fields}
              analysis_id={analysis_id}
            />
          );
        })}
      </div>
    );
  }
);
