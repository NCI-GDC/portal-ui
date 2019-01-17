import React from 'react';
import _ from 'lodash';

const RecursiveToggledBox = (
  componentWrapper,
  hash,
  toggledTree,
  setToggledTree,
  root
) => {
  if (!hash) {
    return '';
  }
  if (Object.keys(hash) === 0) {
    return '';
  }
  if (typeof hash !== 'object') {
    return <div style={{ backgroundColor: 'green' }}>{hash}</div>;
  }
  const nestedWrapper = (Component, title, isCollapsed, setCollapsed) => (
    <FacetWrapperDiv key={title + 'div'}>
      <FacetHeader
        title={title}
        collapsed={isCollapsed}
        setCollapsed={setCollapsed}
        key={title}
      />
      {isCollapsed || Component}
    </FacetWrapperDiv>
  );

  return Object.keys(hash).map(key => {
    toggledTree[key] = { toggled: false };
    return componentWrapper(
      rec(componentWrapper, hash[key], toggledTree[key], setToggledTree),
      key,
      toggledTree.toggled,
      () => setToggledTree(),
      root
    );
  });
};
