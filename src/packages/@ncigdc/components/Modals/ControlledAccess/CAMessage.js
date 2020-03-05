// @flow
import React from 'react';
import LoginButton from '@ncigdc/components/LoginButton';

const CAMessage = ({
  isAuth,
  userAccessList,
}) => (isAuth
  ? userAccessList.length === 0
    ? (
      <h3 style={{ marginTop: 0 }}>
        <strong>
        You do not have access to any controlled datasets, please apply for access.
        </strong>
      </h3>
)
    : (
      <h3 style={{ marginTop: 0 }}>
        <strong>
      Select a single controlled access dataset you wish to explore with the open dataset(s):
        </strong>
      </h3>
)
  : (
    <p>
      The following matrix shows the program data that can be explored in this section.
      <br />
      Please
      {' '}
      <LoginButton keepModalOpen>log in</LoginButton>
      {' '}
      to choose the controlled dataset you wish to explore.
    </p>
));

export default CAMessage;
