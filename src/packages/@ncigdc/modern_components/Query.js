// @flow
import React from 'react';
import { QueryRenderer } from 'react-relay';
import environment from '@ncigdc/modern_components/environment';
import { ConnectedLoader } from '@ncigdc/uikit/Loaders/Loader';

const lastRelayProps = {};

export const BaseQuery = (props: Object) =>
  <QueryRenderer
    environment={environment}
    render={({ props: nextRelayProps, error }) => {
      // TODO: handle error

      lastRelayProps[props.name] = nextRelayProps || lastRelayProps[props.name];

      if (lastRelayProps[props.name])
        return (
          <props.Component
            {...lastRelayProps[props.name]}
            {...props.parentProps}
            parentVariables={{
              ...props.parentProps.parentVariables,
              ...props.parentProps.variables,
              ...props.parentVariables,
            }}
          />
        );
      return null;
    }}
    {...props}
  />;

export default ({
  minHeight,
  style = { position: 'relative', width: '100%', minHeight },
  ...props
}: Object) =>
  <div style={style}>
    <BaseQuery {...props} />
    <ConnectedLoader name={props.name} customLoader={props.customLoader} />
  </div>;
