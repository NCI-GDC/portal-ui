import gql from 'graphql-tag';

export default gql`
  query ProjectsChartsQuery(
    $size: Int
    $offset: Int
    $projects_sort: [Sort]
    $filters: JSON
  ) {
    projects {
      hits(
        first: $size
        offset: $offset
        sort: $projects_sort
        filters: $filters
      ) {
        total
        edges {
          node {
            id
            project_id
            name
            disease_type
            program {
              name
            }
            primary_site
            summary {
              case_count
              data_categories {
                case_count
                data_category
              }
              file_count
            }
          }
        }
      }
    }
  }
`;
