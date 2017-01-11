import React, { Component, PropTypes } from 'react';
import withToggle from './withToggle';
import theme from '../theme';
import DownIcon from '../theme/icons/Down';

// the first item in items is used as the toggle
const TogglableUl = ({ active, toggleActive, items }) => (
  <ul style={{
    listStyle: 'none',
    paddingLeft: 0,
  }}>
    <li key={items[0]} onClick={() => toggleActive()}>
      {items[0]}
      <DownIcon style={{
        paddingLeft: '0.5rem',
        color: theme.primaryLight1,
        fontSize: '1.5em',
        transform: `rotate(${active ? '0deg' : '90deg'})`,
        transition: '0.3s ease',
      }}
        onClick={() => toggleActive()}
      />
    </li>
    {items.slice(1).map(r => (
      <li key={r} style={{ height: active ? 'auto' : 0, overflow: 'hidden' }}>{r}</li>
    ))}
  </ul>
);

export default withToggle(TogglableUl);
