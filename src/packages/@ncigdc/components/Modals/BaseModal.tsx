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
  dispatch,
  title,
  children,
  closeText = 'Accept',
  onClose,
  extraButtons,
  style,
  contentStyle,
  ...props
}: IBaseModalProps) => (
  <Column style={{...baseStyles.container, ...style}} {...props}>
     {/* paddingLeft: 15 */}
     {/* style={{ borderBottom: `1px solid ${theme.greyScale5}`, paddingBottom: '1rem' }} */}
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
      style={baseStyles.buttonRow}
      spacing={'10px'}
    >
      <Button
        onClick={() => {
          if (typeof onClose === 'function') {
            onClose();
          }
          dispatch(setModal(null));
        }}
      >
        {closeText}
      </Button>
      {extraButtons && <span style={{ marginRight: 10 }}>{extraButtons}</span>}
    </Row>
  </Column>
);

export default connect()(BaseModal);
