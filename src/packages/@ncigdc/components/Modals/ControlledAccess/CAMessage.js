// @flow
import React from 'react';
import LoginButton from '@ncigdc/components/LoginButton';

const CAMessage = ({
  user,
  userAccessList,
}) => (user
  ? userAccessList.length === 0
    ? (
      <p
        style={{
          fontSize: '18px',
          marginTop: 0,
        }}
        >
        <strong>
          You do not have access to any controlled datasets, please apply for access.
        </strong>
      </p>
    )
    : (
      <p
        style={{
          fontSize: '18px',
          marginTop: 0,
        }}
        >
        <strong>
          Select a single controlled access dataset you wish to explore with the open dataset(s):
        </strong>
      </p>
    )
  : (
    <p>
      The following matrix shows the program data that can be explored in this section.
      <br />
      {'Please '}
      <LoginButton keepModalOpen>log in</LoginButton>
      {' to choose the controlled dataset you wish to explore.'}
    </p>
));

export default CAMessage;
