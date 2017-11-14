import gql from 'graphql-tag';

export default gql`
  query ProjectsAggregationsQuery($filters: JSON) {
    projects {
      aggregations(filters: $filters, aggregations_filter_themselves: false) {
        primary_site {
          buckets {
            doc_count
            key
          }
        }
        program__name {
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
        project_id {
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
        summary__data_categories__data_category {
          buckets {
            doc_count
            key
          }
        }
      }
    }
  }
`;
