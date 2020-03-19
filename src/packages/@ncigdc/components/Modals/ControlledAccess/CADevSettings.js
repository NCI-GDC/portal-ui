import React from 'react';

import DevSettings from '@ncigdc/components/DevSettings';

import { userAccessListStub } from './helpers';

const CADevSettings = ({
  isFakeLoggedIn,
  setIsFakeLoggedIn,
  setUserAccessList,
  userAccessList,
}) => {
  const buttons = [
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

  return (
    <DevSettings
      buttons={buttons}
      message="For local or Netlify. If you're on dev-oicr and you login, that will override these settings."
      />
  );
};

export default CADevSettings;
