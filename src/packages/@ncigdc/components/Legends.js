// @flow

import React from 'react';
import _, { mapValues } from 'lodash';
import AngleIcon from '@ncigdc/theme/icons/AngleIcon';
import { Row, Column } from '@ncigdc/uikit/Flex';
import './Legends.css';
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

export const CollapsedLegend = ({
  checkersWithColors,
  checkerStates,
  collapsed,
  setCollapsed,
  setCheckers,
  initalCheckers,
}) => {
  return (
    <Column
      style={{
        backgroundColor: 'white',
        border: '1px solid rgb(186, 186, 186)',
        padding: '13px',
        right: 10,
        top: 10,
        position: 'absolute',
        zIndex: 1,
      }}
    >
      <span
        style={{ cursor: 'pointer', width: '175px' }}
        onClick={setCollapsed}
      >
        <AngleIcon
          style={{
            paddingRight: '0.25rem',
            transform: `rotate(${collapsed ? 0 : 270}deg)`,
          }}
        />
        Legend
      </span>
      {collapsed && (
        <Row>
          <span
            onClick={() => setCheckers(mapValues(initalCheckers, () => true))}
            style={{
              color: 'rgb(27, 103, 145)',
              cursor: 'pointer',
            }}
          >
            Select All
          </span>
          <span>&nbsp;|&nbsp;</span>
          <span
            onClick={() => setCheckers(mapValues(initalCheckers, () => false))}
            style={{
              color: 'rgb(27, 103, 145)',
              cursor: 'pointer',
            }}
          >
            Deselect All
          </span>
        </Row>
      )}
      {collapsed &&
        checkersWithColors.map(f => (
          <label key={f.key}>
            <span
              onClick={() =>
                setCheckers({
                  ...checkerStates,
                  [f.key]: !checkerStates[f.key],
                })}
              style={{
                color: f.color,
                textAlign: 'center',
                border: '2px solid',
                height: '18px',
                width: '18px',
                cursor: 'pointer',
                display: 'inline-block',
                marginRight: '6px',
                marginTop: '3px',
                verticalAlign: 'middle',
                lineHeight: '16px',
              }}
            >
              {checkerStates[f.key] ? '✓' : <span>&nbsp;</span>}
            </span>
            {f.name}
          </label>
        ))}
    </Column>
  );
};

export const ToggleSwatchLegend = ({
  colorMap,
  toggledValues,
  toggle,
  type,
}) => {
  const labels = _.map(colorMap, (color, key) => (
    <Checkbox
      boxStyle={{ alignItems: 'flex-start' }}
      key={key}
      label={key.replace(/_/g, ' ').replace(/variant/g, '')}
      onChange={() => toggle(key)}
      checked={toggledValues && toggledValues.includes(key)}
      aria-label={key}
      color={color}
    />
  ));

  return (
    <Column
      style={{
        width: 350,
        border: '1px solid lightgray',
        borderRadius: '8px',
        padding: 10,
      }}
    >
      <Row style={{ borderBottom: '1px solid lightgray' }}>
        <Column>
          <Checkbox
            label={`Show ${type}`}
            onChange={() => toggle([])}
            checked={true}
            aria-label={type}
            color={type === 'mutations' ? '#2E7D32' : '#64b5f6'}
          />
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
  CollapsedLegend,
};

/* <input
  type="checkbox"
  id={key}
  name={key}
  aria-label={key}
  checked={toggledConsequences.includes(key)}
  onChange={() => toggleConsequence(key)}
/>
<span>{key.replace(/_/g, ' ').replace(/variant/g, '')}</span> */
