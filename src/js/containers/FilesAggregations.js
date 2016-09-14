import Relay from 'react-relay';
import { div, h } from 'react-hyperscript-helpers';

import TermFacet from 'components/TermFacet';

export const FilesAggregations = props => {
  const docType = 'files';
  const facets = [
    'access',
    'data_category',
    'data_format',
    'data_type',
    'experimental_strategy',
    'platform',
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

export default Relay.createContainer(FilesAggregations, {
  fragments: {
    aggregations: () => Relay.QL`
      fragment on FilesAgg {
        access {
          buckets {
            doc_count
            key
          }
        }
        data_category {
          buckets {
            doc_count
            key
          }
        }
        data_format {
          buckets {
            doc_count
            key
          }
        }
        data_type {
          buckets {
            doc_count
            key
          }
        }
        experimental_strategy {
          buckets {
            doc_count
            key
          }
        }
        platform {
          buckets {
            doc_count
            key
          }
        }
      }
    `,
  },
});
