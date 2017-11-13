import gql from 'graphql-tag';

export default gql`
  query PortalSummaryQuery {
    projects {
      aggregations {
        primary_site {
          buckets {
            key
          }
        }
      }
      hits(first: 0) {
        total
      }
    }
    cases {
      hits(first: 0) {
        total
      }
    }
    files {
      hits(first: 0) {
        total
      }
    }
    gene_centric {
      hits(first: 0) {
        total
      }
    }
    ssm_centric {
      hits(first: 0) {
        total
      }
    }
  }
`;
