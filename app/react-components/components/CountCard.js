// Vendor
import React, { PropTypes } from 'react';

// Custom
import Card from '../uikit/Card';
import { Row, Column } from '../uikit/Flex';

const CountCard = ({ title, count, icon, style }) => (
  <Card style={{ padding: '1rem', width: '15rem', ...style }}>
    <Row>
      <Column>
        <Row style={{ fontSize: '1rem' }}>{title}</Row>
        <Row style={{ fontSize: '2rem' }}>{count}</Row>
      </Column>
      <Row style={{ marginLeft: 'auto', alignItems: 'center' }}>
        {icon}
      </Row>
    </Row>
  </Card>
);

CountCard.propTypes = {
  title: PropTypes.string,
  count: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  icon: PropTypes.node,
  style: PropTypes.object,
};

/*----------------------------------------------------------------------------*/

export default CountCard;
