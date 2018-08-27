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

const BoxButton = ({ label, color, onChange, checked }) => {
  return (
    <div
      onClick={onChange}
      style={{ flexDirection: 'row', justifyContent: 'space-between' }}
    >
      <div
        style={{
          height: 15,
          width: 15,
          backgroundColor: checked ? color : 'white',
          border: '1px solid darkgray',
          cursor: 'pointer',
        }}
      />
      <label>{label}</label>
    </div>
  );
};

export const ToggleSwatchLegend = ({
  colorMap,
  toggledConsequences,
  toggleConsequence,
}) => {
  const labels = _.map(colorMap, (color, key) => (
    <div style={styles.cell} key={key}>
      <BoxButton
        label={key.replace(/_/g, ' ').replace(/variant/g, '')}
        onChange={() => toggleConsequence(key)}
        checked={toggledConsequences.includes(key)}
        aria-label={key}
        color={color}
      />
      {/* <input
        type="checkbox"
        id={key}
        name={key}
        aria-label={key}
        checked={toggledConsequences.includes(key)}
        onChange={() => toggleConsequence(key)}
      />
      <span>{key.replace(/_/g, ' ').replace(/variant/g, '')}</span> */}
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

export default {
  StepLegend,
  SwatchLegend,
  ToggleSwatchLegend,
};
