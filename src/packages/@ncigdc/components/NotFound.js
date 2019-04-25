// @flow
import React from 'react';
import HomeLink from '@ncigdc/components/Links/HomeLink';

export default () => (
  <div className="container-fluid text-center not-found">
    <h1>Page Not Found</h1>
    <p>{`You have searched for something that doesn't exist!`}</p>
    <HomeLink>Go back to the home page.</HomeLink>
  </div>
);
