/* @flow */
/* global _ angular */
/* eslint-disable */

import React from "react";
import JSURL from "jsurl";
import { compose } from "recompose";
import { insertRule } from "glamor";

import withRouter from "@ncigdc/utils/withRouter";

// Append d3-tip for githut. Appending here to avoid issues in load order.
const d3TipUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/d3-tip/0.7.1/d3-tip.min.js";
const existingScript = document.querySelector(`script[src="${d3TipUrl}"]`);
if (!existingScript) {
  const script = document.createElement("script");
  script.src = d3TipUrl;
  document.body.appendChild(script);
}

insertRule(`
.githut.githut #pc svg #labels g.hover .label text {
  font-size: inherit;
}`);

insertRule(`
.githut.githut #pc svg #labels g.hover .label text:before {
  content: '';
  display: block;
  position: absolute;
  background: black;
  width: 2px;
  height: 100%;
}
`);

insertRule(`
.githut.githut #pc svg > *:nth-last-child(1),
.githut.githut #pc svg > *:nth-last-child(2) {
  display: none
}
`);

export default compose(withRouter)(
  class GitHut extends React.Component {
    componentDidMount() {
      const self = this;
      angular
        .module("legacyAngularWrapper", ["ngApp"])
        .config([
          "$locationProvider",
          "RestangularProvider",
          ($locationProvider, RestangularProvider) => {
            $locationProvider.html5Mode(false);
            RestangularProvider.setBaseUrl(process.env.REACT_APP_API);
            // Previous process.env.REACT_APP_API treated "from=0" to be the same as "from=1", the current process.env.REACT_APP_API doesn't.
            RestangularProvider.addFullRequestInterceptor(
              (element, operation, what, url, headers, query) => ({
                params: Object.assign({}, query, {
                  from: query.from === 1 ? 0 : query.from
                })
              })
            );
          }
        ])
        .run([
          "$browser",
          "LocationService",
          "$state",
          ($browser, LocationService, $state) => {
            // angular dirty checks the browser url and messes with routing in other pages
            let pendingLocation = null;
            $browser.url = function(url, replace, state) {
              if (url) {
                pendingLocation = url;
                return $browser;
              } else {
                return pendingLocation || location.href.replace(/%27/g, "'");
              }
            };
            $state.go = this.handleAngularRouterRequestGo;
            LocationService.filters = () => this.props.params.filters;
          }
        ])
        .directive("githut", [
          "$timeout",
          $timeout => ({
            controller: "ProjectsController as prsc",
            link(scope, element, attrs, controller) {
              controller.ProjectsState.tabs.graph.active = true;
              self.angularController = controller;

              // NOTE: bandaid solution to hide duplicate primary sites created due to projects now having multiple primary sites
              const hideDuplicates = () => {
                const duplicatePrimarySiteTexts = _.flatten(
                  Object.values(
                    _.groupBy(
                      element.find(
                        ".githut #pc svg #labels .label:last-child text"
                      ),
                      "innerHTML"
                    )
                  )
                    .filter(els => els.length > 1)
                    .map(_.tail)
                );
                duplicatePrimarySiteTexts.forEach(text => {
                  text.style.fillOpacity = 0;
                  text.style.pointerEvents = "none";
                });
              };
              // NOTE: firing multiple times b/c we're not sure when the graph is finished drawing
              $timeout(hideDuplicates, 500);
              $timeout(hideDuplicates, 1000);
              $timeout(hideDuplicates, 2000);
              $timeout(hideDuplicates, 3000);
              $timeout(hideDuplicates, 5000);
            },
            template: `
          <git-hut
            data-ng-if="prsc.githutData"
            data="prsc.githutData"
            config="prsc.githutConfig"
          ></git-hut>
        `
          })
        ]);
      angular.bootstrap(this.container, ["legacyAngularWrapper"]);
    }

    componentDidUpdate() {
      if (this.angularController) {
        this.angularController.refresh();
      }
    }

    handleAngularRouterRequestGo = (state, params, options) => {
      const stateMap = {
        "search.participants": {
          pathname: "/repository",
          children: "repository",
          query: {
            searchTableTab: "cases",
            filters: JSURL.stringify(JSON.parse(params.filters || null))
          }
        },
        "search.files": {
          pathname: "/repository",
          children: "repository",
          query: {
            searchTableTab: "files",
            filters: JSURL.stringify(JSON.parse(params.filters || null))
          }
        },
        project: {
          pathname: `/projects/${params.projectId}`
        }
      };

      this.props.push(stateMap[state]);
    };

    render() {
      return (
        <div>
          <h2
            style={{
              textAlign: "center",
              marginBottom: -40,
              fontSize: 19
            }}
          >
            Case count per Data Category
          </h2>
          <div
            ref={c => {
              this.container = c;
            }}
            dangerouslySetInnerHTML={{ __html: "<githut></githut>" }}
          />
        </div>
      );
    }
  }
);
