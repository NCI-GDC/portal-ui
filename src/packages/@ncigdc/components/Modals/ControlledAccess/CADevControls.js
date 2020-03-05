// @flow
import React from 'react';

import Button from '@ncigdc/uikit/Button';

const buttonStyle = {
  background: 'white',
  border: '1px solid #ccc',
  color: 'black',
  display: 'inline-block',
  marginRight: 5,
};

const CADevControls = ({
  hasAccess,
  isLoggedIn,
  setHasAccess,
  setIsLoggedIn,
  setShowDevControls,
  showDevControls,
}) => {
  const devButtons = [
    {
      active: !isLoggedIn,
      label: 'logged out',
      onClick: () => {
        setIsLoggedIn(false);
        setHasAccess(false);
      },
    },
    {
      active: isLoggedIn && !hasAccess,
      label: 'logged in, no controlled access',
      onClick: () => {
        setIsLoggedIn(true);
        setHasAccess(false);
      },
    },
    {
      active: isLoggedIn && hasAccess,
      label: 'logged in, some controlled access',
      onClick: () => {
        setIsLoggedIn(true);
        setHasAccess(true);
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
    : (<p><Button onClick={() => setShowDevControls(true)} style={buttonStyle}>dev</Button></p>);
};

export default CADevControls;
