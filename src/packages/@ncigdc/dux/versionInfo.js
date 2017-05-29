// @flow
import { fetchApi } from "@ncigdc/utils/ajax";
import { handleActions } from "redux-actions";

const REACT_APP_API_BASE_URL = "https://github.com/NCI-GDC/gdcapi";
const UI_BASE_URL = "https://github.com/NCI-GDC/portal-ui";

const red = "color: rgb(173, 30, 30);";
const blue = "color: rgb(89, 139, 214);";
const fontStyle = "font-weight: bold;";

const logVersionInfo = ({
  uiVersion,
  uiCommitHash,
  apiCommitHash,
  apiVersion
}) => {
  // UI info
  console.groupCollapsed(
    "%c★ UI Git Info\n=============",
    `${red};${fontStyle}`
  );

  if (uiVersion) {
    console.info(
      `%cTag Link: %c${UI_BASE_URL}/releases/tag/${uiVersion}`,
      fontStyle,
      blue
    );
  }

  console.info(
    `%cCommit Link: %c${UI_BASE_URL}/commit/${uiCommitHash}`,
    fontStyle,
    blue
  );
  console.groupEnd();

  // process.env.REACT_APP_API info
  console.groupCollapsed(
    "%c★ process.env.REACT_APP_API Git Info\n==============",
    `${red};${fontStyle}`
  );
  console.info(
    `%cTag Link: %c${REACT_APP_API_BASE_URL}/releases/tag/${apiVersion}`,
    fontStyle,
    blue
  );
  console.info(
    `%cCommit Link: %c${REACT_APP_API_BASE_URL}/commit/${apiCommitHash}`,
    fontStyle,
    blue
  );
  console.groupEnd();
};

// Action Types

export const VERSION_INFO_SUCCESS = "gdc/VERSION_INFO_SUCCESS";

// Action Creator
export function fetchApiVersionInfo(): Function {
  return async (dispatch, getState) => {
    const { tag, commit, data_release } = await fetchApi("status");
    const apiVersionInfo = {
      apiVersion: tag,
      apiCommitHash: commit,
      dataRelease: data_release
    };

    logVersionInfo({
      ...getState().versionInfo,
      ...apiVersionInfo
    });

    dispatch({
      type: VERSION_INFO_SUCCESS,
      payload: apiVersionInfo
    });
  };
}

// Reducer
const initialState = {
  uiVersion: process.env.REACT_APP_COMMIT_TAG,
  uiCommitHash: process.env.REACT_APP_COMMIT_HASH,
  apiVersion: "",
  apiCommitHash: "",
  dataRelease: ""
};

export default handleActions(
  {
    [VERSION_INFO_SUCCESS]: (state, action) => ({
      ...state,
      ...action.payload
    })
  },
  initialState
);
