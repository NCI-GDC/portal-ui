// @flow

import React from 'react';
import styled from '@ncigdc/theme/styled';
import DI from '@ncigdc/theme/icons/Down';
import withToggle from './withToggle';

const DownIcon = styled(DI, {
  paddingLeft: '0.5rem',
  color: ({ theme }) => theme.primaryLight1,
  fontSize: '1.2em',
  transform: ({ isDown }) => `rotate(${isDown ? '0deg' : '90deg'})`,
  transition: '0.3s ease',
});

type TProps = {
  active: boolean,
  toggleActive: Function,
  items: Array<mixed>,
  onToggle?: Function,
};

// the first item in items is used as the toggle
const TogglableUl = (
  { active, toggleActive, items, onToggle = () => {} }: TProps = {},
) => (
  <ul
    style={{
      listStyle: 'none',
      paddingLeft: 0,
      marginBottom: 0,
    }}
  >
    <li
      key="first"
      role="button"
      onClick={() => {
        toggleActive();
        onToggle();
      }}
    >
      {items[0]}
      <DownIcon isDown={active} />
    </li>
    {items.slice(1).map((r, i) => (
      <li key={i} style={{ height: active ? 'auto' : 0, overflow: 'hidden' }}>
        {r}
      </li>
    ))}
  </ul>
);

export default withToggle(TogglableUl);
