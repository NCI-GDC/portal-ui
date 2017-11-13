// @flow

import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withLoader } from '@ncigdc/uikit/Loaders/Loader';

let PortalSummaryQuery = gql`
  query PortalSummaryQuery {
    project {
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
    case {
      hits(first: 0) {
        total
      }
    }
    file {
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

let firstLoad = true;

export default Component =>
  compose(
    graphql(PortalSummaryQuery, {
      props: ({ ownProps, data }) => {
        const props = {
          ...data,
          firstLoad,
        };
        firstLoad = false;
        console.log(123, props);
        return props;
      },
    }),
    withLoader,
  )(Component);
