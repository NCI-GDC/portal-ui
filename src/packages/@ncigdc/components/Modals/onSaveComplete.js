import React from 'react';

import { setModal } from '@ncigdc/dux/modal';
import { notify } from '@ncigdc/dux/notification';

export default ({ dispatch, label }) => {
  dispatch(setModal(null));
  dispatch(
    notify({
      id: `${new Date().getTime()}`,
      component: (
        <span>
          {label} Saved<br />
        </span>
      ),
    }),
  );
};
