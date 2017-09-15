// @flow

import React from 'react';
import PropTypes from 'prop-types';

import Card from '@ncigdc/uikit/Card';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Link from '@ncigdc/components/Links/Link';

const CountCard = ({ title, count, icon, style, linkParams, ...props }) => (
  <Card
    className={props.className || 'test-count-card'}
    style={{ padding: '1rem', width: '15rem', ...style }}
  >
    <Row>
      <Column>
        <Row style={{ fontSize: '1.1rem' }}>{title}</Row>
        <Row style={{ fontSize: '2rem', width: '5em' }} className="test-count">
          {linkParams ? <Link {...linkParams}>{count}</Link> : count}
        </Row>
      </Column>
      <Row style={{ marginLeft: 'auto', alignItems: 'center' }}>{icon}</Row>
    </Row>
  </Card>
);

CountCard.propTypes = {
  title: PropTypes.string,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.node,
  style: PropTypes.object,
  linkParams: PropTypes.object,
};

/*----------------------------------------------------------------------------*/

export default CountCard;
