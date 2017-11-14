import ApolloQuery from '@ncigdc/modern_components/ApolloQuery';
import Component from './ProjectsTable';
import query, { mapVars } from './ProjectsTable.query';
export default mapVars(ApolloQuery({ query, Component, minHeight: 600 }));
