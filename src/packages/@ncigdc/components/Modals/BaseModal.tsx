import React from 'react';
import { connect } from 'react-redux';

import { setModal, IModalAction } from '@ncigdc/dux/modal';
import Button from '@ncigdc/uikit/Button';
import { Column, Row } from '@ncigdc/uikit/Flex';
import { theme } from '@ncigdc/theme/index';

export interface IBaseModalProps {
  dispatch: (action: IModalAction) => void,
  title: string,
  children?: any,
  closeText?: string,
  onClose?: (...args: any[]) => void,
  extraButtons?: JSX.Element | ((...args: any[]) => JSX.Element),
  style: React.CSSProperties,
  contentStyle?: React.CSSProperties,
}

const baseStyles = {
  buttonRow: {
    justifyContent: 'flex-end',
    paddingTop: '10px',
  },
  container: {
    margin: '0 2rem 2rem',
  },
  contentStyle: {
    borderBottom: `1px solid ${theme.greyScale5}`,
    borderTop: `1px solid ${theme.greyScale5}`,
    margin: '0.5rem 0 1rem',
    padding: '15px 0',
  },
};

const BaseModal = ({
  children,
  closeText = 'Accept',
  contentStyle,
  dispatch,
  extraButtons,
  onClose,
  style,
  title,
  ...props
}: IBaseModalProps) => (
  <Column
    style={{
      ...baseStyles.container,
      ...style,
    }}
    {...props}
    >
    <h2>{title}</h2>
    <Column
      style={{
        ...baseStyles.contentStyle,
        ...contentStyle,
      }}
      >
      {children}
    </Column>
    <Row
      spacing="10px"
      style={baseStyles.buttonRow}
      >
      <Button
        onClick={() => {
          if (typeof onClose === 'function') {
            onClose();
          }
          dispatch(setModal(null));
        }}
        testTag="modal-cancel-button"
        >
        {closeText}
      </Button>
      {extraButtons && <span style={{ marginRight: 10 }}>{extraButtons}</span>}
    </Row>
  </Column>
);

export default connect()(BaseModal);
