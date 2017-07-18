// @flow
import React from 'react';
import { connect } from 'react-redux';
import Notification from '@ncigdc/uikit/Notification';
import { Row } from '@ncigdc/uikit/Flex';

const NotificationContainer = ({ notification }) =>
  <Row data-test="notification-wrapper">
    {notification &&
      <Notification
        id={notification.id}
        action={notification.action}
        {...notification}
      >
        {notification.component}
      </Notification>}
  </Row>;

export default connect(state => ({ notification: state.notification }))(
  NotificationContainer,
);
