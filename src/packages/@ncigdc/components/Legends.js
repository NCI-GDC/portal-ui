// @flow

import React from 'react';
import _ from 'lodash';

import { Row, Column } from '@ncigdc/uikit/Flex';

const styles = {
  table: {
    fontSize: '1.28rem',
    display: 'inline-flex',
  },
  td: {
    padding: 6,
  },
  cell: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  color: {
    marginRight: 5,
    display: 'inline-block',
    width: 15,
    height: 15,
    verticalAlign: 'middle',
  },
};

export const StepLegend = ({
  steps = [0.25, 0.5, 0.75, 1],
  color = '#D33682',
  leftLabel = 'Less',
  rightLabel = 'More',
}) => (
  <Row style={styles.table}>
    <Column style={styles.td}>{leftLabel}</Column>
    <Row style={styles.td}>
      {steps.map(opacity => (
        <div
          style={{ ...styles.color, background: color, opacity }}
          key={opacity}
        />
      ))}
    </Row>
    <Column style={styles.td}>{rightLabel}</Column>
  </Row>
);

export const SwatchLegend = ({ colorMap }) => {
  const labels = _.map(colorMap, (color, key) => (
    <div style={styles.cell} key={key}>
      <div style={{ ...styles.color, background: color }} />
      <span>{key.replace(/_/g, ' ')}</span>
    </div>
  ));

  return (
    <Row style={styles.table} className="test-legends">
      <Column style={styles.td}>{labels.slice(0, 2)}</Column>
      <Column style={styles.td}>{labels.slice(2, 4)}</Column>
      <Column style={styles.td}>{labels.slice(4, 6)}</Column>
    </Row>
  );
};

const Checkbox = ({ label, color = 'gray', onChange, checked, boxStyle }) => {
  let checkColor = color;

  // TODO: extract to custom Checkbox or find css filter that works for 508 issues
  if (label.includes('loss') || label === 'Show copy number variations') {
    checkColor = '#3973a3';
  }
  if (label === 'gain' || label === 'amplification') {
    checkColor = '#af3d3d';
  }

  return (
    <div style={{ paddingBottom: 10, display: 'flex', alignItems: 'center' }}>
      <div
        onClick={onChange}
        style={{
          height: 20,
          width: 20,
          border: `2px solid ${color}`,
          cursor: 'pointer',
          textAlign: 'center',
          verticalAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ...boxStyle,
        }}
      >
        {checked ? <span style={{ color: checkColor }}>{'✓'}</span> : null}
      </div>
      <label style={{ marginLeft: 5 }}>{label}</label>
    </div>
  );
};

const getCheckBoxColor = ({ type, heatMapMode, color = null }) => {
  if (heatMapMode) return '#D33682';
  if (color) return color;
  return type === 'mutations' ? '#2E7D32' : '#64b5f6';
};

export const ToggleSwatchLegend = ({
  colorMap,
  toggledValues,
  toggle,
  type,
  toggleAll,
  heatMapMode = false,
}) => {
  const labels = _.map(colorMap, (color, key) => (
    <Checkbox
      boxStyle={{ alignItems: 'flex-start' }}
      key={key}
      label={key.replace(/_/g, ' ').replace(/variant/g, '')}
      onChange={() => toggle(key)}
      checked={toggledValues && toggledValues.includes(key)}
      aria-label={key}
      color={getCheckBoxColor({ type, heatMapMode, color })}
    />
  ));

  return (
    <Column
      style={{
        maxWidth: 400,
        border: '1px solid lightgray',
        borderRadius: '8px',
        padding: 10,
      }}
    >
      <Row
        style={{
          borderBottom: '1px solid lightgray',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Column>
          <Checkbox
            label={`Show ${type}`}
            onChange={() => toggleAll(toggledValues.length > 0)}
            checked={toggledValues.length > 0}
            aria-label={type}
            color={getCheckBoxColor({ type, heatMapMode })}
          />
        </Column>
        <Column style={{ marginLeft: 60 }}>
          {heatMapMode && type === 'mutations' && <StepLegend />}
        </Column>
      </Row>
      <Row style={styles.table} className="test-legends">
        <Column style={styles.td}>{labels.slice(0, 2)}</Column>
        <Column style={styles.td}>{labels.slice(2, 4)}</Column>
        <Column style={styles.td}>{labels.slice(4, 6)}</Column>
      </Row>
    </Column>
  );
};

export default {
  StepLegend,
  SwatchLegend,
  ToggleSwatchLegend,
};
