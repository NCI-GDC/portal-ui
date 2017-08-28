// @flow
import React from 'react';
import { connect } from 'react-redux';
import Notification from '@ncigdc/uikit/Notification';

const NotificationContainer = ({ notification }) => {
  return (
    <Notification {...notification} className="test-notification-wrapper">
      {notification && notification.component}
    </Notification>
  );
};

export default connect(state => ({ notification: state.notification }))(
  NotificationContainer,
);
