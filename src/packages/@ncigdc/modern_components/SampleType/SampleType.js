import React from 'react';
import { compose } from 'recompose';

import { withTheme } from '@ncigdc/theme';
import withRouter from '@ncigdc/utils/withRouter';

export default compose(withRouter, withTheme)(({ repository }) => {
  return (
    <span>
      {console.log(repository)}
      {repository.cases.hits.edges.nodes.samples.edges.node.sample_type}
    </span>
  );
});
