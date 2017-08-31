// @flow
import React from 'react';
import { connect } from 'react-redux';

import { setModal } from '@ncigdc/dux/modal';
import Button from '@ncigdc/uikit/Button';
import { Column, Row } from '@ncigdc/uikit/Flex';

const BaseModal = ({
  dispatch,
  title,
  children,
  closeText = 'Accept',
  extraButtons,
  style,
  ...props
}: {
  dispatch: Function,
  title: any,
  children: any,
  closeText: any,
  extraButtons: any,
  style: Object,
}) =>
  <Column style={style} {...props}>
    <h2 style={{ paddingLeft: 15 }}>{title}</h2>
    <Column
      style={{
        borderBottom: '1px solid #e5e5e5',
        borderTop: '1px solid #e5e5e5',
        padding: 15,
        marginBottom: 15,
      }}
    >
      {children}
    </Column>
    <Row style={{ marginBottom: 15, marginRight: 15 }} spacing={10}>
      <Button
        style={{ margin: '0 0 0 auto' }}
        onClick={() => dispatch(setModal(null))}
      >
        {closeText}
      </Button>
      {extraButtons && <span style={{ marginRight: 10 }}>{extraButtons}</span>}
    </Row>
  </Column>;

export default connect()(BaseModal);
