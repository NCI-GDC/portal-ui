import React from 'react';
import { compose } from 'recompose';

import { withTheme } from '@ncigdc/theme';
import withRouter from '@ncigdc/utils/withRouter';

export default compose(withRouter, withTheme)(({ repository }) => {
  return (
    <td>
      {repository.cases.hits.edges[0].node.samples.hits.edges[0].node.sample_type.toString()}
    </td>
  );
});
