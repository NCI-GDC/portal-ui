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

import { CLINICAL_PREFIXES } from '@ncigdc/utils/constants';

const styles = {
  category: theme => ({
    color: theme.primary,
  }),
};

const FacetToggle = ({ name, active, style = {}, collapsed, setCollapsed }) => (
  <Row
    style={{
      justifyContent: 'space-between',
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
    <div>
      <input type="checkbox" checked={active} />
    </div>
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
)(({ fieldName, dispatch, analysis_id, fieldType, analyses }) => {
  const checked =
    _.find(
      analyses.find(a => a.id === analysis_id).variables,
      v => v.fieldName === fieldName
    ) || false;
  return (
    <div
      onClick={() => {
        const toggleAction = checked
          ? removeAnalysisVariable
          : addAnalysisVariable;
        dispatch(toggleAction({ fieldName, id: analysis_id, fieldType }));
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
        disabled={false}
        name={fieldName}
        aria-label={fieldName}
        checked={checked}
      />
    </div>
  );
});

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
  withTheme,
  withState('collapsed', 'setCollapsed', false),
  withState('showingMore', 'setShowingMore', false)
)(
  ({
    __type: { name, fields, description },
    theme,
    showingMore,
    setShowingMore,
    collapsed,
    setCollapsed,
    analyses,
    analysis_id,
    dispatch,
  }) => {
    return (
      <Column>
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
            {_.orderBy(fields, 'name', 'desc')
              .filter(f => !f.type.fields)
              .slice(0, showingMore ? Infinity : 5)
              .map(field => ({
                fieldDescription: field.description,
                fieldName: `${CLINICAL_PREFIXES[name]}.${field.name}`,
              }))
              .map(({ fieldDescription, fieldName }, i) => {
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
                      <h4>
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
                    />
                  </Row>
                );
              })}
            {fields.length > 5 && (
              <Row>
                <ToggleMoreLink onClick={() => setShowingMore(!showingMore)}>
                  {showingMore
                    ? 'Less...'
                    : fields.length - 5 && `${fields.length - 5} More...`}
                </ToggleMoreLink>
              </Row>
            )}
            {fields.length === 0 && <Row>No fields found</Row>}
          </Column>
        )}
      </Column>
    );
  }
);
