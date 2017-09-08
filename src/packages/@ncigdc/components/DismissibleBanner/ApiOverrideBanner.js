import React from 'react';

import UnstyledButton from '@ncigdc/uikit/UnstyledButton';
import { API_OVERRIDE_KEYS } from '@ncigdc/utils/constants';

export default () =>
  <div>
    Local Storage is Overriding the API.{' '}
    <UnstyledButton
      style={{ textDecoration: 'underline' }}
      onClick={() => {
        API_OVERRIDE_KEYS.forEach(k => localStorage.removeItem(k));
        window.location.reload();
      }}
    >
      Remove Override and Reload
    </UnstyledButton>
  </div>;
