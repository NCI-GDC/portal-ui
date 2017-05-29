// @flow
/* eslint fp/no-class:0 */

import React from "react";
import Relay from "react-relay/classic";
import { compose, withState } from "recompose";
import { connect } from "react-redux";
import { viewerQuery } from "@ncigdc/routes/queries";
import { makeFilter, addInFilters } from "@ncigdc/utils/filters";
import TogglableUl from "@ncigdc/uikit/TogglableUl";
import ExploreLink from "@ncigdc/components/Links/ExploreLink";

const createRenderer = (Route, Container) =>
  compose(connect())((props: mixed) => (
    <Relay.Renderer
      environment={Relay.Store}
      queryConfig={new Route(props)}
      Container={Container}
      render={({ props: relayProps }) =>
        relayProps
          ? <Container {...relayProps} {...props} />
          : <i className="fa fa-spinner fa-spin" />}
    />
  ));

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
      fetchData: false,
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
              hits(first: 0 filters: $ssmTested) { total }
              allAggs: aggregations(filters: $ssmTested) {
                project__project_id {
                  buckets {
                    doc_count
                    key
                  }
                }
              }
              aggregations(filters: $aggFilters) @include(if: $fetchData) {
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

const Component = compose(
  withState("loading", "setLoading", false)
)(({ loading, setLoading, viewer, caseTotal, filters, relay }) => {
  const { cases } = viewer.explore;

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
    <TogglableUl
      onToggle={() => {
        relay.setVariables({
          fetchData: true
        });
        setLoading(l => !l);
      }}
      items={[
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
            {cases.hits.total.toLocaleString()}
          </ExploreLink>
        </span>,
        ...(loading &&
        !cases.aggregations && [<i className="fa fa-spinner fa-spin" />]),
        ...Object.entries(filteredAggs) // eslint-disable-line
          // $FlowIgnore
          .sort(([ak, av], [bk, bv]) => bv / allAggs[bk] - av / allAggs[ak])
          .map(([k, v]) => (
            <span key={k}>
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
            </span>
          ))
      ]}
    />
  );
});

export default createRenderer(Route, createContainer(Component));
