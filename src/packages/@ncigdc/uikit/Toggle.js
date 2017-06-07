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
  cursor: 'pointer',
});

type TProps = {
  active: boolean,
  toggleActive: Function,
  title: mixed,
  onToggle?: Function,
  children: mixed,
};

// the first item in items is used as the toggle
const TogglableUl = (
  { active, toggleActive, children, title, onToggle = () => {} }: TProps = {},
) => (
  <span>
    <div>
      <span>
        {title}
        <DownIcon
          onClick={() => {
            toggleActive();
            onToggle();
          }}
          isDown={active}
        />
      </span>
    </div>
    {active && children}
  </span>
);

export default withToggle(TogglableUl);
