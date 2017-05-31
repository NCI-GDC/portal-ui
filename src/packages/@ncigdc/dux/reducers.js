// @flow

import { tooltipReducer as tooltip } from "@ncigdc/uikit/Tooltip";

import modal from "./modal";
import relayLoading from "./relayLoading";
import cart from "./cart";
import notification from "./notification";
import auth from "./auth";
import versionInfo from "./versionInfo";
import bannerNotification from "./bannerNotification";
import relayProgress from "./relayProgress";
import error from "./error";
import loaders from "./loaders";
import tableColumns from "./tableColumns";

/*----------------------------------------------------------------------------*/

export default {
  modal,
  relayLoading,
  cart,
  notification,
  auth,
  tooltip,
  versionInfo,
  bannerNotification,
  relayProgress,
  error,
  loaders,
  tableColumns
};
