// @flow

// Vendor
import React from 'react';
import Color from 'color';

// Custom
import styled from '@ncigdc/theme/styled';
import { center, margin } from '@ncigdc/theme/mixins';
import validAttributes from '@ncigdc/theme/utils/validAttributes';

/*----------------------------------------------------------------------------*/

export const buttonBaseStyles = {
  ...center,
  backgroundColor: ({ disabled, theme }) => (disabled ? theme.greyScale4 : theme.primary),
  border: '1px solid transparent',
  borderRadius: '4px',
  color: 'white',
  cursor: ({ disabled }) => (disabled ? 'not-allowed' : 'pointer'),
  fontSize: '14px',
  outline: 'none',
  padding: '6px 12px',
  position: 'relative',
  transition: '0.25s ease',
  ':hover': {
    backgroundColor: ({ disabled, theme }) => (disabled
      ? theme.greyScale4
      : Color(theme.primary)
        .lighten(0.7)
        .rgbString()),
    color: 'white',
  },
};

type TButtonProps = {
  children?: mixed,
  disabled?: boolean,
  leftIcon?: mixed,
  rightIcon?: mixed,
  style?: Object,
  onClick?: Function,
  className?: string,
  buttonContentStyle?: Object,
};
const Button = ({
  style = {},
  rightIcon = null,
  leftIcon = null,
  disabled = false,
  children,
  className,
  buttonContentStyle = {},
  ...props
}: TButtonProps = {}) => {
  const StyledButton = styled.button({
    ...buttonBaseStyles,
    ...style,
  });
  StyledButton.displayName = 'StyledButton';

  return (
    <StyledButton
      disabled={disabled}
      {...validAttributes(props)}
      className={`${className} button`}
      >
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          ...buttonContentStyle,
        }}
        >
        {leftIcon}
        <span style={{
          ...margin(leftIcon, rightIcon),
          ...center,
        }}
              >
          {children}
        </span>
        {rightIcon}
      </div>
    </StyledButton>
  );
};

export default Button;
