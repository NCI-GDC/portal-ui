// @flow

// Vendor
import React from 'react';

// Custom
import Card from '../uikit/Card';
import { Row, Column } from '../uikit/Flex';

const CountCard = ({ title, count, icon, style, onCountClick }) => (
  <Card style={{ padding: '1rem', width: '15rem', ...style }}>
    <Row>
      <Column>
        <Row style={{ fontSize: '1.1rem' }}>{title}</Row>
        <Row style={{ fontSize: '2rem' }}>
          {onCountClick ? <a onClick={onCountClick}>{count}</a> : count}
        </Row>
      </Column>
      <Row style={{ marginLeft: 'auto', alignItems: 'center' }}>
        {icon}
      </Row>
    </Row>
  </Card>
);

/*----------------------------------------------------------------------------*/

export default CountCard;
