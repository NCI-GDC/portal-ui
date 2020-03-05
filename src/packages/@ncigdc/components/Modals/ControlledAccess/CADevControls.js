// @flow
import React from 'react';

import Button from '@ncigdc/uikit/Button';
import { userAccessListStub } from './helpers';

const buttonStyle = {
  background: 'white',
  border: '1px solid #ccc',
  color: 'black',
  display: 'inline-block',
  marginRight: 5,
};

const CADevControls = ({
  isFakeLoggedIn,
  setIsFakeLoggedIn,
  setShowDevControls,
  setUserAccessList,
  showDevControls,
  userAccessList,
}) => {
  const devButtons = [
    {
      active: !isFakeLoggedIn,
      label: 'logged out',
      onClick: () => {
        setIsFakeLoggedIn(false);
        setUserAccessList([]);
      },
    },
    {
      active: isFakeLoggedIn && userAccessList.length === 0,
      label: 'logged in, no controlled access',
      onClick: () => {
        setIsFakeLoggedIn(true);
        setUserAccessList([]);
      },
    },
    {
      active: isFakeLoggedIn && userAccessList.length === 1,
      label: 'logged in, some controlled access',
      onClick: () => {
        setIsFakeLoggedIn(true);
        setUserAccessList(userAccessListStub.slice(0, 1));
      },
    },
    {
      active: isFakeLoggedIn && userAccessList.length === 2,
      label: 'logged in, all controlled access',
      onClick: () => {
        setIsFakeLoggedIn(true);
        setUserAccessList(userAccessListStub);
      },
    },
  ];

  return showDevControls
    ? (
      <div
        style={{
          background: '#eee',
          border: '1px solid #ccc',
          borderRadius: 10,
          marginBottom: 20,
          padding: 20,
          position: 'relative',
        }}
        >
        <h2 style={{ marginTop: 0 }}>
          Dev controls
          {' '}
          <Button onClick={() => setShowDevControls(false)} style={buttonStyle}>Close</Button>
        </h2>
        <p>For local or Netlify. If you're on dev-oicr and you login, that will override these controls.</p>
        {devButtons.map(btn => (
          <Button
            key={btn.label}
            onClick={btn.onClick}
            style={{
              ...buttonStyle,
              ...btn.active && { background: 'PowderBlue' },
            }}
            >
            {btn.label}
          </Button>
        ))}
      </div>
    )
    : (
      <p>
        <Button
          onClick={() => setShowDevControls(true)}
          style={{
            ...buttonStyle,
            position: 'absolute',
            right: 0,
            top: -45,
          }}
          >
          dev
        </Button>
      </p>
);
};

export default CADevControls;
