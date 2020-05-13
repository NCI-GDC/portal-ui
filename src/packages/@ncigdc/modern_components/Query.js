import React from 'react';
import { QueryRenderer } from 'react-relay';
import Relay from 'react-relay/classic';
import {
  compose,
  setDisplayName,
  withPropsOnChange,
} from 'recompose';

import { withControlledAccessNetworkLayer } from '@ncigdc/utils/withControlledAccess';
import environment from '@ncigdc/modern_components/environment';
import { withLoader } from '@ncigdc/uikit/Loaders/Loader';
import withRouter from '@ncigdc/utils/withRouter';

export const createClassicRenderer = (Route, Container, minHeight) => {
  const Component = withLoader(Container);

  return withRouter(
    class extends React.Component {
      lastProps = null;

      render() {
        return (
          <div
            style={{
              position: 'relative',
              minHeight,
            }}
            >
            <Relay.Renderer
              Container={Container}
              environment={Relay.Store}
              queryConfig={new Route(this.props)}
              render={({ error, props: relayProps }) => {
                this.lastProps = relayProps || this.lastProps;

                return (
                  <Component
                    minHeight={minHeight}
                    {...this.lastProps}
                    {...this.props}
                    firstLoad={!this.lastProps}
                    loading={!relayProps && !error}
                    />
                );
              }}
              />
          </div>
        );
      }
    },
  );
};

export class BaseQuery extends React.Component {
  lastProps = null;

  render() {
    const {
      cacheConfig,
      nestedViewersMerge = () => {},
      query,
      variables,
    } = this.props;

    return (
      <QueryRenderer
        cacheConfig={cacheConfig}
        environment={environment(this.props.addControlledAccessParams)}
        query={query}
        render={({ error, props: relayProps }) => {
          const { Component, parentProps, parentVariables } = this.props;
          // TODO: handle error
          this.lastProps = relayProps || this.lastProps;

          return (
            <Component
              {...parentProps}
              parentVariables={{
                ...parentProps.parentVariables,
                ...parentProps.variables,
                ...parentVariables,
              }}
              {...this.lastProps}
              {...this.props}
              {...this.lastProps && nestedViewersMerge(this.lastProps.viewer, parentProps.viewer)}
              firstLoad={!this.lastProps}
              loading={!relayProps && !error}
              />
          );
        }}
        variables={variables}
        />
    );
  }
}

export default compose(
  setDisplayName('EnhancedBaseQuery'),
  withControlledAccessNetworkLayer,
  withPropsOnChange(['Component'], ({ Component }) => ({
    Component: withLoader(Component),
  })),
)(BaseQuery);
