import React from 'react';
import { connect } from 'react-redux';

import { setModal, IModalAction } from '@ncigdc/dux/modal';
import Button from '@ncigdc/uikit/Button';
import { Column, Row } from '@ncigdc/uikit/Flex';
export interface IBaseModalProps {
  dispatch: (action: IModalAction) => void;
  title: any;
  children: any;
  closeText?: any;
  onClose?: (...args: any[]) => void;
  extraButtons?: any;
  style: React.CSSProperties;
  contentStyle?: React.CSSProperties;
}
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
  <Column style={style} {...props}>
    <h2 style={{ paddingLeft: 15 }}>{title}</h2>
    <Column
      style={{
        borderBottom: '1px solid #e5e5e5',
        borderTop: '1px solid #e5e5e5',
        padding: '15px',
        ...contentStyle,
      }}
    >
      {children}
    </Column>
    <Row
      style={{
        justifyContent: 'flex-end',
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 10,
        paddingBottom: 15,
      }}
      spacing={'10'}
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
