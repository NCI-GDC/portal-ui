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
  position: 'relative',
  cursor: ({ disabled }) => (disabled ? 'not-allowed' : 'pointer'),
  padding: '6px 12px',
  fontSize: '14px',
  borderRadius: '4px',
  border: '1px solid transparent',
  backgroundColor: ({ theme, disabled }) => (disabled ? theme.greyScale4 : theme.primary),
  color: 'white',
  outline: 'none',
  transition: '0.25s ease',
  ':hover': {
    backgroundColor: ({ theme, disabled }) => (disabled
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
      className={`${className} button`}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          ...buttonContentStyle,
        }}>
        {leftIcon}
        <span style={{
          ...margin(leftIcon, rightIcon),
          ...center,
        }}>
          {children}
        </span>
        {rightIcon}
      </div>
    </StyledButton>
  );
};

export default Button;
