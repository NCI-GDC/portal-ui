// @flow

// Vendor
import React from 'react';
import { REHYDRATE } from 'redux-persist/constants';
import _ from 'lodash';
import md5 from 'blueimp-md5';
import urlJoin from 'url-join';
import { stringify } from 'query-string';

import { fetchApi } from '@ncigdc/utils/ajax';
import { notify } from '@ncigdc/dux/notification';
import { Column } from '@ncigdc/uikit/Flex';
import { center } from '@ncigdc/theme/mixins';
import { replaceFilters } from '@ncigdc/utils/filters';
import UnstyledButton from '@ncigdc/uikit/UnstyledButton';
import { API, IS_AUTH_PORTAL } from '@ncigdc/utils/constants';

/*----------------------------------------------------------------------------*/

export type TCartFile = {
  file_name: string,
  file_id: string,
  acl: Array<string>,
  state: string,
  access: string,
  file_size: number,
  projects: Array<string>,
};

type TNotification = {
  fileText?: string,
  action: string,
  file: string | number,
  extraText?: any,
  prepositon: string,
  undo: {
    files: Array<TCartFile>,
  },
};

export const UPDATE_CART = 'UPDATE_CART';
export const ADD_TO_CART = 'ADD_TO_CART';
export const CLEAR_CART = 'CLEAR_CART';
export const CART_FULL = 'CART_FULL';

export const MAX_CART_SIZE = 10000;
const MAX_CART_WARNING = `The cart is limited to ${MAX_CART_SIZE.toLocaleString()} files.
  Please narrow the search criteria or remove some files from the cart to add more.`;

const DEFAULTS = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const getNotificationComponent = (
  action,
  id,
  notification: TNotification,
  dispatch,
) => ({
  action,
  id,
  component: (
    <Column>
      <span>
        {notification.action}
        <strong> {notification.file} </strong>
        {notification.fileText}
        {notification.prepositon} the cart. {notification.extraText}
      </span>
      {notification.undo && (
        <span style={center}>
          <strong>
            <i
              className="fa fa-undo"
              style={{
                marginRight: '0.3rem',
              }}
            />
            <UnstyledButton
              style={{
                textDecoration: 'underline',
              }}
              onClick={() =>
                dispatch(toggleFilesInCart(notification.undo.files))}
            >
              Undo
            </UnstyledButton>
          </strong>
        </span>
      )}
    </Column>
  ),
});

const messageNotificationDispatcher = (
  action: string,
  message,
  dispatch: Function,
) => {
  dispatch(
    notify({
      action,
      id: `${new Date().getTime()}`,
      component: (
        <Column>
          <span>{message}</span>
        </Column>
      ),
    }),
  );
};

function toggleFilesInCart(
  incomingFile: TCartFile | Array<TCartFile>,
): Function {
  return (dispatch, getState) => {
    const incomingFileArray = Array.isArray(incomingFile)
      ? incomingFile
      : [incomingFile];
    const existingFiles = getState().cart.files;
    const nextFiles = _.xorBy(existingFiles, incomingFileArray, 'file_id');

    if (nextFiles.length > MAX_CART_SIZE) {
      dispatch({
        type: CART_FULL,
      });
      messageNotificationDispatcher('warning', MAX_CART_WARNING, dispatch);
      return;
    }

    if (nextFiles.length > existingFiles.length) {
      dispatch(
        notify(
          getNotificationComponent(
            'add',
            `add/${incomingFile.file_name}`,
            {
              action: 'Added',
              file: incomingFile.file_name,
              prepositon: 'to',
              undo: {
                files: incomingFile,
              },
            },
            dispatch,
          ),
        ),
      );
    }

    if (nextFiles.length < existingFiles.length) {
      dispatch(
        notify(
          getNotificationComponent(
            'remove',
            `remove/${incomingFile.file_name}`,
            {
              action: 'Removed',
              file: incomingFile.file_name || incomingFileArray.length,
              fileText: incomingFile.file_name ? '' : 'files ',
              prepositon: 'from',
              undo: {
                files: incomingFile,
              },
            },
            dispatch,
          ),
        ),
      );
    }

    dispatch({
      type: UPDATE_CART,
      payload: nextFiles,
    });
  };
}

