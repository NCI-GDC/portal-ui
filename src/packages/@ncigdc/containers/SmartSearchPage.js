/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import queryString from 'query-string';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { compose } from 'recompose';

import { Row } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import withRouter from '@ncigdc/utils/withRouter';
import TabbedLinks from '@ncigdc/components/TabbedLinks';
import AnnotationsLink from '@ncigdc/components/Links/AnnotationsLink';
import FilesTable from '@ncigdc/modern_components/FilesTable';
import RepoCasesTable from '@ncigdc/modern_components/RepoCasesTable';
import { API } from '@ncigdc/utils/constants';
import { stringifyJSONParam, parseJSONParam } from '@ncigdc/utils/uri';

import { CreateRepositoryCaseSetButton } from '@ncigdc/modern_components/withSetAction';
import { fetchFilesAndAdd } from '@ncigdc/dux/cart';
import { ShoppingCartIcon } from '@ncigdc/theme/icons';
import DownloadManifestButton from '@ncigdc/components/DownloadManifestButton';

require('lodash-backports').register();

declare var _: Object;
declare var angular: Object;

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
    const push = this.props.push;
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
            } else {
              return pendingLocation || location.href.replace(/%27/g, "'"); // eslint-disable-line no-restricted-globals
            }
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
              const filters = { op: 'and', content: [gql.filters] };

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
              push(`/repository`);
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
      <div style={{ padding: '3rem 8rem' }} className="test-smart-search">
        <div
          ref={c => {
            this.container = c;
          }}
          dangerouslySetInnerHTML={{ __html: angularBootstrapHtml }}
        />
        <Row
          style={{
            justifyContent: 'space-between',
            padding: '0 0 2rem',
            alignItems: 'center',
          }}
        >
          <Row spacing="0.2rem">
            <Button
              onClick={() =>
                this.props.dispatch(
                  fetchFilesAndAdd(
                    this.props.filters,
                    this.props.viewer.repository.files.hits.total,
                  ),
                )}
              leftIcon={<ShoppingCartIcon />}
            >
              Add All Files to Cart
            </Button>
            <DownloadManifestButton
              fileCount={this.props.viewer.repository.files.hits.total}
              filters={this.props.filters}
            />
            <CreateRepositoryCaseSetButton
              filters={this.props.filters}
              disabled={!this.props.viewer.repository.cases.hits.total}
              style={{ paddingLeft: '5px' }}
              onComplete={setId => {
                this.props.push({
                  pathname: '/exploration',
                  query: {
                    filters: stringifyJSONParam({
                      op: 'AND',
                      content: [
                        {
                          op: 'IN',
                          content: {
                            field: 'cases.case_id',
                            value: [`set_id:${setId}`],
                          },
                        },
                      ],
                    }),
                  },
                });
              }}
            >
              {'View '}
              {this.props.viewer.repository.cases.hits.total.toLocaleString()}{' '}
              {this.props.viewer.repository.cases.hits.total === 1
                ? ' Case'
                : ' Cases '}
              in Exploration
            </CreateRepositoryCaseSetButton>
          </Row>
        </Row>
        <TabbedLinks
          queryParam="searchTableTab"
          defaultIndex={0}
          tabToolbar={
            <Row spacing="2rem" style={{ alignItems: 'center' }}>
              <AnnotationsLink className="test-annotations-link">
                <Button leftIcon={<i className="fa fa-edit" />}>
                  Browse Annotations
                </Button>
              </AnnotationsLink>
            </Row>
          }
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
