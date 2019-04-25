// @flow
import React from 'react';
import GreyBox from '@ncigdc/uikit/GreyBox';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';

const MutationsCount = ({ ssmCount, filters, isLoading = false }) => {
  if (isLoading) {
    return <GreyBox />;
  }
  return ssmCount ? (
    <ExploreLink
      className="test-mutations-count"
      merge
      query={{
        searchTableTab: 'mutations',
        filters,
      }}>
      {ssmCount.toLocaleString()}
    </ExploreLink>
  ) : (
    <span className="test-mutations-count">0</span>
  );
};

export default MutationsCount;
