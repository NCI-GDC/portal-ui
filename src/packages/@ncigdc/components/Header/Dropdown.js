import React from 'react';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import styled from '@ncigdc/theme/styled';
import Link from '@ncigdc/components/Links/Link';

const iconStyle = {
  fontSize: '1.65rem',
  marginRight: '0.5rem',
};

const DropdownItemStyled = styled(DropdownItem, {
  cursor: 'pointer',
});

const HeaderDropdown = ({
  activeStyle = {},
  children: button,
  items,
  onClick: baseOnClick,
  pathname: basePath = '',
  query: baseQuery = {},
  ...linkProps
}) => (
  <Dropdown
    activeStyle={activeStyle}
    basePath={basePath}
    button={button}
    style={{ position: 'initial' }}
    >
    {items.map(({
      description = '',
      icon: IconComponent = null,
      onClick = () => {},
      pathname = '',
      query = {},
      state = {},
    }) => (
      <DropdownItemStyled
        key={description}
        >
        <Link
          {...linkProps}
          onClick={event => {
            baseOnClick(event, onClick);
          }}
          pathname={basePath + pathname}
          query={{
            ...baseQuery,
            ...query,
          }}
          state={state}
          testTag={description.split(' ').join('')}
          >
          {IconComponent && (
            <IconComponent
              style={{
                ...iconStyle,
                fontSize: '1.8rem',
                marginRight: '0.6rem',
              }}
              />
          )}

          <span>{description}</span>
        </Link>
      </DropdownItemStyled>
    ))}
  </Dropdown>
);

export default HeaderDropdown;
