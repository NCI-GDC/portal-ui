import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { withLoader } from '@ncigdc/uikit/Loaders/Loader';

let loaded = {};
export default ({ query, Component, minHeight, Loader }) =>
  compose(
    graphql(query, {
      props: ({ ownProps, data }) => {
        const props = {
          ...data,
          loadedOnce: loaded[Component.displayName],
        };
        loaded[Component.displayName] = true;
        return props;
      },
    }),
    withLoader({ minHeight, Loader }),
  )(Component);
