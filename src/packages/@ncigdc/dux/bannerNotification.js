/* @flow */

import React from 'react';

import { ApiOverrideBanner } from '@ncigdc/components/DismissibleBanner';
import { fetchApi } from '@ncigdc/utils/ajax';
import { LOCAL_STORAGE_API_OVERRIDE } from '@ncigdc/utils/constants';

const NOTIFICATION_SUCCESS = 'NOTIFICATION_SUCCESS';
const NOTIFICATION_DISMISS = 'NOTIFICATION_DISMISS';

type TState = Array<{
  components: Array<string>,
  level: string,
  id: string,
  dismissible: boolean,
  message: any,
  dismissed?: boolean,
}>;

type TAction = {
  type: string,
  payload: Array<{
    id: string,
    components: Array<string>,
  }>,
};
export function fetchNotifications() {
  return async (dispatch: Function) => {
    let { data } = await fetchApi('notifications', {
      headers: { 'Content-Type': 'application/json' },
    });

    dispatch({
      type: NOTIFICATION_SUCCESS,
      payload: data,
    });
  };
}

export function dismissNotification(notificationID: string) {
  return {
    type: NOTIFICATION_DISMISS,
    payload: [{ id: notificationID }],
  };
}

let initialState = [];

if (LOCAL_STORAGE_API_OVERRIDE) {
  initialState.push({
    components: ['PORTAL'],
    level: 'INFO',
    id: 'api_override',
    dismissible: true,
    reactElement: true,
    message: <ApiOverrideBanner />,
  });
}

const reducer = (state: TState = initialState, action: TAction) => {
  switch (action.type) {
    case NOTIFICATION_SUCCESS:
      return [
        ...(Array.isArray(action.payload) ? action.payload : [])
          .filter(
            n =>
              n.components.includes('PORTAL') || n.components.includes('API'),
          )
          .map(n => ({ ...n, dismissed: false })),
        ...state,
      ];
    case NOTIFICATION_DISMISS:
      const ids = action.payload.map(p => p.id);
      return state.map(n => ({
        ...n,
        dismissed: ids.includes(n.id) ? true : n.dismissed,
      }));
    default:
      return state;
  }
};

export default reducer;
