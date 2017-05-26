/* @flow */
/* eslint fp/no-class:0 */

import React from "react";
import Relay from "react-relay/classic";
import { parse } from "query-string";
import { connect } from "react-redux";

import NotFound from "@ncigdc/components/NotFound";
import Loader from "@ncigdc/uikit/Loaders/Loader";
import { handleStateChange } from "@ncigdc/dux/relayProgress";
import ProjectPage from "@ncigdc/containers/ProjectPage";
import type { TPrepareNodeParams } from "@ncigdc/utils/routes/types";
import { parseFilterParam, parseIntParam } from "@ncigdc/utils/uri";
import { replaceFilters } from "@ncigdc/utils/filters";
import { nodeAndViewerQuery } from "./queries";

const prepareNodeParams: TPrepareNodeParams = type => ({
  location: { search },
  match: { params }
}) => {
  const q = parse(search);
  const clinicalFilters = {
    op: "AND",
    content: [
      {
        op: "=",
        content: {
          field: "project.project_id",
          value: params.id
        }
      },
      {
        op: "OR",
        content: [
          {
            op: "NOT",
            content: {
              field: "cases.demographic.demographic_id",
              value: "MISSING"
            }
          },
          {
            op: "NOT",
            content: {
              field: "cases.diagnoses.diagnosis_id",
              value: "MISSING"
            }
          },
          {
            op: "NOT",
            content: {
              field: "cases.family_histories.family_history_id",
              value: "MISSING"
            }
          },
          {
            op: "NOT",
            content: {
              field: "cases.exposures.exposure_id",
              value: "MISSING"
            }
          }
        ]
      }
    ]
  };

  const biospecimenFilters = {
    op: "AND",
    content: [
      {
        op: "=",
        content: {
          field: "project.project_id",
          value: params.id
        }
      },
      {
        op: "NOT",
        content: {
          field: "cases.samples.sample_id",
          value: "MISSING"
        }
      }
    ]
  };

  const qq: Object = {
    ...q,
    clinicalFilters: replaceFilters(
      clinicalFilters,
      parseFilterParam(q.filters, null)
    ),
    biospecimenFilters: replaceFilters(
      biospecimenFilters,
      parseFilterParam(q.filters, null)
    ),
    mutatedFilters: {
      op: "AND",
      content: [
        { op: "=", content: { field: "project.project_id", value: params.id } },
        {
          op: "IN",
          content: { field: "cases.available_variation_data", value: ["ssm"] }
        }
      ]
    },
    annotationsFilters: {
      op: "AND",
      content: [
        { op: "=", content: { field: "project.project_id", value: params.id } }
      ]
    },
    fmgTable_offset: parseIntParam(q.fmgTable_offset, 0),
    fmgTable_size: parseIntParam(q.fmgTable_size, 10),
    fmgTable_filters: parseFilterParam(q.fmgTable_filters, null),
    fmTable_offset: parseIntParam(q.fmTable_offset, 0),
    fmTable_size: parseIntParam(q.fmTable_size, 10),
    fmTable_filters: parseFilterParam(q.fmTable_filters, null),
    macTable_offset: parseIntParam(q.macTable_offset, 0),
    macTable_size: parseIntParam(q.macTable_size, 10),
    macTable_filters: parseFilterParam(q.macTable_filters, null)
  };

  return {
    id: btoa(`${type}:${params.id}`),
    ...qq
  };
};

class ProjectRoute extends Relay.Route {
  static routeName = "ProjectPageRoute";
  static queries = nodeAndViewerQuery;
  static prepareParams = prepareNodeParams("Project");
}

export default connect()((routeProps: mixed) => (
  <Relay.Renderer
    Container={ProjectPage}
    queryConfig={new ProjectRoute(routeProps)}
    environment={Relay.Store}
    onReadyStateChange={handleStateChange(routeProps)}
    render={({ error, props }) => {
      if (error) {
        return <NotFound />;
      } else if (props) {
        return <ProjectPage {...props} />;
      }
      return <Loader />;
    }}
  />
));
