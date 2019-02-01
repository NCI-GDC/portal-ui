/* @flow */

import React from 'react';

import { ApiOverrideBanner } from '@ncigdc/components/DismissibleBanner';
import { fetchApi } from '@ncigdc/utils/ajax';
import { LOCAL_STORAGE_API_OVERRIDE } from '@ncigdc/utils/constants';
import { REHYDRATE } from 'redux-persist/constants';
import { uniqBy } from 'lodash';
const NOTIFICATION_SUCCESS = 'NOTIFICATION_SUCCESS';
const NOTIFICATION_DISMISS = 'NOTIFICATION_DISMISS';
const NOTIFICATION_REMOVE = 'NOTIFICATION_REMOVE';
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
    const res1 = await fetchApi('notifications', {
      headers: { 'Content-Type': 'application/json' },
    });
    const res2 = (await fetchApi('login-notifications', {})) || { data: [] };
    dispatch({
      type: NOTIFICATION_SUCCESS,
      payload: [...res1.data, ...res2.data],
    });
  };
}

export function dismissNotification(notificationID: string) {
  return {
    type: NOTIFICATION_DISMISS,
    payload: [{ components: notificationID }],
  };
}

export function removeNotification(component: string) {
  return {
    type: NOTIFICATION_REMOVE,
    payload: component,
  };
}

let initialState = [];

if (LOCAL_STORAGE_API_OVERRIDE) {
  initialState.push({
    components: ['PORTAL'],
    level: 'INFO',
    id: `api_override`,
    dismissible: true,
    reactElement: true,
    message: <ApiOverrideBanner />,
  });
}

const reducer = (state: TState = initialState, action: TAction) => {
  switch (action.type) {
    case REHYDRATE: {
      const incoming = uniqBy(
        action.payload.bannerNotification || [],
        ({ id }) => id
      ).filter(({ id }) => id !== 'api_override');
      if (incoming) return [...state, ...incoming];
      return state;
    }
    case NOTIFICATION_SUCCESS:
      console.log('state', state);

      return uniqBy(
        [
          ...state,
          ...(Array.isArray(action.payload) ? action.payload : [])
            .filter(
              n =>
                n.components.includes('PORTAL') ||
                n.components.includes('API') ||
                n.components.includes('LOGIN')
            )
            .map(n => ({ ...n, dismissed: false })),
        ],
        ({ id }) => id
      );
    case NOTIFICATION_DISMISS:
      const ids = action.payload.map(p => p.id);
      return state.map(n => ({
        ...n,
        dismissed: ids.includes(n.id) ? true : n.dismissed,
      }));
    case NOTIFICATION_REMOVE:
      console.log('state', state);
      console.log('newState', [
        ...state.filter(n => n.components.includes(action.payload)),
      ]);

      return [...state.filter(n => n.components.includes(action.payload))];
    default:
      return state;
  }
};

export default reducer;
