import React from 'react';

export type TSetModalFunc = (
  component: React.Component | null,
  autoClose?: boolean
) => IModalAction;

export interface IModalAction {
  type: string;
  payload: {
    component: React.Component | null;
    autoClose?: boolean;
  };
}

export const setModal: TSetModalFunc = (component, autoClose = false) => ({
  type: 'TOGGLE_MODAL',
  payload: {
    component,
    autoClose: typeof autoClose === 'boolean' ? autoClose : true,
  },
});

function modal(state = null, action: IModalAction) {
  switch (action.type) {
    case 'TOGGLE_MODAL':
      return action.payload;
    default:
      return state;
  }
}

/*----------------------------------------------------------------------------*/

export default modal;
