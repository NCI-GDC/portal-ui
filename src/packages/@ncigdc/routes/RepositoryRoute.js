/* @flow */
/* eslint fp/no-class:0 */

import React from "react";
import Relay from "react-relay/classic";
import { connect } from "react-redux";
import { parse } from "query-string";

import { handleStateChange } from "@ncigdc/dux/relayProgress";
import RepositoryPage from "@ncigdc/containers/RepositoryPage";
import {
  parseIntParam,
  parseFilterParam,
  parseJSURLParam
} from "@ncigdc/utils/uri";

import { viewerQuery } from "./queries";

class RepositoryRoute extends Relay.Route {
  static routeName = "RepositoryRoute";

  static queries = viewerQuery;

  static prepareParams = ({ location: { search } }) => {
    const q = parse(search);

    return {
      cases_offset: parseIntParam(q.cases_offset, 0),
      cases_size: parseIntParam(q.cases_size, 20),
      cases_sort: parseJSURLParam(q.cases_sort, null),
      files_offset: parseIntParam(q.files_offset, 0),
      files_size: parseIntParam(q.files_size, 20),
      files_sort: parseJSURLParam(q.files_sort, null),
      filters: parseFilterParam(q.filters, null)
    };
  };
}

export default connect()((props: mixed) => (
  <Relay.Renderer
    Container={RepositoryPage}
    queryConfig={new RepositoryRoute(props)}
    environment={Relay.Store}
    onReadyStateChange={handleStateChange(props)}
  />
));
