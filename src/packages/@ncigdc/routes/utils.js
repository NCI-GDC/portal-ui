import React from 'react';
import Relay from 'react-relay/classic';
import { connect } from 'react-redux';

import { handleStateChange } from '@ncigdc/dux/relayProgress';
import { prepareNodeParams } from '@ncigdc/utils/routes';

import NotFound from '@ncigdc/components/NotFound';
import Loader from '@ncigdc/uikit/Loaders/Loader';

import { nodeAndViewerQuery } from './queries';

export function makeEntityPage({
  entity,
  Page,
  prepareParams,
  queries = nodeAndViewerQuery,
}) {
  class Route extends Relay.Route {
    static routeName = `${entity}PageRoute`;

    static queries = queries;

    static prepareParams = prepareParams || prepareNodeParams(entity);
  }

  class RouteContainer extends React.Component {
    isRendered = false;

    componentWillReceiveProps(nextProps) {
      if (nextProps.match.params.id !== this.props.match.params.id) {
        this.isRendered = false;
      }
    }

    render() {
      const routeProps = this.props;

      return (
        <Relay.Renderer
          Container={Page}
          environment={Relay.Store}
          onReadyStateChange={handleStateChange(routeProps)}
          queryConfig={new Route(routeProps)}
          render={({ error, props }) => {
            if (error) {
              return <NotFound />;
            } if (props) {
              this.isRendered = true;
              return <Page {...props} />;
            }
            if (!this.isRendered) {
              return <Loader />;
            }
          }}
          />
      );
    }
  }

  return connect()(RouteContainer);
}
