/* @flow */

import React from 'react';
import Overlay from '@ncigdc/uikit/Overlay';
import Spinner from '@ncigdc/uikit/Loaders/Material';

const Loading = ({
  isLoading,
  timedOut,
  pastDelay,
  error,
}: {
  isLoading: boolean,
  timedOut: boolean,
  pastDelay: boolean,
  error: boolean,
}) => {
  if (isLoading) {
    // While our other component is loading...
    if (timedOut) {
      // In case we've timed out loading our other component.
      return <div>Loader timed out!</div>;
    } if (pastDelay) {
      // Display a loading screen after a set delay.
      return (
        <Overlay
          show
          style={{
            position: 'absolute',
            zIndex: 10,
          }}>
          <Spinner />
        </Overlay>
      );
    }
      // Don't flash "Loading..." when we don't need to.
    return null;
  } if (error) {
    // If we aren't loading, maybe
    return <div>Error! Component failed to load</div>;
  }
    // This case shouldn't happen... but we'll return null anyways.
  return null;
};

export default Loading;