function removeFilesFromCart(files: Array<TCartFile> | TCartFile): Function {
  return (dispatch, getState) => {
    const filesToRemove = Array.isArray(files) ? files : [files];
    const existingFiles = getState().cart.files;
    const nextFiles = _.differenceBy(existingFiles, filesToRemove, 'file_id');
    const filesRemoved = existingFiles.length - nextFiles.length;
    dispatch(
      notify(
        getNotificationComponent(
          'remove',
          `remove/${new Date().getTime()}`,
          {
            action: 'Removed',
            file: filesToRemove.file_name || filesRemoved,
            fileText: filesToRemove.file_name ? '' : 'files ',
            prepositon: 'from',
            undo: {
              files: filesToRemove,
            },
          },
          dispatch,
        ),
      ),
    );

    dispatch({
      type: UPDATE_CART,
      payload: nextFiles,
    });
  };
}

function addAllFilesInCart(
  incomingFiles: Array<TCartFile> | TCartFile,
): Function {
  return (dispatch, getState) => {
    const incomingFilesArray = Array.isArray(incomingFiles)
      ? incomingFiles
      : [incomingFiles];
    const existingFiles = getState().cart.files;
    const nextFiles = incomingFilesArray.filter(
      file =>
        !existingFiles.some(
          existingFile => existingFile.file_id === file.file_id,
        ),
    );
    const filesInCart = incomingFilesArray.length - nextFiles.length;

    if (nextFiles.length + existingFiles.length > MAX_CART_SIZE) {
      dispatch({
        type: CART_FULL,
      });
      messageNotificationDispatcher('warning', MAX_CART_WARNING, dispatch);
      return;
    }
    if (nextFiles && nextFiles.length < incomingFilesArray.length) {
      dispatch(
        notify(
          getNotificationComponent(
            'add',
            `add/some${new Date().getTime()}`,
            {
              action: 'Added',
              file: nextFiles.length,
              fileText: nextFiles.length > 1 ? 'files ' : 'file ',
              extraText: (
                <span>
                  <strong>{filesInCart}</strong>{' '}
                  {filesInCart > 1 ? 'files' : 'file'} already in cart, not
                  added.
                </span>
              ),
              prepositon: 'to',
              undo: {
                files: incomingFilesArray,
              },
            },
            dispatch,
          ),
        ),
      );
    } else if (nextFiles) {
      dispatch(
        notify(
          getNotificationComponent(
            'add',
            `add/all${new Date().getTime()}`,
            {
              action: 'Added',
              file: nextFiles.length,
              fileText: 'files ',
              prepositon: 'to',
              undo: {
                files: incomingFilesArray,
              },
            },
            dispatch,
          ),
        ),
      );
    }
    dispatch({
      type: ADD_TO_CART,
      payload: nextFiles,
    });
  };
}

export const fetchCartFiles = async (filters, size) => {
  const body = JSON.stringify({
    query: `query cart_relayQuery(
            $size: Int
            $offset: Int
            $sort: [Sort]
            $filters: FiltersArgument
          ) {
            viewer {
              repository {
                files {
                  hits(first: $size, offset: $offset, sort: $sort, filters: $filters) {
                    edges {
                      node {
                        acl
                        state
                        access
                        file_id
                        file_size
                        cases {
                          hits(first: 1) {
                            edges {
                              node {
                                project {
                                  project_id
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          `,
    variables: {
      filters,
      size,
      offset: 0,
      sort: null,
    },
  });

  const hash = md5(body);
  return await fetch(urlJoin(API, `graphql/cart?hash=${hash}`), {
    ...DEFAULTS,
    ...(IS_AUTH_PORTAL ? { credentials: 'include' } : {}),
    body,
  })
    .then(response =>
      response.json().then(json => {
        return json;
      }),
    )
    .then(json => {
      return json.data.viewer.repository.files.hits.edges.map(({ node }) => ({
        ...node,
        projects: node.cases.hits.edges.map(
          ({ node: { project: { project_id } } }) => project_id,
        ),
      }));
    });
};

