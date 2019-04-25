import React from 'react';

import { setModal } from '@ncigdc/dux/modal';
import { notify } from '@ncigdc/dux/notification';
import ManageSetsLink from '@ncigdc/components/Links/ManageSetsLink';
import { closeNotification } from '../../dux/notification';
import { AWG } from '@ncigdc/utils/constants';

export default ({ dispatch, label }) => {
  dispatch(setModal(null));
  dispatch(
    notify({
      id: `${new Date().getTime()}`,
      component: (
        <span>
          {label} Saved<br />
          {!AWG && (
            <span>
              View in{' '}
              <ManageSetsLink onClick={() => dispatch(closeNotification())} />
            </span>
          )}
        </span>
      ),
    }),
  );
};
