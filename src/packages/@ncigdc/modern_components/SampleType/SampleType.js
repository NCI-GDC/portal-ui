import React from 'react';
import { compose } from 'recompose';
import { get } from 'lodash';

import { withTheme } from '@ncigdc/theme';
import withRouter from '@ncigdc/utils/withRouter';
import GreyBox from '@ncigdc/uikit/GreyBox';

export default compose(withRouter, withTheme)(({ repository, loading }) => {
  return (
    <span>
      {loading ? (
        <GreyBox style={{ width: '100px' }} />
      ) : (
        get(
          repository,
          'cases.hits.edges[0].node.samples.hits.edges[0].node.sample_type',
          '--',
        )
      )}
    </span>
  );
});
