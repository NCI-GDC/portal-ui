import gql from 'graphql-tag';

export default gql`
  query HumanBodyQuery {
    files {
      aggregations {
        cases__primary_site {
          buckets {
            doc_count
            key
          }
        }
      }
    }
    cases {
      aggregations {
        primary_site {
          buckets {
            doc_count
            key
          }
        }
      }
    }
  }
`;
