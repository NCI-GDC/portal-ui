/* @flow */

import React from 'react';

import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Link from '@ncigdc/components/Links/Link';

export type TProps = {
  prfSize: string,
  prfOff: string,
  size: number,
  sizes?: Array<number>,
};

const Sizes = ({
  sizes = [
    10,
    20,
    40,
    60,
    80,
    100,
  ],
  size,
  prfSize,
  prfOff,
}: TProps) => {
  return (
    <span>
      <Dropdown
        className="test-page-size-selection"
        dropdownStyle={{
          minWidth: '40px',
          width: '40px',
          left: '0',
          zIndex: 99999,
        }}
        selected={size}>
        {sizes.map(x => (
          <DropdownItem
            className="test-page-size-option"
            key={x}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {x === size ? (
              x
            ) : (
              <Link
                merge
                query={{
                  [prfSize]: x,
                  [prfOff]: 0,
                }}>
                {x}
              </Link>
            )}
          </DropdownItem>
        ))}
      </Dropdown>
    </span>
  );
};

export default Sizes;
