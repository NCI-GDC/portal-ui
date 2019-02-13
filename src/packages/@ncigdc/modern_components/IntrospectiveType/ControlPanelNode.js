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
import QuestionIcon from 'react-icons/lib/fa/question-circle';

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
  addAnalysisVariable,
  removeAnalysisVariable,
} from '@ncigdc/dux/analysis';

import { CLINICAL_PREFIXES, CLINICAL_BLACKLIST } from '@ncigdc/utils/constants';

const MAX_VISIBLE_FACETS = 5;

const getPlotType = field => {
  if (!field || !field.type) {
    return 'categorical';
  }
  if (field.type.name === 'Float') {
    return 'continuous';
  } else {
    return 'categorical';
  }
};

const styles = {
  category: theme => ({
    color: theme.primary,
  }),
};

const FacetToggle = ({ name, style = {}, collapsed, setCollapsed }) => (
  <Row
    style={{
      alignItems: 'center',
      padding: '0 10px 0 5px',
      backgroundColor: theme.greyScale6,
    }}
  >
    <Row style={{ cursor: 'pointer' }} onClick={() => setCollapsed(!collapsed)}>
      <h3 style={{ ...style, margin: '10px 0' }}>
        <AngleIcon
          style={{
            paddingRight: '0.5rem',
            transform: `rotate(${collapsed ? 270 : 0}deg)`,
          }}
        />
        {name}
      </h3>
    </Row>
  </Row>
);

const ToggleMoreLink = styled.div({
  marginLeft: 'auto',
  color: ({ theme }) => theme.greyScale7,
  fontSize: '1.2rem',
  cursor: 'pointer',
  ':link': {
    color: ({ theme }) => theme.greyScale7,
  },
  ':visited': {
    color: ({ theme }) => theme.greyScale7,
  },
});

const FacetCheckbox = compose(
  connect((state: any) => ({
    analyses: state.analysis.saved,
  }))
)(
  ({
    fieldName,
    dispatch,
    analysis_id,
    fieldType,
    analyses,
    disabled,
    plotTypes,
  }) => {
    const checked =
      _.find(
        analyses.find(a => a.id === analysis_id).variables,
        v => v.fieldName === fieldName
      ) || false;
    return (
      <div
        onClick={() => {
          if (disabled) {
            return null;
          }
          const toggleAction = checked
            ? removeAnalysisVariable
            : addAnalysisVariable;
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
  }
);

export default compose(
  branch(
    ({ __type, name }) => !__type,
    renderComponent(({ __type, name }) => (
      <Column>
        <FacetToggle
          name={name}
          active={false}
          setCollapsed={() => null}
          collapsed
        />
        <div style={{ paddingRight: 10 }}>No fields found.</div>
      </Column>
    ))
  ),
  connect((state: any, props: any) => ({
    analyses: state.analysis.saved,
  })),
  withProps(({ __type: { fields, name } }) => ({
    whitelistedFields: fields.filter(
      field => !CLINICAL_BLACKLIST.includes(field.name)
    ),
  })),
  withTheme,
  withState('collapsed', 'setCollapsed', false),
  withState('showingMore', 'setShowingMore', false)
)(
  ({
    __type: { name, description },
    theme,
    showingMore,
    setShowingMore,
    collapsed,
    setCollapsed,
    analyses,
    analysis_id,
    dispatch,
    whitelistedFields,
  }) => {
    return (
      <Column style={{ marginBottom: 2 }}>
        <FacetToggle
          name={_.capitalize(name)}
          style={styles.category(theme)}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        {!collapsed && (
          <Column
            style={{
              padding: '0 10px',
            }}
          >
            {_.orderBy(whitelistedFields, 'name', 'asc')
              .filter(f => !f.type.fields) // filters out nested, like diagnoses.treatments
              .slice(0, showingMore ? Infinity : MAX_VISIBLE_FACETS)
              .map(field => ({
                fieldDescription: field.description,
                fieldName: `${CLINICAL_PREFIXES[name]}.${field.name}`,
                type: field.type,
                plotTypes: getPlotType(field),
              }))
              .map(({ fieldDescription, fieldName, type, plotTypes }, i) => {
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
                      <h4 style={{ fontSize: '1.4rem' }}>
                        {humanify({
                          term: fieldName.replace(
                            `${CLINICAL_PREFIXES[_.capitalize(name)]}.`,
                            ''
                          ),
                        })}
                      </h4>
                      <Tooltip
                        Component={
                          <div style={{ maxWidth: '24em' }}>
                            {fieldDescription}
                          </div>
                        }
                      >
                        <QuestionIcon
                          style={{ color: theme.greyScale7, marginLeft: '5px' }}
                        />
                      </Tooltip>
                    </Row>
                    <FacetCheckbox
                      fieldName={fieldName}
                      dispatch={dispatch}
                      analysis_id={analysis_id}
                      fieldType={name}
                      disabled={!type.name}
                      plotTypes={plotTypes}
                    />
                  </Row>
                );
              })}
            {whitelistedFields.length > MAX_VISIBLE_FACETS && (
              <Row>
                <ToggleMoreLink onClick={() => setShowingMore(!showingMore)}>
                  {showingMore
                    ? 'Less...'
                    : whitelistedFields.length - MAX_VISIBLE_FACETS &&
                      `${whitelistedFields.length - 5} More...`}
                </ToggleMoreLink>
              </Row>
            )}
            {whitelistedFields.length === 0 && <Row>No fields found</Row>}
          </Column>
        )}
      </Column>
    );
  }
);
