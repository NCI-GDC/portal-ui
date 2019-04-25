import React from 'react';
import PropTypes from 'prop-types';

import Card from '@ncigdc/uikit/Card';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Link from '@ncigdc/components/Links/Link';

const CountCard = ({
  title,
  count,
  icon,
  style,
  linkParams,
  className = 'test-count-card',
}) => (
  <Card
    className={className}
    style={{
      padding: '1rem',
      width: '15rem',
      ...style,
    }}>
    <Row>
      <Column>
        <Row style={{ fontSize: '1.1rem' }}>{title}</Row>
        <Row
          className="test-count"
          style={{
            fontSize: '2rem',
            width: '5em',
          }}>
          {linkParams ? <Link {...linkParams}>{count}</Link> : count}
        </Row>
      </Column>
      <Row style={{
        marginLeft: 'auto',
        alignItems: 'center',
      }}>
        {icon}
      </Row>
    </Row>
  </Card>
);

CountCard.propTypes = {
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.node,
  linkParams: PropTypes.object,
  style: PropTypes.object,
  title: PropTypes.string,
};

/*----------------------------------------------------------------------------*/

export default CountCard;
