import gql from 'graphql-tag';
import { compose, withPropsOnChange } from 'recompose';
import {
  parseIntParam,
  parseFilterParam,
  parseJSONParam,
} from '@ncigdc/utils/uri';
import { withRouter } from 'react-router-dom';
import { parse } from 'query-string';

const DEFAULT_PROJECT_SORT = [{ field: 'summary.case_count', order: 'desc' }];

export const mapVars = compose(
  withRouter,
  withPropsOnChange(['location'], ({ location: { search } }) => {
    const q = parse(search);

    return {
      variables: {
        offset: parseIntParam(q.offset, 0),
        size: 1000,
        filters: parseFilterParam(q.filters, null),
        projects_sort: parseJSONParam(q.projects_sort, DEFAULT_PROJECT_SORT),
      },
    };
  }),
);

export default gql`
  query ProjectsTableQuery(
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
              file_size
            }
          }
        }
      }
    }
  }
`;
