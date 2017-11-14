import { compose, mapProps } from 'recompose';
import withFilters from '@ncigdc/utils/withFilters';
import ApolloQuery from '@ncigdc/modern_components/ApolloQuery';
import Component from './ProjectsAggregations';
import query from './ProjectsAggregations.query';

export default compose(
  withFilters(),
  mapProps(p => {
    return { variables: { filters: p.filters } };
  }),
)(ApolloQuery({ query, Component, minHeight: 259 }));
