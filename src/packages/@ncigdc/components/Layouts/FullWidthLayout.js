// @flow

import React from 'react';

import { Row, Column } from '@ncigdc/uikit/Flex';
import { withTheme } from '@ncigdc/theme';

const styles = {
  title: theme => ({
    background: 'rgba(255, 255, 255, 0.9)',
    color: theme.primary,
    padding: '14px 0 8px 100px',
    width: '100%',
    position: theme.headerPosition,
    zIndex: 55,
    boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)',
    fontSize: '2.2rem',
    left: 0,
  }),
  type: theme => ({
    backgroundColor: theme.primary,
    borderRadius: '100px',
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: 'white',
    marginRight: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    transform: 'scale(0.85)',
  }),
  body: {
    width: '100vw',
    maxWidth: '1600px',
    padding: '85px 100px 90px',
  },
  wrapper: {
    alignItems: 'center',
  },
};

const FullWidthLayout = props =>
  <Row className={props.className || ''}>
    <Column flex="1" style={styles.wrapper}>
      <Row style={styles.title(props.theme)}>
        <span style={styles.type(props.theme)}>{props.entityType}</span>
        {props.title}
      </Row>
      <Column style={styles.body}>
        {props.children}
      </Column>
    </Column>
  </Row>;

export default withTheme(FullWidthLayout);