function fetchFilesAndAdd(currentFilters: ?Object, total: number): Function {
  return async dispatch => {
    // if the total requested in filters is larger than max cart then don't bother fetching
    // otherwise need the IDs to tell if they are already in the cart
    if (total <= MAX_CART_SIZE) {
      messageNotificationDispatcher(
        'info',
        <span>
          Adding <b>{total}</b> files to cart
        </span>,
        dispatch,
      );

      const files = await fetchCartFiles(currentFilters, total);
      dispatch(addAllFilesInCart(files));
    } else {
      dispatch({
        type: CART_FULL,
      });
      messageNotificationDispatcher('warning', MAX_CART_WARNING, dispatch);
    }
  };
}

function fetchFilesAndRemove(currentFilters: ?Object, size: number): Function {
  return async (dispatch, getState) => {
    const existingFiles = getState().cart.files;

    if (!existingFiles.length) {
      dispatch(
        notify({
          action: 'warning',
          component: (
            <Column>
              <span>There are no files in the cart to remove.</span>
            </Column>
          ),
        }),
      );

      return;
    }

    messageNotificationDispatcher(
      'info',
      <span>Removing files from cart</span>,
      dispatch,
    );

    const filters =
      size > MAX_CART_SIZE
        ? replaceFilters(
            {
              op: 'and',
              content: [
                {
                  op: 'in',
                  content: {
                    field: 'files.file_id',
                    value: existingFiles.map(f => f.file_id),
                  },
                },
              ],
            },
            currentFilters,
          )
        : currentFilters;

    const search = {
      headers: { 'Content-Type': 'application/json' },
      body: {
        filters,
        size: Math.min(size, MAX_CART_SIZE),
        fields: 'file_id,file_name',
      },
    };
    const { data } = await fetchApi('files', search);
    dispatch(removeFilesFromCart(data.hits));
  };
}

function removeAllInCart(): Function {
  return (dispatch, getState) => {
    const existingFiles = getState().cart.files;
    if (existingFiles.length) {
      dispatch(
        notify(
          getNotificationComponent(
            'remove',
            `remove/all${new Date().getTime()}`,
            {
              action: 'Removed',
              file: existingFiles.length,
              fileText: 'files ',
              prepositon: 'from',
              undo: {
                files: existingFiles,
              },
            },
            dispatch,
          ),
        ),
      );

      dispatch({
        type: CLEAR_CART,
        payload: [],
      });
    } else {
      dispatch(
        notify({
          action: 'remove',
          id: 'remove/nofile',
          component: (
            <Column>
              <span>There are no files in the cart</span>
            </Column>
          ),
        }),
      );
    }
  };
}

const initialState = {
  files: [],
};

export function reducer(state: Object = initialState, action: Object): Object {
  switch (action.type) {
    case REHYDRATE: {
      const incoming = action.payload.cart;
      if (incoming) return { ...state, ...incoming };
      return state;
    }
    case ADD_TO_CART:
      return {
        files: state.files.concat(
          action.payload.map(file => ({
            acl: file.acl,
            state: file.state,
            access: file.access,
            file_id: file.file_id,
            file_size: file.file_size,
            projects: file.cases
              ? file.cases.hits.edges.map(
                  ({ node: { project: { project_id } } }) => project_id,
                )
              : file.projects,
          })),
        ),
      };
    case CLEAR_CART:
      return {
        files: [],
      };
    case UPDATE_CART:
      return {
        ...state,
        files: action.payload.map(file => ({
          acl: file.acl,
          state: file.state,
          access: file.access,
          file_id: file.file_id,
          file_size: file.file_size,
          projects: file.cases
            ? file.cases.hits.edges.map(
                ({ node: { project: { project_id } } }) => project_id,
              )
            : file.projects,
        })),
      };
    case CART_FULL:
      return state;
    default:
      return state;
  }
}

/*----------------------------------------------------------------------------*/

export {
  toggleFilesInCart,
  addAllFilesInCart,
  removeAllInCart,
  removeFilesFromCart,
  fetchFilesAndAdd,
  fetchFilesAndRemove,
};

export default reducer;
