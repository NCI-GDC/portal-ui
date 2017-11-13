/* @flow */

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { REACT_APP_GRAPHQL } from '@ncigdc/utils/constants';

global.trace = require('@ncigdc/utils/trace').default;

const Root = require('./Root').default;

const client = new ApolloClient({
  link: new HttpLink({ uri: REACT_APP_GRAPHQL }),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Root />
  </ApolloProvider>,
  document.getElementById('root'),
);
