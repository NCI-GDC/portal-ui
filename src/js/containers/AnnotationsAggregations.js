import Relay from 'react-relay';
import { div, h } from 'react-hyperscript-helpers';

import TermFacet from 'components/TermFacet';

export const AnnotationsAggregations = props => {
  const docType = 'annotations';
  const facets = [
    'classification',
    'category',
    'entity_type',
    'project__primary_site',
    'project__program__name',
    'project__project_id',
    'status',
  ];
  return div([
    facets.map(f => h(TermFacet, {
      key: `${docType}.${f}`,
      pathname: `/${docType}`,
      field: `${docType}.${f}`,
      params: props.relay.route.params,
      buckets: props.aggregations[f].buckets,
    })),
  ]);
};

export default Relay.createContainer(AnnotationsAggregations, {
  fragments: {
    aggregations: () => Relay.QL`
      fragment on AnnotationsAgg {
        category {
          buckets {
            doc_count
            key
          }
        }
        classification {
          buckets {
            doc_count
            key
          }
        }
        entity_type {
          buckets {
            doc_count
            key
          }
        }
        project__primary_site {
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
        project__project_id {
          buckets {
            doc_count
            key
          }
        }
        status {
          buckets {
            doc_count
            key
          }
        }
      }
    `,
  },
});
