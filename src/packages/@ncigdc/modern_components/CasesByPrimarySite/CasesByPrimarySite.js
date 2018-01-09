/* @flow */

import React from 'react';
import { compose, branch, renderComponent, mapProps } from 'recompose';
import CollapsibleList from '@ncigdc/uikit/CollapsibleList';

export default compose(
  branch(
    ({ repository }) => !repository,
    renderComponent(() => <div>No cases found.</div>),
  ),
  mapProps(props => ({
    ...props,
    aggregations: props.repository.cases.aggregations,
  })),
)(({ aggregations }) => {
  const diseasesByName = aggregations.disease_type.buckets.map(
    type => type.key,
  );
  return (
    <span>
      {aggregations.disease_type.buckets.length > 1 && (
        <CollapsibleList
          liStyle={{ whiteSpace: 'normal', listStyleType: 'disc' }}
          toggleStyle={{ fontStyle: 'normal' }}
          data={diseasesByName.slice(0).sort()}
          limit={0}
          expandText={`${aggregations.disease_type.buckets
            .length} Disease Types`}
          collapseText="collapse"
        />
      )}
      {aggregations.disease_type.buckets.length <= 1 &&
        aggregations.disease_type.buckets[0].key}
    </span>
  );
});
