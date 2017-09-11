import React from 'react';
import { compose, mapProps } from 'recompose';
import { get } from 'lodash';

import exploreCase from './exploreCase.relay';
import repositoryCase from './repositoryCase.relay';
import exploreGene from './exploreGene.relay';
import exploreSsm from './exploreSsm.relay';

const typeMap = {
  explore: {
    case: exploreCase,
    gene: exploreGene,
    ssm: exploreSsm,
  },
  repository: {
    case: repositoryCase,
  },
};

export default getProps => Component => {
  return props => {
    const countProps = getProps(props);
    const EnhancedComponent = compose(
      typeMap[countProps.scope][countProps.type],
      mapProps(({ viewer, path }) => {
        return {
          ...props,
          [countProps.key]: get(viewer, path, -1),
        };
      }),
    )(Component);

    return <EnhancedComponent {...props} {...countProps} />;
  };
};
