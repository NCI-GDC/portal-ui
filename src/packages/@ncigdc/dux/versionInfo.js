// @flow
import { fetchApi } from '@ncigdc/utils/ajax';
import { handleActions } from 'redux-actions';
import { UI_VERSION, UI_COMMIT_HASH } from '@ncigdc/utils/constants';

const API_BASE_URL = 'https://github.com/NCI-GDC/gdcapi';
const UI_BASE_URL = 'https://github.com/NCI-GDC/portal-ui';

const red = 'color: rgb(173, 30, 30);';
const blue = 'color: rgb(89, 139, 214);';
const fontStyle = 'font-weight: bold;';

const logVersionInfo = ({
  uiVersion,
  uiCommitHash,
  apiCommitHash,
  apiVersion,
}) => {
  // UI info
  console.groupCollapsed(
    '%c★ UI Git Info\n=============',
    `${red};${fontStyle}`,
  );

  if (uiVersion) {
    console.info(
      `%cTag Link: %c${UI_BASE_URL}/releases/tag/${uiVersion}`,
      fontStyle,
      blue,
    );
  }

  console.info(
    `%cCommit Link: %c${UI_BASE_URL}/commit/${uiCommitHash}`,
    fontStyle,
    blue,
  );
  console.groupEnd();

  // API info
  console.groupCollapsed(
    '%c★ API Git Info\n==============',
    `${red};${fontStyle}`,
  );
  console.info(
    `%cTag Link: %c${API_BASE_URL}/releases/tag/${apiVersion}`,
    fontStyle,
    blue,
  );
  console.info(
    `%cCommit Link: %c${API_BASE_URL}/commit/${apiCommitHash}`,
    fontStyle,
    blue,
  );
  console.groupEnd();
};

// Action Types

export const VERSION_INFO_SUCCESS = 'gdc/VERSION_INFO_SUCCESS';

// Action Creator
export function fetchApiVersionInfo(): Function {
  return async (dispatch, getState) => {
    const { tag, commit, data_release } = await fetchApi('status');
    const apiVersionInfo = {
      apiVersion: tag,
      apiCommitHash: commit,
      dataRelease: data_release,
    };

    const versionInfo = {
      ...getState().versionInfo,
      ...apiVersionInfo,
    };

    logVersionInfo(versionInfo);

    dispatch({
      type: VERSION_INFO_SUCCESS,
      payload: apiVersionInfo,
    });
  };
}

// Reducer
const initialState = {
  uiVersion: UI_VERSION,
  uiCommitHash: UI_COMMIT_HASH,
  apiVersion: '',
  apiCommitHash: '',
  dataRelease: '',
};

export default handleActions(
  {
    [VERSION_INFO_SUCCESS]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  initialState,
);
