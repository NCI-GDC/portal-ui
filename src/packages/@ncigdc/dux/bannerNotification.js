/* @flow */

import React from "react";

import DismissibleBanner from "@ncigdc/components/DismissibleBanner";

import { fetchApi } from "@ncigdc/utils/ajax";

const NOTIFICATION_SUCCESS = "NOTIFICATION_SUCCESS";
const NOTIFICATION_DISMISS = "NOTIFICATION_DISMISS";

export function fetchNotifications() {
  return async dispatch => {
    let { data } = await fetchApi("notifications", {
      headers: { "Content-Type": "application/json" }
    });

    dispatch({
      type: NOTIFICATION_SUCCESS,
      payload: data
    });
  };
}

export function dismissNotification(notificationID) {
  return {
    type: NOTIFICATION_DISMISS,
    payload: { id: notificationID }
  };
}

let initialState = [
  {
    components: ["PORTAL"],
    level: "INFO",
    id: 0,
    dismissible: true,
    message: <DismissibleBanner />
  }
];

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATION_SUCCESS:
      return [
        ...(action.payload || [])
          .filter(
            n => n.components.includes("PORTAL") || n.components.includes("API")
          )
          .map(n => ({ ...n, dismissed: false })),
        ...state
      ];
    case NOTIFICATION_DISMISS:
      return state.map(n => ({
        ...n,
        dismissed: n.id === action.payload.id ? true : n.dismissed
      }));
    default:
      return state;
  }
};

export default reducer;
