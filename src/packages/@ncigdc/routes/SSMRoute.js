/* @flow */
/* eslint fp/no-class:0 */

import React from "react";
import Relay from "react-relay/classic";
import { connect } from "react-redux";

import { handleStateChange } from "@ncigdc/dux/relayProgress";
import SSMPage from "@ncigdc/containers/SSMPage";
import { prepareNodeParams } from "@ncigdc/utils/routes";

import NotFound from "@ncigdc/components/NotFound";
import Loader from "@ncigdc/uikit/Loaders/Loader";

import { nodeAndViewerQuery } from "./queries";

class SSMRoute extends Relay.Route {
  static routeName = "SsmPageRoute";
  static queries = nodeAndViewerQuery;
  static prepareParams = prepareNodeParams("Ssm");
}

export default connect()((routeProps: mixed) => (
  <Relay.Renderer
    Container={SSMPage}
    queryConfig={new SSMRoute(routeProps)}
    environment={Relay.Store}
    onReadyStateChange={handleStateChange(routeProps)}
    render={({ error, props }) => {
      if (error) {
        return <NotFound />;
      } else if (props) {
        return <SSMPage {...props} />;
      }
      return <Loader />;
    }}
  />
));
