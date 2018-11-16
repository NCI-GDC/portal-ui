// @flow
import React from 'react';
import { QueryRenderer } from 'react-relay';
import Relay from 'react-relay/classic';
import { withPropsOnChange } from 'recompose';

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
          <div style={{ position: 'relative', minHeight }}>
            <Relay.Renderer
              environment={Relay.Store}
              queryConfig={new Route(this.props)}
              Container={Container}
              render={({ props: relayProps, error }) => {
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
    }
  );
};

export class BaseQuery extends React.Component<any, any> {
  lastProps = null;

  render() {
    const { query, variables } = this.props;

    return (
      <QueryRenderer
        environment={environment}
        query={query}
        variables={variables}
        render={({ props: relayProps, error }) => {
          const { parentProps, parentVariables, Component } = this.props;
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
              firstLoad={!this.lastProps}
              loading={!relayProps && !error}
            />
          );
        }}
      />
    );
  }
}

export default withPropsOnChange(['Component'], ({ Component }) => ({
  Component: withLoader(Component),
}))(BaseQuery);
