// @flow
import React from 'react';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import UnstyledButton from './UnstyledButton';

export default ({
  first,
  sizes = [10, 20, 40, 60, 80, 100],
  onChange,
}: {
  first: number,
  sizes?: Array<number>,
  onChange: Function,
}) =>
  <Dropdown
    selected={first}
    dropdownStyle={{
      minWidth: '40px',
      width: '40px',
      zIndex: 101,
    }}
  >
    {sizes.map(x =>
      <DropdownItem
        key={x}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {first === x
          ? x
          : <UnstyledButton onClick={() => onChange(x)}>{x}</UnstyledButton>}
      </DropdownItem>,
    )}
  </Dropdown>;
