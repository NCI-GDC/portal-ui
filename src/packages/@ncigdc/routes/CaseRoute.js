/* @flow */
/* eslint fp/no-class:0 */

import React from "react";
import Relay from "react-relay/classic";
import { parse } from "query-string";
import { connect } from "react-redux";

import { handleStateChange } from "@ncigdc/dux/relayProgress";
import CasePage from "@ncigdc/containers/CasePage";
import {
  parseIntParam,
  parseFilterParam,
  parseJSURLParam,
} from "@ncigdc/utils/uri";
import NotFound from "@ncigdc/components/NotFound";
import Loader from "@ncigdc/uikit/Loaders/Loader";

import { nodeAndViewerQuery } from "./queries";

class CaseRoute extends Relay.Route {
  static routeName = "CasePageRoute";
  static queries = nodeAndViewerQuery;
  static prepareParams = ({ match: { params }, location: { search } }) => {
    const q = parse(search);

    const caseFilters = {
      op: "AND",
      content: [
        {
          op: "=",
          content: {
            field: "cases.case_id",
            value: params.id,
          },
        },
      ],
    };

    return {
      id: btoa(`Case:${params.id}`),
      files_offset: parseIntParam(q.files_offset, 0),
      files_size: parseIntParam(q.files_size, 20),
      files_sort: parseJSURLParam(q.files_sort, null),
      filters: parseFilterParam(q.filters, null),
      fmTable_offset: parseIntParam(q.fmTable_offset, 0),
      fmTable_size: parseIntParam(q.fmTable_size, 20),
      fmTable_filters: parseFilterParam(q.filters, null),
      caseFilters,
    };
  };
}

export default connect()((routeProps: mixed) => (
  <Relay.Renderer
    Container={CasePage}
    queryConfig={new CaseRoute(routeProps)}
    environment={Relay.Store}
    onReadyStateChange={handleStateChange(routeProps)}
    render={({ error, props }) => {
      if (error) {
        return <NotFound />;
      } else if (props) {
        return <CasePage {...props} />;
      }
      return <Loader />;
    }}
  />
));
