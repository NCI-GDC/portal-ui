/* @flow */
import { handleActions } from 'redux-actions';

import { saveAs } from 'filesaver.js';
import { fetchAuth } from '@ncigdc/utils/ajax';
import { FAKE_USER, IS_DEV, AWG } from '@ncigdc/utils/constants';

export type State = { isFetching: boolean, user: ?Object, error?: Object };
export type Action = { type: string, payload: any };
const USER_CA_CLEAR = 'gdc/USER_CONTROLLED_ACCESS_CLEAR';
const USER_CA_SUCCESS = 'gdc/USER_CONTROLLED_ACCESS_SUCCESS';
const USER_REQUEST = 'gdc/USER_REQUEST';
const USER_SUCCESS = 'gdc/USER_SUCCESS';
const USER_FAILURE = 'gdc/USER_FAILURE';

const TOKEN_REQUEST = 'gdc/TOKEN_REQUEST';
const TOKEN_SUCCESS = 'gdc/TOKEN_SUCCESS';
const TOKEN_FAILURE = 'gdc/TOKEN_FAILURE';
const TOKEN_CLEAR = 'gdc/TOKEN_CLEAR';

export const fetchUser = () => ((IS_DEV || FAKE_USER)
? {
  payload: FAKE_USER,
  type: USER_SUCCESS,
}
: fetchAuth({
  endpoint: 'user',
  types: [
    USER_REQUEST,
    {
      payload: async (action, state, res) => {
        const text = await res.text();
        const json = JSON.parse(text);
        return json;
      },
      type: USER_SUCCESS,
    },
    USER_FAILURE,
  ],
}));

export function forceLogout(): Action {
  return {
    type: USER_FAILURE,
    payload: { message: 'Session timed out or not authorized' },
  };
}

export function clearToken(): Action {
  return {
    type: TOKEN_CLEAR,
    payload: {},
  };
}

export function fetchToken() {
  return fetchAuth({
    types: [
      TOKEN_REQUEST,
      {
        type: TOKEN_SUCCESS,
        payload: async (action, state, res) => {
          const token = await res.text();
          saveAs(
            new Blob([token], { type: 'text/plain;charset=us-ascii' }),
            `gdc-user-token.${new Date().toISOString()}.txt`,
          );

          return token;
        },
      },
      TOKEN_FAILURE,
    ],
    endpoint: AWG ? 'token/refresh/awg' : 'token/refresh',
  });
}

const initialState: State = {
  firstLoad: true,
  isFetching: false,
  user: null,
  error: {},
  isFetchingToken: false,
  token: undefined,
  failed: false,
  userControlledAccess: {},
};

export default handleActions(
  {
    [USER_CA_CLEAR]: state => ({
      ...state,
      userControlledAccess: initialState.userControlledAccess,
    }),
    [USER_CA_SUCCESS]: (state, action) => ({
      ...state,
      userControlledAccess: action.payload,
    }),
    [USER_REQUEST]: state => ({
      ...state,
      isFetching: true,
      user: state.user,
      error: {},
    }),
    [USER_SUCCESS]: (state, action) => ({
      ...state,
      isFetching: false,
      user: action.error ? null : action.payload,
      error: action.error ? action.payload : {},
      firstLoad: false,
      failed: false,
    }),
    [USER_FAILURE]: (state, action) => ({
      ...state,
      isFetching: false,
      error: action.payload,
      user: null,
      firstLoad: false,
      failed: true,
    }),
    [TOKEN_REQUEST]: state => ({
      ...state,
      isFetchingToken: true,
    }),
    [TOKEN_SUCCESS]: (state, action) => ({
      ...state,
      isFetchingToken: false,
      token: action.payload,
    }),
    [TOKEN_FAILURE]: state => ({
      ...state,
      isFetchingToken: false,
      token: undefined,
    }),
    [TOKEN_CLEAR]: state => ({
      ...state,
      isFetchingToken: false,
      token: undefined,
    }),
  },
  initialState,
);
