/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import queryString from 'query-string';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { compose } from 'recompose';

import ActionsRow from '@ncigdc/components/ActionsRow';
import withRouter from '@ncigdc/utils/withRouter';
import TabbedLinks from '@ncigdc/components/TabbedLinks';
import FilesTable from '@ncigdc/modern_components/FilesTable';
import RepoCasesTable from '@ncigdc/modern_components/RepoCasesTable';
import { API } from '@ncigdc/utils/constants';
import { stringifyJSONParam, parseJSONParam } from '@ncigdc/utils/uri';

require('lodash-backports').register();

let var _: Object;
let var angular: Object;

_.pluck = _.map;
const enhance = compose(connect(), withRouter);
const angularBootstrapHtml = `
  <smart-search-wrapper></smart-search-wrapper>
`;

class SmartSearchComponent extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const {push} = this.props;
    angular
      .module('legacyAngularWrapper', ['ngApp'])
      .config([
        '$locationProvider',
        'RestangularProvider',
        ($locationProvider, RestangularProvider) => {
          $locationProvider.html5Mode(false);
          RestangularProvider.setBaseUrl(API);
        },
      ])
      .run([
        '$browser',
        $browser => {
          // angular dirty checks the browser url and messes with routing in other pages
          let pendingLocation = null;
          $browser.url = function(url, replace, state) {
            if (url) {
              pendingLocation = url;
              return $browser;
            } 
              return pendingLocation || location.href.replace(/%27/g, "'"); // eslint-disable-line no-restricted-globals
            
          };
        },
      ])
      .directive('smartSearchWrapper', [
        'LocationService',
        LocationService => ({
          controller() {
            this.setQuery = () => {
              const { query, filters } = queryString.parse(
                window.location.search,
              );
              const currentQuery =
                query ||
                (filters &&
                  LocationService.filter2query(parseJSONParam(filters)));

              if (typeof currentQuery === 'string') {
                this.query = currentQuery;
              }
            };
            this.sendQuery = () => {
              const gql = this.gql || {};
              const filters = { op: 'and',
content: [gql.filters] };

              const data = {
                query: this.query,
                filters: gql.filters && stringifyJSONParam(filters),
              };

              push(
                `/query?${queryString.stringify(_.omitBy(data, _.isEmpty))}`,
              );
            };
            this.resetQuery = () => {
              this.query = '';
              this.gql = null;
              this.Error = null;
              push('/query');
            };

            this.query = '';
            this.gql = '';
            this.Error = null;

            this.setQuery();

            document.querySelector('.btn-search-query').onclick = () => {
              push('/repository');
            };
          },
          controllerAs: 'sb',
          templateUrl: 'components/ui/search/templates/search-bar.html',
        }),
      ]);
    angular.bootstrap(this.container, ['legacyAngularWrapper']);
  }

  render(): void {
    return (
      <div className="test-smart-search" style={{ padding: '3rem 8rem' }}>
        <div
          dangerouslySetInnerHTML={{ __html: angularBootstrapHtml }}
          ref={c => {
            this.container = c;
          }}
        />
        <ActionsRow
          filters={this.props.filters}
          totalCases={this.props.viewer.repository.cases.hits.total}
          totalFiles={this.props.viewer.repository.files.hits.total}
        />
        <TabbedLinks
          defaultIndex={0}
          links={[
            {
              id: 'files',
              text: `Files (${this.props.viewer.repository.files.hits.total.toLocaleString()})`,
              component: <FilesTable />,
            },
            {
              id: 'cases',
              text: `Cases (${this.props.viewer.repository.cases.hits.total.toLocaleString()})`,
              component: <RepoCasesTable />,
            },
          ]}
          queryParam="searchTableTab"
        />
      </div>
    );
  }
}

export const SmartSearchQuery = {
  initialVariables: {
    cases_offset: null,
    cases_size: null,
    cases_sort: null,
    files_offset: null,
    files_size: null,
    files_sort: null,
    filters: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        repository {
          cases {
            hits(first: $cases_size offset: $cases_offset, filters: $filters) {
              total
            }
          }
          files {
            hits(first: $files_size offset: $files_offset, filters: $filters) {
              total
            }
          }
        }
      }
    `,
  },
};

const SmartSearchPage = Relay.createContainer(
  enhance(SmartSearchComponent),
  SmartSearchQuery,
);

export default SmartSearchPage;
