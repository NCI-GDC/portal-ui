/* @flow */

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { REACT_APP_GRAPHQL } from '@ncigdc/utils/constants';

global.trace = require('@ncigdc/utils/trace').default;

const Root = require('./Root').default;

const link = new ApolloLink((operation, forward) => {
  operation.setContext({
    uri: REACT_APP_GRAPHQL + `/${operation.operationName}`,
  });
  return forward(operation);
});

const client = new ApolloClient({
  link: link.concat(createHttpLink()),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Root />
  </ApolloProvider>,
  document.getElementById('root'),
);
