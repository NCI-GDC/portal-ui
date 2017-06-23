// @flow
import React from 'react';
import Relay from 'react-relay/classic';
import _ from 'lodash';
import { parse } from 'query-string';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import type { TBucket } from '@ncigdc/components/Aggregations/types';
import withRouter from '@ncigdc/utils/withRouter';
import { parseFilterParam } from '@ncigdc/utils/uri';
import { ConnectedLoader } from '@ncigdc/uikit/Loaders/Loader';
import {
  ColumnCenter,
  RowCenter,
  PieTitle,
  SelfFilteringPie,
} from '@ncigdc/components/TabPieCharts';
import { handleReadyStateChange } from '@ncigdc/dux/loaders';

export type TProps = {
  push: Function,
  query: Object,
  viewer: {
    explore: {
      cases: {
        aggregations: {
          demographic__ethnicity: { buckets: [TBucket] },
          demographic__gender: { buckets: [TBucket] },
          demographic__race: { buckets: [TBucket] },
          diagnoses__vital_status: { buckets: [TBucket] },
          disease_type: { buckets: [TBucket] },
          primary_site: { buckets: [TBucket] },
          project__program__name: { buckets: [TBucket] },
          project__project_id: { buckets: [TBucket] },
        },
      },
    },
  },
};

const COMPONENT_NAME = 'ExploreCasesPies';

const createRenderer = (Route, Container) =>
  compose(connect(), withRouter)((props: mixed) =>
    <div style={{ position: 'relative', minHeight: '161px' }}>
      <Relay.Renderer
        environment={Relay.Store}
        queryConfig={new Route(props)}
        onReadyStateChange={handleReadyStateChange(COMPONENT_NAME, props)}
        Container={Container}
        render={({ props: relayProps }) =>
          relayProps ? <Container {...relayProps} {...props} /> : undefined // needed to prevent flicker
        }
      />
      <ConnectedLoader name={COMPONENT_NAME} />
    </div>,
  );

class Route extends Relay.Route {
  static routeName = COMPONENT_NAME;
  static queries = {
    viewer: () => Relay.QL`query { viewer }`,
  };
  static prepareParams = ({ location: { search }, defaultFilters = null }) => {
    const q = parse(search);

    return {
      filters: parseFilterParam(q.filters, defaultFilters),
    };
  };
}

const createContainer = Component =>
  Relay.createContainer(Component, {
    initialVariables: {
      filters: null,
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Root {
          explore {
            cases {
              aggregations(filters: $filters aggregations_filter_themselves: true) {
                demographic__ethnicity {
                  buckets {
                    doc_count
                    key
                  }
                }
                demographic__gender {
                  buckets {
                    doc_count
                    key
                  }
                }
                demographic__race {
                  buckets {
                    doc_count
                    key
                  }
                }
                diagnoses__vital_status {
                  buckets {
                    doc_count
                    key
                  }
                }
                disease_type {
                  buckets {
                    doc_count
                    key
                  }
                }
                primary_site {
                  buckets {
                    doc_count
                    key
                  }
                }
                project__project_id {
                  buckets {
                    doc_count
                    key
                  }
                }
                project__program__name {
                  buckets {
                    doc_count
                    key
                  }
                }
              }
            }
          }
        }
      `,
    },
  });

const Component = ({
  viewer: { explore: { cases: { aggregations } } },
  query,
  push,
}: TProps) => {
  const currentFilters =
    (query && parseFilterParam((query || {}).filters, {}).content) || [];
  const currentFieldNames = currentFilters.map(f => f.content.field);
  return (
    <RowCenter>
      <ColumnCenter>
        <PieTitle>Primary Sites</PieTitle>
        <SelfFilteringPie
          docTypeSingular="case"
          buckets={_.get(aggregations, 'primary_site.buckets')}
          fieldName="cases.primary_site"
          currentFieldNames={currentFieldNames}
          currentFilters={currentFilters}
          query={query}
          push={push}
          path="doc_count"
          height={125}
          width={125}
        />
      </ColumnCenter>
      <ColumnCenter>
        <PieTitle>Projects</PieTitle>
        <SelfFilteringPie
          docTypeSingular="case"
          buckets={_.get(aggregations, 'project__project_id.buckets')}
          fieldName="cases.project.project_id"
          currentFieldNames={currentFieldNames}
          currentFilters={currentFilters}
          query={query}
          push={push}
          path="doc_count"
          height={125}
          width={125}
        />
      </ColumnCenter>
      <ColumnCenter>
        <PieTitle>Disease Type</PieTitle>
        <SelfFilteringPie
          docTypeSingular="case"
          buckets={_.get(aggregations, 'disease_type.buckets')}
          fieldName="cases.disease_type"
          currentFieldNames={currentFieldNames}
          currentFilters={currentFilters}
          query={query}
          push={push}
          path="doc_count"
          height={125}
          width={125}
        />
      </ColumnCenter>
      <ColumnCenter>
        <PieTitle>Gender</PieTitle>
        <SelfFilteringPie
          docTypeSingular="case"
          buckets={_.get(aggregations, 'demographic__gender.buckets')}
          fieldName="cases.demographic.gender"
          currentFieldNames={currentFieldNames}
          currentFilters={currentFilters}
          query={query}
          push={push}
          path="doc_count"
          height={125}
          width={125}
        />
      </ColumnCenter>
      <ColumnCenter>
        <PieTitle>Vital Status</PieTitle>
        <SelfFilteringPie
          docTypeSingular="case"
          buckets={_.get(aggregations, 'diagnoses__vital_status.buckets')}
          fieldName="cases.diagnoses.vital_status"
          currentFieldNames={currentFieldNames}
          currentFilters={currentFilters}
          query={query}
          push={push}
          path="doc_count"
          height={125}
          width={125}
        />
      </ColumnCenter>
    </RowCenter>
  );
};

export default createRenderer(Route, createContainer(Component));
