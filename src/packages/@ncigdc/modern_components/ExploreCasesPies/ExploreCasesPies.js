// @flow
import React from 'react';
import Relay from 'react-relay/classic';
import _ from 'lodash';
import { parse } from 'query-string';
import { IBucket } from '@ncigdc/components/Aggregations/types';
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
          diagnoses__vital_status: { buckets: [IBucket] },
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

const createContainer = Component => Relay.createContainer(Component, {
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
        <PieTitle>Primary Site</PieTitle>
        <SelfFilteringPie
          buckets={_.get(aggregations, 'primary_site.buckets')}
          currentFieldNames={currentFieldNames}
          currentFilters={currentFilters}
          docTypeSingular="case"
          fieldName="cases.primary_site"
          height={125}
          path="doc_count"
          push={push}
          query={query}
          width={125} />
      </ColumnCenter>
      <ColumnCenter>
        <PieTitle>Project</PieTitle>
        <SelfFilteringPie
          buckets={_.get(aggregations, 'project__project_id.buckets')}
          currentFieldNames={currentFieldNames}
          currentFilters={currentFilters}
          docTypeSingular="case"
          fieldName="cases.project.project_id"
          height={125}
          path="doc_count"
          push={push}
          query={query}
          width={125} />
      </ColumnCenter>
      <ColumnCenter>
        <PieTitle>Disease Type</PieTitle>
        <SelfFilteringPie
          buckets={_.get(aggregations, 'disease_type.buckets')}
          currentFieldNames={currentFieldNames}
          currentFilters={currentFilters}
          docTypeSingular="case"
          fieldName="cases.disease_type"
          height={125}
          path="doc_count"
          push={push}
          query={query}
          width={125} />
      </ColumnCenter>
      <ColumnCenter>
        <PieTitle>Gender</PieTitle>
        <SelfFilteringPie
          buckets={_.get(aggregations, 'demographic__gender.buckets')}
          currentFieldNames={currentFieldNames}
          currentFilters={currentFilters}
          docTypeSingular="case"
          fieldName="cases.demographic.gender"
          height={125}
          path="doc_count"
          push={push}
          query={query}
          width={125} />
      </ColumnCenter>
      <ColumnCenter>
        <PieTitle>Vital Status</PieTitle>
        <SelfFilteringPie
          buckets={_.get(aggregations, 'diagnoses__vital_status.buckets')}
          currentFieldNames={currentFieldNames}
          currentFilters={currentFilters}
          docTypeSingular="case"
          fieldName="cases.diagnoses.vital_status"
          height={125}
          path="doc_count"
          push={push}
          query={query}
          width={125} />
      </ColumnCenter>
    </RowCenter>
  );
};

export default createClassicRenderer(Route, createContainer(Component), 161);
