import { handleActions } from 'redux-actions';

import { saveAs } from 'filesaver.js';
import { fetchAuth } from '@ncigdc/utils/ajax';
import { clearAWGSession } from '@ncigdc/utils/auth/awg';
import { DEV_USER, IS_DEV, AWG } from '@ncigdc/utils/constants';

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

export const fetchUser = () => ((IS_DEV || DEV_USER)
  ? {
    payload: DEV_USER,
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
  })
);

export function forceLogout(): Action {
  AWG && clearAWGSession();

  return {
    payload: { message: 'Session timed out or not authorized' },
    type: USER_FAILURE,
  };
}

export function clearToken(): Action {
  return {
    payload: {},
    type: TOKEN_CLEAR,
  };
}

export function fetchToken() {
  return fetchAuth({
    endpoint: AWG ? 'token/refresh/awg' : 'token/refresh',
    types: [
      TOKEN_REQUEST,
      {
        payload: async (action, state, res) => {
          const token = await res.text();
          saveAs(
            new Blob([token], { type: 'text/plain;charset=us-ascii' }),
            `gdc-user-token.${new Date().toISOString()}.txt`,
          );

          return token;
        },
        type: TOKEN_SUCCESS,
      },
      TOKEN_FAILURE,
    ],
  });
}

const initialState: State = {
  error: {},
  failed: false,
  firstLoad: true,
  isFetching: false,
  isFetchingToken: false,
  token: undefined,
  user: null,
  userControlledAccess: {
    fetched: false,
    studies: {},
  },
};

export default handleActions(
  {
    [TOKEN_CLEAR]: state => ({
      ...state,
      isFetchingToken: false,
      token: undefined,
    }),
    [TOKEN_FAILURE]: state => ({
      ...state,
      isFetchingToken: false,
      token: undefined,
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
    [USER_CA_CLEAR]: state => ({
      ...state,
      userControlledAccess: initialState.userControlledAccess,
    }),
    [USER_CA_SUCCESS]: (state, action) => ({
      ...state,
      userControlledAccess: {
        fetched: true,
        studies: action.payload,
      },
    }),
    [USER_FAILURE]: (state, action) => ({
      ...state,
      error: action.payload,
      failed: true,
      firstLoad: false,
      isFetching: false,
      user: null,
    }),
    [USER_REQUEST]: state => ({
      ...state,
      error: {},
      isFetching: true,
      user: state.user,
    }),
    [USER_SUCCESS]: (state, action) => ({
      ...state,
      error: action.error ? action.payload : {},
      failed: false,
      firstLoad: false,
      isFetching: false,
      user: action.error ? null : action.payload,
    }),
  },
  initialState,
);
