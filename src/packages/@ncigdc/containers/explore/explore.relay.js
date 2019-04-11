import Relay from 'react-relay/classic';

export const CaseAggregationsQuery = {
  initialVariables: {
    exploreCaseCustomFacetFields: '',
    filters: null,
  },
  fragments: {
    facets: filters => Relay.QL`
      fragment on ExploreCases {
        facets(facets: $exploreCaseCustomFacetFields filters: $filters)
      }
    `,
    aggregations: () => Relay.QL`
      fragment on ECaseAggregations {
        primary_site {
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
        disease_type {
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
        diagnoses__age_at_diagnosis {
          stats {
            max
            min
            count
          }
        }
        diagnoses__vital_status {
          buckets {
            doc_count
            key
          }
        }
        diagnoses__days_to_death {
          stats {
            max
            min
            count
          }
        }
        demographic__race {
          buckets {
            doc_count
            key
          }
        }
        demographic__ethnicity {
          buckets {
            doc_count
            key
          }
        }
        summary__experimental_strategies__experimental_strategy {
          buckets {
            doc_count
            key
          }
        }
        samples__sample_type {
          buckets {
            doc_count,
            key
          }
        }
        available_variation_data {
          buckets {
            key_as_string,
            doc_count,
            key
          }
        }
      }
    `,
  },
};
