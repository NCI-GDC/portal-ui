import Relay from 'react-relay';
import { div, h } from 'react-hyperscript-helpers';

import TermFacet from 'components/TermFacet';

export const CasesAggregations = props => {
  const docType = 'cases';
  const facets = [
    'demographic__ethnicity',
    'demographic__gender',
    'demographic__race',
    'diagnoses__vital_status',
    'project__disease_type',
    'project__primary_site',
    'project__project_id',
  ];
  return div([
    facets.map(f => h(TermFacet, {
      key: `${docType}.${f}`,
      pathname: '/files',
      field: `${docType}.${f}`,
      params: props.relay.route.params,
      buckets: props.aggregations[f].buckets,
    })),
  ]);
};

export default Relay.createContainer(CasesAggregations, {
  fragments: {
    aggregations: () => Relay.QL`
      fragment on CasesAgg {
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
        project__disease_type {
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
        project__project_id {
          buckets {
            doc_count
            key
          }
        }
      }
    `,
  },
});
