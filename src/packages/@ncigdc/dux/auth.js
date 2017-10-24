/* @flow */

import { saveAs } from 'filesaver.js';
import { handleActions } from 'redux-actions';
import { fetchAuth } from '@ncigdc/utils/ajax';

import { REHYDRATE } from 'redux-persist/constants';
export type State = { isFetching: boolean, user: ?Object, error?: Object };
export type Action = { type: string, payload: any };

const USER_REQUEST = 'gdc/USER_REQUEST';
const USER_SUCCESS = 'gdc/USER_SUCCESS';
const USER_FAILURE = 'gdc/USER_FAILURE';

const TOKEN_REQUEST = 'gdc/TOKEN_REQUEST';
const TOKEN_SUCCESS = 'gdc/TOKEN_SUCCESS';
const TOKEN_FAILURE = 'gdc/TOKEN_FAILURE';
const TOKEN_CLEAR = 'gdc/TOKEN_CLEAR';
const TOGGLE_LOGIN_REQUIRED = 'gdc/TOGGLE_LOGIN_REQUIRED';

export function fetchUser() {
  return fetchAuth({
    types: [
      USER_REQUEST,
      {
        type: USER_SUCCESS,
        payload: async (action, state, res) => {
          const text = await res.text();
          const json = JSON.parse(text);
          return json;
        },
      },
      USER_FAILURE,
    ],
    endpoint: 'user',
  });
}

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
    endpoint: 'token/refresh',
  });
}

const initialState: State = {
  loginRequired: true,
  firstLoad: true,
  isFetching: false,
  user: null,
  error: {},
  isFetchingToken: false,
  token: undefined,
  // for demo purposes
  project_ids: [],
};

export default handleActions(
  {
    [REHYDRATE]: (state, action) => {
      const incoming = action.payload.auth;
      if (incoming) return { ...state, ...incoming };
      return state;
    },
    [TOGGLE_LOGIN_REQUIRED]: state => ({
      ...state,
      loginRequired: !state.loginRequired,
    }),
    [USER_REQUEST]: state => ({
      ...state,
      isFetching: true,
      user: null,
      error: {},
    }),
    [USER_SUCCESS]: (state, action) => ({
      ...state,
      isFetching: false,
      user: action.error ? null : action.payload,
      error: action.error ? action.payload : {},
      firstLoad: false,
      project_ids: action.project_ids,
    }),
    [USER_FAILURE]: (state, action) => ({
      ...state,
      isFetching: false,
      error: action.payload,
      user: null,
      firstLoad: false,
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
