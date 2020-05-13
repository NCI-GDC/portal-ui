// @flow
import React from 'react';
import Relay from 'react-relay/classic';
import _ from 'lodash';
import { parse } from 'query-string';

import { viewerQueryCA } from '@ncigdc/routes/queries';
import { parseFilterParam } from '@ncigdc/utils/uri';
import {
  ColumnCenter,
  RowCenter,
  PieTitle,
  SelfFilteringPie,
} from '@ncigdc/components/TabPieCharts';
import { createClassicRenderer } from '@ncigdc/modern_components/Query';

export type TProps = {
  push: Function,
  query: Object,
  viewer: {
    explore: {
      cases: {
        aggregations: {
          demographic__ethnicity: { buckets: [IBucket] },
          demographic__gender: { buckets: [IBucket] },
          demographic__race: { buckets: [IBucket] },
          demographic__vital_status: { buckets: [IBucket] },
          disease_type: { buckets: [IBucket] },
          primary_site: { buckets: [IBucket] },
          project__program__name: { buckets: [IBucket] },
          project__project_id: { buckets: [IBucket] },
        },
      },
    },
  },
};

const COMPONENT_NAME = 'ExploreCasesPies';

class Route extends Relay.Route {
  static routeName = COMPONENT_NAME;

  static queries = viewerQueryCA;

  static prepareParams = ({ defaultFilters = null, location: { search } }) => {
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
      viewerWithCA: () => Relay.QL`
        fragment RequiresStudy on Root {
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
                demographic__vital_status {
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
  push,
  query,
  viewerWithCA: { explore: { cases: { aggregations } } },
}: TProps) => {
  const currentFilters =
    (query && parseFilterParam((query || {}).filters, {}).content) || [];
  const currentFieldNames = currentFilters.map(f => f.content.field);
  return (
    <RowCenter>
      <ColumnCenter>
        <PieTitle>Primary Site</PieTitle>
        <SelfFilteringPie
          docTypeSingular="case"
          buckets={_.get(aggregations, 'primary_site.buckets')}
          fieldName="cases.primary_site"
          currentFieldNames={currentFieldNames}
          currentFilters={currentFilters}
          query={query}
          push={push}
          path="doc_count"
          diameter={125}
        />
      </ColumnCenter>
      <ColumnCenter>
        <PieTitle>Project</PieTitle>
        <SelfFilteringPie
          docTypeSingular="case"
          buckets={_.get(aggregations, 'project__project_id.buckets')}
          fieldName="cases.project.project_id"
          currentFieldNames={currentFieldNames}
          currentFilters={currentFilters}
          query={query}
          push={push}
          path="doc_count"
          diameter={125}
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
          diameter={125}
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
          diameter={125}
        />
      </ColumnCenter>
      <ColumnCenter>
        <PieTitle>Vital Status</PieTitle>
        <SelfFilteringPie
          docTypeSingular="case"
          buckets={_.get(aggregations, 'demographic__vital_status.buckets')}
          fieldName="cases.demographic.vital_status"
          currentFieldNames={currentFieldNames}
          currentFilters={currentFilters}
          query={query}
          push={push}
          path="doc_count"
          diameter={125}
        />
      </ColumnCenter>
    </RowCenter>
  );
};

export default createClassicRenderer(Route, createContainer(Component), 161);
