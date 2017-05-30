// @flow
/* eslint fp/no-class:0 */

import React from "react";
import Relay from "react-relay/classic";
import { viewerQuery } from "@ncigdc/routes/queries";
import { makeFilter, addInFilters } from "@ncigdc/utils/filters";
import Toggle from "@ncigdc/uikit/Toggle";
import ExploreLink from "@ncigdc/components/Links/ExploreLink";

const createRenderer = (Route, Container) => (props: mixed) => (
  <Relay.Renderer
    environment={Relay.Store}
    queryConfig={new Route(props)}
    Container={Container}
    render={({ props: relayProps }) =>
      relayProps
        ? <Container {...relayProps} {...props} />
        : <i className="fa fa-spinner fa-spin" />}
  />
);

class Route extends Relay.Route {
  static routeName = "ProjectBreakdownRoute";
  static queries = viewerQuery;
  static prepareParams = ({ filters = null }) => ({
    aggFilters: filters
  });
}

const createContainer = Component =>
  Relay.createContainer(Component, {
    initialVariables: {
      aggFilters: null,
      ssmTested: makeFilter(
        [
          {
            field: "cases.available_variation_data",
            value: "ssm"
          }
        ],
        false
      )
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Root {
          explore {
            cases {
              allAggs: aggregations(filters: $ssmTested) {
                project__project_id {
                  buckets {
                    doc_count
                    key
                  }
                }
              }
              aggregations(filters: $aggFilters) {
                project__project_id {
                  buckets {
                    doc_count
                    key
                  }
                }
              }
            }
          }
        }
      `
    }
  });

const Component = ({ viewer: { explore: { cases = {} } }, filters, relay }) => {
  const allAggs = !cases.allAggs
    ? {}
    : cases.allAggs.project__project_id.buckets.reduce(
        (acc, b) => ({
          ...acc,
          [b.key]: b.doc_count
        }),
        {}
      );

  const filteredAggs = !cases.aggregations
    ? {}
    : cases.aggregations.project__project_id.buckets.reduce(
        (acc, b) => ({
          ...acc,
          [b.key]: b.doc_count
        }),
        {}
      );

  return (
    <div>
      {Object.entries(filteredAggs) // eslint-disable-line
        // $FlowIgnore
        .sort(([ak, av], [bk, bv]) => bv / allAggs[bk] - av / allAggs[ak])
        .map(([k, v]) => (
          <div key={k}>
            <span>{k}: </span>
            <ExploreLink
              query={{
                searchTableTab: "cases",
                filters: addInFilters(
                  filters,
                  makeFilter(
                    [{ field: "cases.project.project_id", value: [k] }],
                    false
                  )
                )
              }}
            >
              {v}
            </ExploreLink>
            <span> / </span>
            <ExploreLink
              query={{
                searchTableTab: "cases",
                filters: makeFilter(
                  [
                    {
                      field: "cases.available_variation_data",
                      value: ["ssm"]
                    },
                    { field: "cases.project.project_id", value: [k] }
                  ],
                  false
                )
              }}
            >
              {allAggs[k]}
            </ExploreLink>
            <span>
              &nbsp;
              (
              {// $FlowIgnore
              (v / allAggs[k] * 100).toFixed(2)}
              %)
            </span>
          </div>
        ))}
    </div>
  );
};

const Renderer = createRenderer(Route, createContainer(Component));

type TProps = {|
  caseTotal: number,
  gdcCaseTotal: number,
  filters: Object
|};

export default ({ caseTotal, gdcCaseTotal, filters }: TProps = {}) => (
  <Toggle
    title={
      <span key="total">
        <ExploreLink
          query={{
            searchTableTab: "cases",
            filters
          }}
        >
          {caseTotal.toLocaleString()}
        </ExploreLink>
        <span> / </span>
        <ExploreLink
          query={{
            searchTableTab: "cases",
            filters: makeFilter(
              [{ field: "cases.available_variation_data", value: ["ssm"] }],
              false
            )
          }}
        >
          {gdcCaseTotal.toLocaleString()}
        </ExploreLink>
      </span>
    }
  >
    <Renderer filters={filters} />
  </Toggle>
);
